import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGES_DIR = path.join(__dirname, '../messages');
const MASTER_FILE = path.join(MESSAGES_DIR, 'en.json');
const TARGET_LOCALES = ['te', 'hi', 'ta', 'kn'];
const API_KEY = process.env.TRANSLATION_API_KEY;

async function translateText(text, targetLocale) {
  if (!API_KEY) {
    console.warn(`[WARN] No TRANSLATION_API_KEY found. Skipping real translation for "${text}" to ${targetLocale}.`);
    return `[${targetLocale}] ${text}`;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: targetLocale,
          format: 'text',
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data.translations[0].translatedText;
  } catch (err) {
    console.error(`[ERROR] Translation failed: ${err.message}`);
    return `[ERROR] ${text}`;
  }
}

function getNestedValue(obj, keys) {
  return keys.reduce((acc, key) => acc?.[key], obj);
}

function setNestedValue(obj, keys, value) {
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
}

async function syncLocale(source, target, locale, currentPath = []) {
  for (const key in source) {
    const value = source[key];
    const path = [...currentPath, key];

    if (typeof value === 'object' && value !== null) {
      if (!target[key] || typeof target[key] !== 'object') {
        console.log(`[RESET] Key ${path.join('.')} is not an object in ${locale}, resetting...`);
        target[key] = {};
      }
      await syncLocale(value, target[key], locale, path);
    } else {
      if (!target[key] || target[key].startsWith('[ERROR]')) {
        console.log(`[SYNC] Translating ${path.join('.')} to ${locale}...`);
        const translated = await translateText(value, locale);
        target[key] = translated;
      }
    }
  }
}

async function run() {
  console.log('🚀 Starting Translation Sync...');
  
  if (!fs.existsSync(MASTER_FILE)) {
    console.error('Master file en.json not found!');
    process.exit(1);
  }

  const enContent = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf-8'));

  for (const locale of TARGET_LOCALES) {
    const targetFile = path.join(MESSAGES_DIR, `${locale}.json`);
    let targetContent = {};

    if (fs.existsSync(targetFile)) {
      try {
        targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
      } catch (e) {
        console.warn(`[WARN] Failed to parse existing ${locale}.json, starting fresh.`);
      }
    }

    console.log(`\n📄 Processing locale: ${locale}`);
    await syncLocale(enContent, targetContent, locale);
    
    // Clean up keys that no longer exist in master
    const cleanContent = (source, target) => {
      for (const key in target) {
        if (!(key in source)) {
          console.log(`[CLEAN] Removing unused key: ${key} from ${locale}`);
          delete target[key];
        } else if (typeof target[key] === 'object') {
          cleanContent(source[key], target[key]);
        }
      }
    };
    cleanContent(enContent, targetContent);

    fs.writeFileSync(targetFile, JSON.stringify(targetContent, null, 2), 'utf-8');
    console.log(`[DONE] Updated ${locale}.json`);
  }

  console.log('\n✅ Translation sync complete!');
}

run();
