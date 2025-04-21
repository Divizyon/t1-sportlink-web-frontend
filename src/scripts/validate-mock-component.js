/**
 * Geliştirilmiş Mockup ve Bileşen İlişkilerini Doğrulama Scripti
 * SportLink projesi için uyarlanmış versiyon
 *
 * Bu script şunları yapar:
 * 1. src/mockups dizinindeki tüm dosyaları tarayarak export edilen mock verileri bulur
 * 2. src/components dizinindeki tüm bileşen dosyalarını tarayarak:
 *    - Mockup importlarını bulur
 *    - İmport edilen mockup verilerinin gerçekten kullanılıp kullanılmadığını kontrol eder
 * 3. src/mockups/README.md dosyasındaki dokümante edilmiş ilişkileri çıkarır
 * 4. Gerçek kullanımlar ile dokümantasyonu karşılaştırır
 *
 * Kullanım: node scripts/validate-mockup-relationships-sportlink.js
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Proje Yapısı - SportLink uyarlaması
// Burada düzeltme yapılıyor: Doğru proje kök dizini ve alt dizinlerini bulma
// Script'in çalıştırıldığı konuma göre otomatik tespit
const scriptDir = __dirname;
let rootDir;

// Dosya yolu düzeltmesi - Birkaç olası konfigürasyonu kontrol edelim
if (
  path.basename(scriptDir) === "scripts" &&
  fs.existsSync(path.resolve(scriptDir, "..", "src"))
) {
  // scripts/ klasöründe çalıştırılıyor (proje kökünde)
  rootDir = path.resolve(scriptDir, "..");
} else if (
  path.basename(scriptDir) === "scripts" &&
  path.basename(path.resolve(scriptDir, "..")) === "src"
) {
  // src/scripts/ klasöründe çalıştırılıyor
  rootDir = path.resolve(scriptDir, "../..");
} else if (path.basename(path.dirname(scriptDir)) === "src") {
  // scripts klasörü src içinde başka bir alt klasörde
  rootDir = path.resolve(scriptDir, "../../");
} else {
  // Başka bir durumda, en azından mevcut dizinde veya bir üst dizinde src/ olup olmadığını kontrol et
  if (fs.existsSync(path.resolve(scriptDir, "src"))) {
    rootDir = scriptDir;
  } else if (fs.existsSync(path.resolve(scriptDir, "..", "src"))) {
    rootDir = path.resolve(scriptDir, "..");
  } else {
    console.error(
      "Hata: src/ dizini bulunamadı. Lütfen script'i doğru konumda çalıştırın."
    );
    process.exit(1);
  }
}

// Gerekli dizinleri belirleyelim
const SRC_DIR = path.resolve(rootDir, "src");
const MOCKUPS_DIR = path.resolve(SRC_DIR, "mockups");
const COMPONENTS_DIR = path.resolve(SRC_DIR, "components");
const CONTEXTS_DIR = path.resolve(SRC_DIR, "contexts");
const APP_DIR = path.resolve(SRC_DIR, "app");

// README.md dosyasının konumunu belirleyelim
// Önce src/mockups/README.md'yi deneyelim
let README_PATH = path.resolve(MOCKUPS_DIR, "README.md");
// Eğer yoksa, proje kök dizinindeki README.md'yi deneyelim
if (!fs.existsSync(README_PATH)) {
  README_PATH = path.resolve(rootDir, "README.md");
  console.log(
    `${COLORS.yellow}src/mockups/README.md bulunamadı, ${README_PATH} kullanılıyor.${COLORS.reset}`
  );
}

// Yol bilgilerini göster
console.log(`Proje kök dizini: ${rootDir}`);
console.log(`Src dizini: ${SRC_DIR}`);
console.log(`Mockups dizini: ${MOCKUPS_DIR}`);
console.log(`README dosyası: ${README_PATH}`);

// Konsol renkleri
const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

/**
 * Mockup dosyalarından export edilen tüm değişkenleri ve bulundukları dosyaları çıkarır
 * @returns {Object} - { MOCKUP_NAME: dosyaYolu } formatında bir nesne
 */
function extractMockupExports() {
  console.log(`${COLORS.cyan}Mockup dosyaları taranıyor...${COLORS.reset}`);

  // Mockup dizini var mı kontrol et
  if (!fs.existsSync(MOCKUPS_DIR)) {
    console.error(
      `${COLORS.red}Hata: ${MOCKUPS_DIR} dizini bulunamadı.${COLORS.reset}`
    );
    return {};
  }

  // Mockup dosyalarını bul
  const mockupFiles = glob.sync("**/*.ts", {
    cwd: MOCKUPS_DIR,
    absolute: true,
  });
  console.log(`${mockupFiles.length} mockup dosyası bulundu.`);

  const mockupExports = {};

  mockupFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");

      // export const XXX formatındaki tüm export'ları bul
      const exportMatches = content.match(/export const ([A-Z_][A-Z0-9_]*)/g);

      if (exportMatches) {
        exportMatches.forEach((match) => {
          const exportName = match.replace("export const ", "");
          const relativePath = path.relative(SRC_DIR, file);
          mockupExports[exportName] = relativePath;
        });
      }
    } catch (err) {
      console.error(
        `${COLORS.red}Hata: ${file} dosyası okunamadı${COLORS.reset}`,
        err
      );
    }
  });

  console.log(`${Object.keys(mockupExports).length} mockup export'u bulundu.`);
  return mockupExports;
}

/**
 * Bileşen dosyalarında mockup importlarını ve gerçek kullanımlarını bulur
 * @returns {Array} - [{ mockupName, componentFile, isActuallyUsed }] formatında bir dizi
 */
function findMockupImportsAndUsage() {
  console.log(`${COLORS.cyan}Bileşen dosyaları taranıyor...${COLORS.reset}`);

  // Bileşen dizini var mı kontrol et
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(
      `${COLORS.red}Hata: ${COMPONENTS_DIR} dizini bulunamadı.${COLORS.reset}`
    );
    return [];
  }

  // Bileşen dosyalarını bul
  const componentFiles = glob.sync("**/*.{tsx,jsx}", {
    cwd: COMPONENTS_DIR,
    absolute: true,
  });
  console.log(`${componentFiles.length} bileşen dosyası bulundu.`);

  const relationships = [];

  componentFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(SRC_DIR, file);

      // @/mockups'tan yapılan importları bul
      const importLines =
        content.match(/import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g) || [];

      importLines.forEach((line) => {
        // Import edilen değişkenleri çıkar
        const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
        if (importMatch) {
          const imports = importMatch[1]
            .split(",")
            .map((s) => s.trim())
            .filter((s) => /^[A-Z_][A-Z0-9_]*$/.test(s)); // Sadece büyük harfli mockup adlarını al

          imports.forEach((importName) => {
            // İmport edilen mockup'un gerçekten kullanılıp kullanılmadığını kontrol et
            const isActuallyUsed = new RegExp(`\\b${importName}\\b`).test(
              // İmport satırlarını hariç tut
              content.replace(
                /import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g,
                ""
              )
            );

            relationships.push({
              mockupName: importName,
              componentFile: relativePath,
              isActuallyUsed: isActuallyUsed,
            });
          });
        }
      });
    } catch (err) {
      console.error(
        `${COLORS.red}Hata: ${file} dosyası okunamadı${COLORS.reset}`,
        err
      );
    }
  });

  console.log(`${relationships.length} mockup-bileşen ilişkisi bulundu.`);
  return relationships;
}

/**
 * README.md dosyasındaki tablolardan dokümante edilmiş ilişkileri çıkarır
 * @returns {Array} - [{ mockupName, componentFile }] formatında bir dizi
 */
function extractReadmeRelationships() {
  console.log(`${COLORS.cyan}README.md tabloları taranıyor...${COLORS.reset}`);

  try {
    if (!fs.existsSync(README_PATH)) {
      console.error(
        `${COLORS.red}Hata: ${README_PATH} dosyası bulunamadı.${COLORS.reset}`
      );
      return [];
    }

    const readmeContent = fs.readFileSync(README_PATH, "utf8");

    // Tablolarda bulunan mockup-bileşen ilişkilerini çıkar
    // | MOCKUP_NAME | src/components/path/Component.tsx | Açıklama |
    const relationshipsRegex =
      /\|\s*([A-Z_][A-Z0-9_]*)\s*\|\s*(src\/components\/[^\|]+?)\s*\|/g;

    const relationships = [];
    let match;

    while ((match = relationshipsRegex.exec(readmeContent)) !== null) {
      relationships.push({
        mockupName: match[1].trim(),
        componentFile: match[2].trim(),
      });
    }

    console.log(`${relationships.length} dokümante edilmiş ilişki bulundu.`);
    return relationships;
  } catch (err) {
    console.error(
      `${COLORS.red}Hata: README.md dosyası okunamadı${COLORS.reset}`,
      err
    );
    console.error(err);
    return [];
  }
}

/**
 * Context dosyalarını da tarar ve orada kullanılan mockupları bulur
 * @returns {Array} - [{ mockupName, componentFile, isActuallyUsed }] formatında bir dizi
 */
function findMockupUsageInContexts() {
  console.log(`${COLORS.cyan}Context dosyaları taranıyor...${COLORS.reset}`);

  // Context dizini var mı kontrol et
  if (!fs.existsSync(CONTEXTS_DIR)) {
    console.log(
      `${COLORS.yellow}Uyarı: ${CONTEXTS_DIR} dizini bulunamadı.${COLORS.reset}`
    );
    return [];
  }

  // Context dosyalarını bul
  const contextFiles = glob.sync("**/*.{tsx,jsx,ts}", {
    cwd: CONTEXTS_DIR,
    absolute: true,
  });
  console.log(`${contextFiles.length} context dosyası bulundu.`);

  const relationships = [];

  contextFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(SRC_DIR, file);

      // @/mockups'tan yapılan importları bul
      const importLines =
        content.match(/import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g) || [];

      importLines.forEach((line) => {
        // Import edilen değişkenleri çıkar
        const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
        if (importMatch) {
          const imports = importMatch[1]
            .split(",")
            .map((s) => s.trim())
            .filter((s) => /^[A-Z_][A-Z0-9_]*$/.test(s)); // Sadece büyük harfli mockup adlarını al

          imports.forEach((importName) => {
            // İmport edilen mockup'un gerçekten kullanılıp kullanılmadığını kontrol et
            const isActuallyUsed = new RegExp(`\\b${importName}\\b`).test(
              // İmport satırlarını hariç tut
              content.replace(
                /import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g,
                ""
              )
            );

            relationships.push({
              mockupName: importName,
              componentFile: relativePath,
              isActuallyUsed: isActuallyUsed,
            });
          });
        }
      });
    } catch (err) {
      console.error(
        `${COLORS.red}Hata: ${file} dosyası okunamadı${COLORS.reset}`,
        err
      );
    }
  });

  console.log(`${relationships.length} mockup-context ilişkisi bulundu.`);
  return relationships;
}

/**
 * App (page) dosyalarını da tarar ve orada kullanılan mockupları bulur
 * @returns {Array} - [{ mockupName, componentFile, isActuallyUsed }] formatında bir dizi
 */
function findMockupUsageInPages() {
  console.log(`${COLORS.cyan}Page dosyaları taranıyor...${COLORS.reset}`);

  // App dizini var mı kontrol et
  if (!fs.existsSync(APP_DIR)) {
    console.log(
      `${COLORS.yellow}Uyarı: ${APP_DIR} dizini bulunamadı.${COLORS.reset}`
    );
    return [];
  }

  // Page dosyalarını bul
  const pageFiles = glob.sync("**/*.{tsx,jsx,ts}", {
    cwd: APP_DIR,
    absolute: true,
  });
  console.log(`${pageFiles.length} page dosyası bulundu.`);

  const relationships = [];

  pageFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(SRC_DIR, file);

      // @/mockups'tan yapılan importları bul
      const importLines =
        content.match(/import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g) || [];

      importLines.forEach((line) => {
        // Import edilen değişkenleri çıkar
        const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
        if (importMatch) {
          const imports = importMatch[1]
            .split(",")
            .map((s) => s.trim())
            .filter((s) => /^[A-Z_][A-Z0-9_]*$/.test(s)); // Sadece büyük harfli mockup adlarını al

          imports.forEach((importName) => {
            // İmport edilen mockup'un gerçekten kullanılıp kullanılmadığını kontrol et
            const isActuallyUsed = new RegExp(`\\b${importName}\\b`).test(
              // İmport satırlarını hariç tut
              content.replace(
                /import\s+{[^}]+}\s+from\s+['"]@\/mockups.*['"]/g,
                ""
              )
            );

            relationships.push({
              mockupName: importName,
              componentFile: relativePath,
              isActuallyUsed: isActuallyUsed,
            });
          });
        }
      });
    } catch (err) {
      console.error(
        `${COLORS.red}Hata: ${file} dosyası okunamadı${COLORS.reset}`,
        err
      );
    }
  });

  console.log(`${relationships.length} mockup-page ilişkisi bulundu.`);
  return relationships;
}

/**
 * Gerçek ilişkiler ile dokümante edilmiş ilişkileri karşılaştırır
 */
function validateRelationships() {
  console.log(
    `${COLORS.magenta}=== SportLink Mockup-Bileşen İlişkileri Doğrulaması ====${COLORS.reset}`
  );

  // Tüm verilerimizi toplayalım
  const mockupExports = extractMockupExports();

  // Bileşenlerde, context'lerde ve sayfalarda kullanımları bul
  const componentsRelationships = findMockupImportsAndUsage();
  const contextsRelationships = findMockupUsageInContexts();
  const pagesRelationships = findMockupUsageInPages();

  // Tüm ilişkileri birleştir
  const allRelationshipsWithUsage = [
    ...componentsRelationships,
    ...contextsRelationships,
    ...pagesRelationships,
  ];

  const documentedRelationships = extractReadmeRelationships();

  // Sadece gerçekten kullanılan ilişkileri filtrele
  const actuallyUsedRelationships = allRelationshipsWithUsage.filter(
    (rel) => rel.isActuallyUsed
  );

  // Kullanılmayan importları bul
  const unusedImports = allRelationshipsWithUsage.filter(
    (rel) => !rel.isActuallyUsed
  );

  // Eğer dokümante edilmiş ilişki yoksa ve README bulunamadıysa, hata mesajı ver ve çık
  if (documentedRelationships.length === 0 && !fs.existsSync(README_PATH)) {
    console.error(
      `${COLORS.red}Hata: README.md dosyası bulunamadı veya dokümante edilmiş ilişki yok.${COLORS.reset}`
    );
    console.log(
      `${COLORS.yellow}README.md dosyasını oluşturun ve mockup-bileşen ilişkilerini dokümante edin.${COLORS.reset}`
    );
    console.log(`${COLORS.yellow}Örnek format:${COLORS.reset}`);
    console.log(`
| Mockup Verisi | Bileşen Dosyası | Kullanım |
| ------------- | --------------- | -------- |
| MOCKUP_NAME | src/components/path/Component.tsx | Açıklama |
    `);
    // Gerçek kullanımları listele
    console.log(`${COLORS.cyan}Tespit edilen kullanımlar:${COLORS.reset}`);
    actuallyUsedRelationships.forEach((rel) => {
      console.log(
        `- ${rel.mockupName} mockup verisi ${rel.componentFile} dosyasında kullanılıyor.`
      );
    });
    return 1;
  }

  // 0. Kullanılmayan İmportlar (Import edilmiş ama kullanılmayan)
  console.log(
    `\n${COLORS.gray}=== Kullanılmayan İmportlar ====${COLORS.reset}`
  );
  console.log(
    `${COLORS.gray}(Import edilmiş fakat dosya içinde kullanılmayan mockup verileri)${COLORS.reset}\n`
  );

  if (unusedImports.length === 0) {
    console.log(
      `${COLORS.green}✓ Tüm import edilen mockup verileri aktif olarak kullanılmaktadır.${COLORS.reset}`
    );
  } else {
    unusedImports.forEach((rel) => {
      console.log(
        `${COLORS.gray}⚠ ${rel.mockupName}${COLORS.reset} mockup verisi ${COLORS.blue}${rel.componentFile}${COLORS.reset} dosyasında import edilmiş fakat kullanılmıyor.`
      );
    });
    console.log(
      `\n${COLORS.gray}Toplam ${unusedImports.length} kullanılmayan import bulundu.${COLORS.reset}`
    );
  }

  // 1. Eksik Dokümantasyonlar (Gerçekte var ama dokümante edilmemiş)
  console.log(
    `\n${COLORS.yellow}=== Eksik Dokümantasyonlar ====${COLORS.reset}`
  );
  console.log(
    `${COLORS.yellow}(Gerçekte kullanılan fakat README'de bulunmayan ilişkiler)${COLORS.reset}\n`
  );

  let missingCount = 0;

  actuallyUsedRelationships.forEach((rel) => {
    const isDocumented = documentedRelationships.some(
      (doc) =>
        doc.mockupName === rel.mockupName &&
        rel.componentFile.includes(doc.componentFile)
    );

    if (!isDocumented) {
      missingCount++;
      console.log(
        `${COLORS.yellow}✘ ${rel.mockupName}${COLORS.reset} mockup verisi ${COLORS.blue}${rel.componentFile}${COLORS.reset} dosyasında kullanılıyor fakat dokümante edilmemiş.`
      );
    }
  });

  if (missingCount === 0) {
    console.log(
      `${COLORS.green}✓ Tüm kullanılan mockup ilişkileri dokümante edilmiş.${COLORS.reset}`
    );
  } else {
    console.log(
      `\n${COLORS.yellow}Toplam ${missingCount} eksik dokümantasyon bulundu.${COLORS.reset}`
    );
  }

  // 2. Yanlış/Eski Dokümantasyonlar (Dokümante edilmiş ama gerçekte yok veya kullanılmıyor)
  console.log(
    `\n${COLORS.red}=== Yanlış/Eski Dokümantasyonlar ====${COLORS.reset}`
  );
  console.log(
    `${COLORS.red}(README'de bulunan fakat gerçekte kullanılmayan ilişkiler)${COLORS.reset}\n`
  );

  let incorrectCount = 0;

  documentedRelationships.forEach((doc) => {
    const exists = actuallyUsedRelationships.some(
      (rel) =>
        rel.mockupName === doc.mockupName &&
        rel.componentFile.includes(doc.componentFile)
    );

    // Export varlığını kontrol et
    const isExported = !!mockupExports[doc.mockupName];

    if (!exists) {
      incorrectCount++;
      if (!isExported) {
        console.log(
          `${COLORS.red}✘ ${doc.mockupName}${COLORS.reset} mockup'u export edilmemiş fakat ${COLORS.blue}${doc.componentFile}${COLORS.reset} için dokümante edilmiş.`
        );
      } else {
        const isImportedButNotUsed = unusedImports.some(
          (rel) =>
            rel.mockupName === doc.mockupName &&
            rel.componentFile.includes(doc.componentFile)
        );

        if (isImportedButNotUsed) {
          console.log(
            `${COLORS.red}✘ ${doc.mockupName}${COLORS.reset} mockup'u ${COLORS.blue}${doc.componentFile}${COLORS.reset} dosyasında import edilmiş fakat kullanılmıyor. Ancak dokümante edilmiş.`
          );
        } else {
          console.log(
            `${COLORS.red}✘ ${doc.mockupName}${COLORS.reset} mockup'u ${COLORS.blue}${doc.componentFile}${COLORS.reset} tarafından kullanılmıyor fakat dokümante edilmiş.`
          );
        }
      }
    }
  });

  if (incorrectCount === 0) {
    console.log(
      `${COLORS.green}✓ Tüm dokümante edilmiş ilişkiler gerçek kullanımlarla uyumlu.${COLORS.reset}`
    );
  } else {
    console.log(
      `\n${COLORS.red}Toplam ${incorrectCount} yanlış/eski dokümantasyon bulundu.${COLORS.reset}`
    );
  }

  // Özet
  console.log(`\n${COLORS.magenta}=== Özet ====${COLORS.reset}`);
  console.log(
    `${COLORS.cyan}• Toplam export edilen mockup sayısı: ${
      Object.keys(mockupExports).length
    }${COLORS.reset}`
  );
  console.log(
    `${COLORS.cyan}• Toplam import edilen mockup-bileşen ilişkisi: ${allRelationshipsWithUsage.length}${COLORS.reset}`
  );
  console.log(
    `${COLORS.cyan}• Gerçekten kullanılan mockup-bileşen ilişkisi: ${actuallyUsedRelationships.length}${COLORS.reset}`
  );
  console.log(
    `${COLORS.gray}• Kullanılmayan import sayısı: ${unusedImports.length}${COLORS.reset}`
  );
  console.log(
    `${COLORS.cyan}• Toplam dokümante edilmiş ilişki: ${documentedRelationships.length}${COLORS.reset}`
  );
  console.log(
    `${COLORS.yellow}• Eksik dokümantasyon sayısı: ${missingCount}${COLORS.reset}`
  );
  console.log(
    `${COLORS.red}• Yanlış/eski dokümantasyon sayısı: ${incorrectCount}${COLORS.reset}`
  );

  // Yüzdesel uyum hesaplama
  const totalActuallyUsed = actuallyUsedRelationships.length;
  const correctlyDocumented = totalActuallyUsed - missingCount;
  const documentationAccuracy =
    totalActuallyUsed > 0 ? (correctlyDocumented / totalActuallyUsed) * 100 : 0;

  console.log(
    `\n${
      COLORS.magenta
    }Dokümantasyon doğruluk oranı: ${documentationAccuracy.toFixed(2)}%${
      COLORS.reset
    }`
  );

  // Dokümantasyon güncellemeleri için öneriler
  console.log(
    `\n${COLORS.cyan}=== Güncellenecek Dokümantasyon için Öneriler ====${COLORS.reset}`
  );

  if (missingCount > 0) {
    console.log(
      `\n${COLORS.yellow}Dokümantasyona eklenecek ilişkiler (birkaç örnek):${COLORS.reset}`
    );
    console.log(`
| Mockup Verisi | Bileşen Dosyası | Kullanım |
| ------------- | --------------- | -------- |`);

    // En çok 5 örnek göster
    const exampleMissingRelations = actuallyUsedRelationships
      .filter(
        (rel) =>
          !documentedRelationships.some(
            (doc) =>
              doc.mockupName === rel.mockupName &&
              rel.componentFile.includes(doc.componentFile)
          )
      )
      .slice(0, 5);

    exampleMissingRelations.forEach((rel) => {
      console.log(
        `| ${rel.mockupName} | ${rel.componentFile} | Açıklama buraya yazılacak |`
      );
    });
  }

  if (incorrectCount > 0) {
    console.log(
      `\n${COLORS.red}README.md'den kaldırılacak eski ilişkiler (birkaç örnek):${COLORS.reset}`
    );

    // En çok 5 örnek göster
    const exampleIncorrectRelations = documentedRelationships
      .filter(
        (doc) =>
          !actuallyUsedRelationships.some(
            (rel) =>
              rel.mockupName === doc.mockupName &&
              rel.componentFile.includes(doc.componentFile)
          )
      )
      .slice(0, 5);

    exampleIncorrectRelations.forEach((doc) => {
      console.log(
        `- ${doc.mockupName} mockup verisi, ${doc.componentFile} bileşeninde artık kullanılmıyor.`
      );
    });
  }

  // Başarı/başarısızlık durumu
  if (missingCount === 0 && incorrectCount === 0) {
    console.log(
      `\n${COLORS.green}✓ Tüm mockup-bileşen ilişkileri doğru şekilde dokümante edilmiş.${COLORS.reset}`
    );
    return 0; // Başarılı
  } else {
    console.log(
      `\n${COLORS.red}✘ Mockup-bileşen ilişkilerinde tutarsızlıklar var. Lütfen README.md dosyasını güncelleyin.${COLORS.reset}`
    );
    return 1; // Başarısız
  }
}

// Doğrulama işlemini başlat
process.exit(validateRelationships());
