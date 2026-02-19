/* eslint-disable */
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number; fill?: boolean; priority?: boolean }) => (
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock react-i18next and @repo/i18n
import esTranslations from '../../packages/i18n/src/locales/es.json';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const parts = key.split('.');
      let result: any = esTranslations;
      for (const part of parts) {
        result = result?.[part];
      }
      return result || key;
    },
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'es',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => { },
  },
}));

vi.mock('@repo/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const parts = key.split('.');
      let result: any = esTranslations;
      for (const part of parts) {
        result = result?.[part];
      }
      return result || key;
    },
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'es',
    },
  }),
}));
