import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'zh-TW'],
    resources: {
      en: {
        translation: {
          search: 'Search',
          searchHighlightWords: 'Highlight matching words',
          currentPlaying: 'Current Playing',
          dropFileDescription:
            'Drop .yaml file here to launch timetags explorer',
        },
      },
      'zh-TW': {
        translation: {
          search: '搜尋',
          searchHighlightWords: '強調顯示符合的字詞',
          currentPlaying: '目前播放影片',
          dropFileDescription: '拖曳 .yaml 檔案至此以啟動時間標記瀏覽器',
        },
      },
    },
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });
