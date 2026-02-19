import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

export const initI18n = (options: any = {}) => {
  if (i18n.isInitialized) return i18n;

  const { language, detector, ...rest } = options;

  if (detector) {
    i18n.use(detector);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      ...rest,
    });

  return i18n;
};

export { useTranslation, Trans } from 'react-i18next';
export { i18n };
export default i18n;
