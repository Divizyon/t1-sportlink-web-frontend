import { NextResponse } from "next/server"
import puppeteer from 'puppeteer'
import type { NewsItem } from "@/types/news"

// Mevcut haberleri tutacak geçici depo
let existingNews: NewsItem[] = []

// Spor anahtar kelimeleri
const sportKeywords = [
  // Spor dalları
  'futbol', 'basketbol', 'voleybol', 'tenis', 'yüzme', 'atletizm', 'judo', 'karate',
  'güreş', 'boks', 'motosiklet', 'formula 1', 'moto gp', 'golf', 'hokey', 'rugby',
  'beyzbol', 'amerikan futbolu', 'hentbol', 'masa tenisi', 'badminton', 'kayak',
  'snowboard', 'buz pateni', 'artistik jimnastik', 'ritmik jimnastik', 'okçuluk',
  'atıcılık', 'binicilik', 'yelken', 'kürek', 'kano', 'triatlon', 'maraton',
  'süper lig', 'premier lig', 'la liga', 'serie a', 'bundesliga', 'champions league',
  'europa league', 'conference league', 'nba', 'euroleague', 'fiba', 'olimpiyat',
  'dünya kupası', 'avrupa şampiyonası', 'dünya şampiyonası',

  // Spor terimleri
  'maç', 'lig', 'turnuva', 'şampiyona', 'kupa', 'stadyum', 'salon', 'arena',
  'antrenman', 'teknik direktör', 'koç', 'oyuncu', 'transfer', 'gol', 'asist',
  'faul', 'penaltı', 'kart', 'sarı kart', 'kırmızı kart', 'ofsayt', 'korner',
  'frikik', 'serbest vuruş', 'penaltı atışı', 'devre arası', 'uzatma', 'penaltılar',
  'puan', 'sıralama', 'puan durumu', 'kadro', 'milli takım', 'a milli', 'u21',
  'u19', 'u17', 'federasyon', 'tff', 'tbbl', 'tvf', 'tbf', 'tff 1. lig',

  // Spor organizasyonları
  'fifa', 'uefa', 'fib', 'fiba', 'ioc', 'olimpiyat komitesi', 'paralimpik',
  'milli olimpiyat komitesi', 'türkiye olimpiyat komitesi', 'türkiye milli olimpiyat komitesi',

  // Spor medyası
  'spor haber', 'spor yorum', 'spor analiz', 'spor programı', 'spor kanalı',
  'spor gazetesi', 'spor dergisi', 'spor yazarı', 'spor muhabiri',

  // Spor tesisleri
  'spor salonu', 'spor kompleksi', 'spor merkezi', 'fitness salonu', 'spor kulübü',
  'spor okulu', 'spor akademisi', 'spor lisesi', 'spor fakültesi',

  // Sporcu isimleri ve takımlar
  'fenerbahçe', 'galatasaray', 'beşiktaş', 'trabzonspor', 'başakşehir',
  'real madrid', 'barcelona', 'manchester united', 'liverpool', 'bayern münih',
  'paris saint-germain', 'juventus', 'milan', 'inter', 'arsenal', 'chelsea',
  'manchester city', 'tottenham', 'dortmund', 'psg', 'ajax', 'porto', 'benfica'
]

// Spor ile ilgili olmayan anahtar kelimeler
const nonSportKeywords = [
  // Siyaset ve ekonomi
  'siyaset', 'ekonomi', 'borsa', 'dolar', 'euro', 'altın', 'petrol', 'enerji',
  'hükümet', 'bakan', 'başbakan', 'cumhurbaşkanı', 'meclis', 'seçim', 'parti',
  'muhalefet', 'iktidar', 'bütçe', 'vergi', 'enflasyon', 'faiz', 'merkez bankası',

  // Sağlık
  'sağlık', 'tıp', 'hastane', 'doktor', 'ilaç', 'tedavi', 'kanser', 'covid',
  'virüs', 'pandemi', 'aşı', 'hastalık', 'ameliyat', 'muayene', 'reçete',
  'eczane', 'hasta', 'sağlık bakanlığı', 'diyet', 'beslenme', 'vitamin',

  // Eğitim
  'eğitim', 'okul', 'üniversite', 'sınav', 'öğrenci', 'öğretmen', 'meb',
  'yök', 'üniversite sınavı', 'lise', 'ilkokul', 'ortaokul', 'ders', 'sınıf',
  'ödev', 'proje', 'tez', 'mezuniyet', 'diploma', 'akademik', 'rektor',

  // Teknoloji
  'teknoloji', 'yazılım', 'donanım', 'telefon', 'bilgisayar', 'internet',
  'sosyal medya', 'facebook', 'twitter', 'instagram', 'tiktok', 'youtube',
  'apple', 'samsung', 'microsoft', 'google', 'amazon', 'meta', 'netflix',
  'yapay zeka', 'blockchain', 'kripto', 'bitcoin', 'ethereum', 'nft',

  // Sanat ve eğlence
  'sanat', 'müzik', 'sinema', 'tiyatro', 'konser', 'festival', 'sergi',
  'magazin', 'dizi', 'film', 'oyuncu', 'şarkıcı', 'yıldız', 'ünlü',
  'yemek', 'restoran', 'tarif', 'mutfak', 'şef', 'gastronomi',
  'moda', 'giyim', 'kuşam', 'defile', 'koleksiyon', 'tasarımcı',

  // Seyahat
  'seyahat', 'turizm', 'otel', 'tatil', 'gezi', 'tur', 'uçak', 'bilet',
  'vize', 'pasaport', 'havaalanı', 'terminal', 'rezervasyon', 'turist',
  'tur operatörü', 'seyahat acentesi', 'tur rehberi', 'turizm bakanlığı',

  // Magazin ve kişisel haberler
  'magazin', 'ünlü', 'yıldız', 'düğün', 'nişan', 'evlilik', 'boşanma',
  'hamilelik', 'bebek', 'çocuk', 'aile', 'özel hayat', 'gizli aşk',
  'flört', 'sevgili', 'nişanlı', 'eş', 'koca', 'karı', 'aşk', 'romantik',
  'güzellik', 'estetik', 'makyaj', 'saç', 'stil', 'moda', 'giyim',
  'instagram', 'sosyal medya', 'paylaşım', 'fotoğraf', 'video', 'story',
  'röportaj', 'açıklama', 'itiraf', 'sır', 'gizem', 'dedikodu', 'skandal'
]

// Timeout ile fetch işlemi
const fetchWithTimeout = async (url: string, timeout = 15000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// URL doğrulama fonksiyonu
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Görsel URL'sini doğrula ve düzelt
async function validateImageUrl(imageUrl: string, baseUrl: string): Promise<string | undefined> {
  try {
    if (!imageUrl) return undefined;
    
    // Göreceli URL'i mutlak URL'e çevir
    const absoluteUrl = new URL(imageUrl, baseUrl).href;
    
    // Görsel erişilebilirliğini kontrol et
    const response = await fetch(absoluteUrl, { method: 'HEAD' });
    if (response.ok) {
      return absoluteUrl;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// Haber başlığı ve içeriğinin sporla ilgili olup olmadığını kontrol eden fonksiyon
function isSportsRelated(title: string, content: string): boolean {
  const fullText = (title + " " + content).toLowerCase()
  
  // Başlıkta veya içerikte spor anahtar kelimesi var mı kontrol et
  const hasSportKeyword = sportKeywords.some(keyword => 
    fullText.includes(keyword.toLowerCase())
  )
  
  // Sporla ilgili olmayan anahtar kelimeleri kontrol et - biraz daha esnek ol
  const hasNonSportKeyword = nonSportKeywords.some(keyword => 
    fullText.includes(keyword.toLowerCase()) && 
    !fullText.includes('spor') && 
    !fullText.includes('futbol') && 
    !fullText.includes('basketbol')
  )
  
  // Başlıkta spor kelimesi varsa direk kabul et
  if (title.toLowerCase().includes('spor')) return true
  
  // Spor anahtar kelimesi varsa VE sporla ilgili olmayan anahtar kelime yoksa true döndür
  return hasSportKeyword && !hasNonSportKeyword
}

// Varsayılan spor resmi URL'i
const DEFAULT_SPORTS_IMAGE = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop';

const scrapeNews = async (url: string) => {
  console.log('Puppeteer başlatılıyor...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920x1080',
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);

    // Gereksiz kaynakları engelle
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['stylesheet', 'font', 'image', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Tarayıcı kimliğini ayarla
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    console.log('Spor haberleri taranıyor:', url);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Spor haberlerini topla
    console.log('Spor haberleri toplanıyor...');
    const newsItems = await page.evaluate((baseUrl) => {
      const articles = Array.from(document.querySelectorAll('article, .news-item, .article-item, .post-item, .item'));
      return articles.map(article => {
        // Başlık için farklı seçicileri dene
        let title = '';
        const titleSelectors = ['h1', 'h2', 'h3', '.title', '.news-title'];
        for (const selector of titleSelectors) {
          const titleElement = article.querySelector(selector);
          if (titleElement?.textContent) {
            title = titleElement.textContent.trim();
            break;
          }
        }

        // İçerik için farklı seçicileri dene
        let content = '';
        const contentSelectors = ['p', '.content', '.description', '.summary'];
        for (const selector of contentSelectors) {
          const contentElements = article.querySelectorAll(selector);
          if (contentElements.length > 0) {
            content = Array.from(contentElements)
              .map(el => el.textContent?.trim())
              .filter(Boolean)
              .join(' ');
            break;
          }
        }

        // Resim için farklı seçicileri dene
        let image = '';
        const imgElement = article.querySelector('img');
        if (imgElement) {
          image = imgElement.getAttribute('src') || imgElement.getAttribute('data-src') || '';
        }

        // Link için farklı seçicileri dene
        let link = '';
        const linkElement = article.querySelector('a');
        if (linkElement) {
          link = linkElement.getAttribute('href') || '';
          // Göreceli URL'i mutlak URL'e çevir
          if (link && !link.startsWith('http')) {
            try {
              link = new URL(link, baseUrl).href;
            } catch {
              link = baseUrl + (link.startsWith('/') ? link : '/' + link);
            }
          }
        }

        return {
          title,
          content,
          image,
          link
        };
      }).filter(item => {
        // Başlık ve içerik kontrolü
        if (!item.title || !item.content) return false;

        // Spor ile ilgili olup olmadığını kontrol et
        return item.title.toLowerCase().includes('spor') || 
               item.content.toLowerCase().includes('spor') ||
               item.link?.toLowerCase().includes('spor');
      });
    }, url);

    if (!newsItems || newsItems.length === 0) {
      console.log('Spor haberi bulunamadı');
      throw new Error('Spor haberi bulunamadı');
    }

    console.log(`${newsItems.length} spor haberi bulundu`);

    // Her bir haber için detay sayfasını kontrol et
    const detailedNews = [];
    for (const item of newsItems) {
      if (!item.link) continue;

      try {
        const detailPage = await browser.newPage();
        await detailPage.setDefaultNavigationTimeout(30000);
        
        await detailPage.setRequestInterception(true);
        detailPage.on('request', (request) => {
          const resourceType = request.resourceType();
          if (['stylesheet', 'font', 'image', 'media'].includes(resourceType)) {
            request.abort();
          } else {
            request.continue();
          }
        });

        await detailPage.goto(item.link, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        const detailData = await detailPage.evaluate(() => {
          // Meta etiketlerinden resim URL'i ara
          let image = '';
          const metaSelectors = [
            'meta[property="og:image"]',
            'meta[name="twitter:image"]',
            'meta[property="og:image:secure_url"]'
          ];
          
          for (const selector of metaSelectors) {
            const metaTag = document.querySelector(selector);
            if (metaTag) {
              const url = metaTag.getAttribute('content');
              if (url && url.startsWith('http')) {
                image = url;
                break;
              }
            }
          }

          // İçerik için farklı seçicileri dene
          let content = '';
          const contentSelectors = [
            'article p',
            '.news-content p',
            '.article-content p',
            '.content p',
            '.detail-content p'
          ];

          for (const selector of contentSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              content = Array.from(elements)
                .map(el => el.textContent?.trim())
                .filter(Boolean)
                .join(' ');
              if (content.length > 100) break;
            }
          }

          return { image, content };
        });

        if (detailData.content && detailData.content.length > item.content.length) {
          item.content = detailData.content;
        }
        if (detailData.image && !item.image) {
          item.image = detailData.image;
        }

        await detailPage.close();
        await new Promise(resolve => setTimeout(resolve, 1000));

        detailedNews.push({
          title: item.title,
          content: item.content,
          image: item.image || null,
          hasImage: !!item.image,
          contentLength: item.content.length,
          imageStatus: item.image ? 'available' : 'not_available'
        });

      } catch (error) {
        console.error(`Haber detayı alınırken hata oluştu: ${item.link}`, error);
        continue;
      }
    }

    await browser.close();
    console.log(`${detailedNews.length} spor haberi başarıyla işlendi`);
    return detailedNews;

  } catch (error) {
    console.error('Haber çekme işlemi sırasında hata:', error);
    await browser.close();
    throw new Error(`Haberler çekilirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};

export async function POST(request: Request) {
  let browser = null;
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      console.error('URL parametresi eksik');
      return NextResponse.json(
        { error: "URL parametresi gerekli" },
        { status: 400 }
      );
    }

    // URL'in geçerli olup olmadığını kontrol et
    try {
      new URL(url);
    } catch (e) {
      console.error('Geçersiz URL formatı:', url);
      return NextResponse.json(
        { error: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }

    console.log('Haber çekme işlemi başlatılıyor:', url);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920x1080',
      ]
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);

    // Gereksiz kaynakları engelle
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['stylesheet', 'font', 'image', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Tarayıcı kimliğini ayarla
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    console.log('Spor haberleri taranıyor:', url);
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
    } catch (error) {
      console.error('Sayfa yüklenirken hata:', error);
      throw new Error('Sayfa yüklenemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }

    // Spor haberlerini topla
    console.log('Spor haberleri toplanıyor...');
    let newsItems;
    try {
      newsItems = await page.evaluate((baseUrl) => {
        const articles = Array.from(document.querySelectorAll('article, .news-item, .article-item, .post-item, .item'));
        return articles.map(article => {
          // Başlık için farklı seçicileri dene
          let title = '';
          const titleSelectors = ['h1', 'h2', 'h3', '.title', '.news-title'];
          for (const selector of titleSelectors) {
            const titleElement = article.querySelector(selector);
            if (titleElement?.textContent) {
              title = titleElement.textContent.trim();
              break;
            }
          }

          // İçerik için farklı seçicileri dene
          let content = '';
          const contentSelectors = ['p', '.content', '.description', '.summary'];
          for (const selector of contentSelectors) {
            const contentElements = article.querySelectorAll(selector);
            if (contentElements.length > 0) {
              content = Array.from(contentElements)
                .map(el => el.textContent?.trim())
                .filter(Boolean)
                .join(' ');
              break;
            }
          }

          // Resim için farklı seçicileri dene
          let image = '';
          const imgElement = article.querySelector('img');
          if (imgElement) {
            image = imgElement.getAttribute('src') || imgElement.getAttribute('data-src') || '';
          }

          // Link için farklı seçicileri dene
          let link = '';
          const linkElement = article.querySelector('a');
          if (linkElement) {
            link = linkElement.getAttribute('href') || '';
            // Göreceli URL'i mutlak URL'e çevir
            if (link && !link.startsWith('http')) {
              try {
                link = new URL(link, baseUrl).href;
              } catch {
                link = baseUrl + (link.startsWith('/') ? link : '/' + link);
              }
            }
          }

          return {
            title,
            content,
            image,
            link
          };
        }).filter(item => {
          if (!item.title || !item.content) return false;
          return item.title.toLowerCase().includes('spor') || 
                 item.content.toLowerCase().includes('spor') ||
                 item.link?.toLowerCase().includes('spor');
        });
      }, url);
    } catch (error) {
      console.error('Haber toplama işlemi sırasında hata:', error);
      throw new Error('Haberler toplanırken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }

    if (!newsItems || newsItems.length === 0) {
      console.log('Spor haberi bulunamadı:', url);
      return NextResponse.json(
        { error: "Bu kaynakta spor haberi bulunamadı. Lütfen başka bir kaynak deneyin." },
        { status: 404 }
      );
    }

    console.log(`${newsItems.length} spor haberi bulundu, detaylar alınıyor...`);
    const detailedNews = [];

    for (const item of newsItems) {
      if (!item.link) {
        console.log('Link olmayan haber atlanıyor');
        continue;
      }

      try {
        const detailPage = await browser.newPage();
        await detailPage.setDefaultNavigationTimeout(30000);
        
        await detailPage.setRequestInterception(true);
        detailPage.on('request', (request) => {
          const resourceType = request.resourceType();
          if (['stylesheet', 'font', 'image', 'media'].includes(resourceType)) {
            request.abort();
          } else {
            request.continue();
          }
        });

        console.log('Haber detayı alınıyor:', item.link);
        await detailPage.goto(item.link, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        const detailData = await detailPage.evaluate(() => {
          // Meta etiketlerinden resim URL'i ara
          let image = '';
          const metaSelectors = [
            'meta[property="og:image"]',
            'meta[name="twitter:image"]',
            'meta[property="og:image:secure_url"]'
          ];
          
          for (const selector of metaSelectors) {
            const metaTag = document.querySelector(selector);
            if (metaTag) {
              const url = metaTag.getAttribute('content');
              if (url && url.startsWith('http')) {
                image = url;
                break;
              }
            }
          }

          // İçerik için farklı seçicileri dene
          let content = '';
          const contentSelectors = [
            'article p',
            '.news-content p',
            '.article-content p',
            '.content p',
            '.detail-content p'
          ];

          for (const selector of contentSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              content = Array.from(elements)
                .map(el => el.textContent?.trim())
                .filter(Boolean)
                .join(' ');
              if (content.length > 100) break;
            }
          }

          return { image, content };
        });

        if (detailData.content && detailData.content.length > item.content.length) {
          item.content = detailData.content;
        }
        if (detailData.image && !item.image) {
          item.image = detailData.image;
        }

        await detailPage.close();
        await new Promise(resolve => setTimeout(resolve, 1000));

        detailedNews.push({
          title: item.title,
          content: item.content,
          image: item.image || null,
          hasImage: !!item.image,
          contentLength: item.content.length,
          imageStatus: item.image ? 'available' : 'not_available'
        });

        console.log('Haber başarıyla işlendi:', item.title);

      } catch (error) {
        console.error(`Haber detayı alınırken hata oluştu (${item.link}):`, error);
        continue;
      }
    }

    if (browser) {
      await browser.close();
    }

    if (detailedNews.length === 0) {
      console.log('İşlenebilen spor haberi bulunamadı');
      return NextResponse.json(
        { error: "Spor haberleri işlenirken bir sorun oluştu. Lütfen tekrar deneyin." },
        { status: 404 }
      );
    }

    console.log(`${detailedNews.length} spor haberi başarıyla işlendi`);
    return NextResponse.json(detailedNews);

  } catch (error) {
    console.error('Haber çekme işlemi sırasında kritik hata:', error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Browser kapatılırken hata:', closeError);
      }
    }
    return NextResponse.json(
      { 
        error: "Haberler çekilirken bir hata oluştu. Lütfen tekrar deneyin.",
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
} 