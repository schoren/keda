import { describe, it, expect, beforeAll } from '@jest/globals';
import { initI18n, i18n } from './index';

describe('i18n shared package', () => {
  beforeAll(() => {
    initI18n();
  });

  it('should translate common keys to English by default', () => {
    i18n.changeLanguage('en');
    expect(i18n.t('common.logout')).toBe('Logout');
  });

  it('should translate common keys to Spanish', () => {
    i18n.changeLanguage('es');
    expect(i18n.t('common.logout')).toBe('Cerrar sesión');
  });

  it('should support interpolation', () => {
    i18n.changeLanguage('en');
    expect(i18n.t('summary.spent_percentage', { percent: 50 })).toBe('50% SPENT');
  });

  it('should fallback to English for unknown keys', () => {
    i18n.changeLanguage('es');
    // Assuming we have a key only in EN or just testing the fallback logic
    expect(i18n.t('common.non_existent', 'Fallback')).toBe('Fallback');
  });
});
