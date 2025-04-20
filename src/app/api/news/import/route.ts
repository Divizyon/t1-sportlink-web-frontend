import { NextResponse } from "next/server";
import type { NewsItem } from "@/types/news";
import * as cheerio from 'cheerio';
import https from 'https';

// Site yapısı tipi
interface SiteStructure {
  newsLinkSelector: string;
  titleSelector: string;
  contentSelector: string;
  imageSelector: string;
  sportsSectionUrl: string;
}

// Spor kategorileri için anahtar kelimeler
const SPORTS_KEYWORDS = [
  "futbol",
  "basketbol",
  "voleybol",
  "spor",
  "maç",
  "lig",
  "transfer",
  "süper lig",
  "şampiyonlar ligi",
  "galatasaray",
  "fenerbahçe",
  "beşiktaş",
  "trabzonspor",
  "takım",
  "gol",
  "puan",
  "teknik direktör",
  "stadyum",
  "turnuva"
];

// Haber sitesi yapıları
const NEWS_SITE_STRUCTURES: Record<string, SiteStructure> = {
  'hurriyet.com.tr': {
    newsLinkSelector: 'a[href*="haber"], .news-box a, .news-item a, article a',
    titleSelector: 'h1[class*="title"], .news-title, .article-title, meta[property="og:title"]',
    contentSelector: '.news-content, .article-content, .news-description, article, [itemprop="articleBody"]',
    imageSelector: 'meta[property="og:image"], .news-image img, article img',
    sportsSectionUrl: '/spor'
  },
  'milliyet.com.tr': {
    newsLinkSelector: 'a[href*="haber"], .news-card a, .card a, article a',
    titleSelector: '.news-detail h1, .story-title, h1.title, meta[property="og:title"]',
    contentSelector: '.news-detail-text, .story-content, article, [itemprop="articleBody"]',
    imageSelector: 'meta[property="og:image"], .news-detail-img img, article img',
    sportsSectionUrl: '/spor'
  },
  'sabah.com.tr': {
    newsLinkSelector: 'a[href*="haber"], .box.news a, article a',
    titleSelector: '.inner-news-title h1, .news-title h1, meta[property="og:title"]',
    contentSelector: '.news-content, .article-body, article, [itemprop="articleBody"]',
    imageSelector: 'meta[property="og:image"], .news-image img, article img',
    sportsSectionUrl: '/spor'
  },
  // Genel yapı - diğer siteler için
  'default': {
    newsLinkSelector: 'a[href*="haber"], article a, .news a, .content a, a[href*="html"], a[href*="news"], a[href*="makale"]',
    titleSelector: 'h1, .title, article h1, .news-title, .article-title, meta[property="og:title"], [class*="title"], [class*="header"]',
    contentSelector: 'article, .content, .news-content, .article-content, [class*="content"], [class*="article"], meta[property="og:description"], [itemprop="articleBody"]',
    imageSelector: 'meta[property="og:image"], article img, .news-image img, .article-image img, [class*="image"] img, [itemprop="image"]',
    sportsSectionUrl: '/spor'
  }
};

// URL'yi normalize et
const normalizeUrl = (url: string, baseUrl: string): string => {
  try {
    const urlObj = new URL(url, baseUrl);
    return urlObj.href;
  } catch {
    return url;
  }
};

// HTTPS isteği yap
const fetchWithTimeout = async (url: string, timeout = 10000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const http = isHttps ? https : require('http');
    
    const agent = isHttps ? new https.Agent({
      rejectUnauthorized: false
    }) : undefined;

    const request = http.get(url, { 
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }, (response: any) => {
      let data = '';
      response.on('data', (chunk: string) => data += chunk);
      response.on('end', () => resolve(data));
    });

    request.on('error', reject);
    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Haber sitesinin yapısını belirle
const getSiteStructure = (url: string): SiteStructure => {
  const hostname = new URL(url).hostname.replace('www.', '');
  return NEWS_SITE_STRUCTURES[hostname] || NEWS_SITE_STRUCTURES['default'];
};

// Spor haberi kontrolü
const isSportsContent = (title: string, content: string = ""): boolean => {
  const combinedText = `${title} ${content}`.toLowerCase();
  return SPORTS_KEYWORDS.some(keyword => combinedText.includes(keyword.toLowerCase()));
};

// HTML'den metin içeriğini temizle
const cleanText = (text: string): string => {
  return text
    .replace(/[\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Haber linklerini topla
const collectNewsLinks = ($: cheerio.CheerioAPI, baseUrl: string, structure: SiteStructure): string[] => {
  const links = new Set<string>();
  
  $(structure.newsLinkSelector).each((_, element) => {
    const href = $(element).attr('href');
    if (href && !href.includes('#') && !href.includes('javascript:')) {
      try {
        const fullUrl = normalizeUrl(href, baseUrl);
        if (!links.has(fullUrl)) {
          links.add(fullUrl);
        }
      } catch (error) {
        console.error('Link normalizasyon hatası:', error);
      }
    }
  });

  return Array.from(links);
};

// Haber detaylarını çek
const extractNewsDetails = async (url: string, structure: SiteStructure): Promise<NewsItem | null> => {
  try {
    const html = await fetchWithTimeout(url);
    const $ = cheerio.load(html);

    let title = '';
    let content = '';
    let image = '';

    // Title'ı bul
    const titleElement = $(structure.titleSelector).first();
    title = titleElement.text() || titleElement.attr('content') || '';

    // Content'i bul
    const contentElement = $(structure.contentSelector).first();
    content = contentElement.text() || contentElement.attr('content') || '';

    // Image'i bul
    const imageElement = $(structure.imageSelector).first();
    image = imageElement.attr('content') || imageElement.attr('src') || '';

    if (!title || !content || !isSportsContent(title, content)) {
      return null;
    }

    const tags = SPORTS_KEYWORDS.filter(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase()) || 
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      id: Math.random().toString(36).substring(2),
      title: cleanText(title),
      content: cleanText(content),
      category: "Spor",
      image: image ? normalizeUrl(image, url) : undefined,
      publishDate: new Date().toISOString(),
      tags: tags.length > 0 ? tags : ["spor"],
      status: "pending",
      hasImage: !!image,
      contentLength: content.length,
      imageStatus: image ? 'available' : 'error',
      sourceUrl: url
    };
  } catch (error) {
    console.error(`Haber çekme hatası (${url}):`, error);
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL gerekli" },
        { status: 400 }
      );
    }

    // Haber sitesi yapısını belirle
    const structure = getSiteStructure(url);
    
    try {
      // Ana sayfadan haber linklerini topla
      const html = await fetchWithTimeout(url);
      const $ = cheerio.load(html);
      const newsLinks = collectNewsLinks($, url, structure);

      // Her bir haber için detayları çek
      const newsPromises = newsLinks.slice(0, 5).map(link => extractNewsDetails(link, structure));
      const newsResults = await Promise.all(newsPromises);
      
      // Başarılı sonuçları filtrele
      const validNews = newsResults.filter((news): news is NewsItem => news !== null);

      if (validNews.length === 0) {
        return NextResponse.json(
          { error: "Spor haberi bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json(validNews);
    } catch (error) {
      console.error("Haber çekme hatası:", error);
      return NextResponse.json(
        { error: "Haberler çekilirken bir hata oluştu" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Geçersiz istek" },
      { status: 400 }
    );
  }
} 