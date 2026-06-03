/**
 * Company design tokens — replace values when brand guidelines are available.
 */
export const companyTheme = {
  colors: {
    background: '#0f1419',
    surface: '#1a2332',
    surfaceElevated: '#243044',
    border: '#3d4f66',
    text: '#e8edf4',
    textMuted: '#8b9cb3',
    primary: '#3b6ea8',
    primaryHover: '#4a82c4',
    success: '#16a34a',
    successDark: '#15803d',
    warning: '#eab308',
    danger: '#dc2626',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  font: {
    family: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    sizeSm: '0.875rem',
    sizeMd: '1rem',
    sizeLg: '1.25rem',
    sizeXl: '1.75rem',
    sizeHero: '3rem',
  },
} as const;

export function applyThemeToDocument(): void {
  const { colors, radius, font } = companyTheme;
  const root = document.documentElement;
  root.style.setProperty('--color-bg', colors.background);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-elevated', colors.surfaceElevated);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-text-muted', colors.textMuted);
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-dark', colors.successDark);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--radius-sm', radius.sm);
  root.style.setProperty('--radius-md', radius.md);
  root.style.setProperty('--radius-lg', radius.lg);
  root.style.setProperty('--font-family', font.family);
}
