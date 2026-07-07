const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const sourceText = document.getElementById("sourceText");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const result = document.getElementById("result");

sourceText.value = "Hello, how are you today?";

translateBtn.addEventListener("click", translateText);
swapBtn.addEventListener("click", swapLanguages);
copyBtn.addEventListener("click", copyTranslation);
speakBtn.addEventListener("click", speakTranslation);

function swapLanguages() {
  const previousSource = sourceLangSelect.value;
  sourceLangSelect.value = targetLangSelect.value;
  targetLangSelect.value = previousSource;
}

async function translateText() {
  const text = sourceText.value.trim();

  if (!text) {
    result.textContent = "Please enter some text to translate.";
    return;
  }

  result.textContent = "Translating...";
  translateBtn.disabled = true;
  translateBtn.textContent = "Translating...";

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangSelect.value}|${targetLangSelect.value}`
    );

    if (!response.ok) {
      throw new Error("Translation request failed.");
    }

    const data = await response.json();
    const translatedText =
      data?.responseData?.translatedText?.trim() ||
      data?.matches?.find((match) => match?.translation?.trim())?.translation?.trim() ||
      "No translation returned.";

    result.textContent = translatedText;
  } catch (error) {
    result.textContent = `Unable to translate right now. ${error.message}`;
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
}

async function copyTranslation() {
  if (!result.textContent || result.textContent.includes("translated text")) {
    return;
  }

  try {
    await navigator.clipboard.writeText(result.textContent);
    copyBtn.textContent = "Copied";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1200);
  } catch (error) {
    result.textContent = "Copy failed. Please copy manually.";
  }
}

function speakTranslation() {
  if (!result.textContent || result.textContent.includes("translated text") || result.textContent.includes("Translating")) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(result.textContent);
  utterance.lang = getSpeechLanguageCode(targetLangSelect.value);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function getSpeechLanguageCode(langCode) {
  const speechMap = {
    en: "en-US",
    fr: "fr-FR",
    es: "es-ES",
    de: "de-DE",
    hi: "hi-IN",
    ur: "ur-PK",
    sd: "sd-PK",
    ar: "ar-SA",
    zh: "zh-CN",
    ja: "ja-JP",
    pt: "pt-BR",
    ru: "ru-RU"
  };

  return speechMap[langCode] || langCode;
}
