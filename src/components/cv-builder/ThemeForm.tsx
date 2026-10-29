import styled from "styled-components";
import { useCVStore } from "./store";
import { motion } from "framer-motion";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ThemesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ThemeButton = styled.button<{ $color: string; $active: boolean }>`
  background: color-mix(in srgb, var(--rj-ink) 2%, transparent);
  border: 1px solid ${props => props.$active ? props.$color : 'color-mix(in srgb, var(--rj-ink) 8%, transparent)'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  ${props => props.$active && `
    background: linear-gradient(145deg, color-mix(in srgb, var(--rj-ink) 5%, transparent) 0%, color-mix(in srgb, var(--rj-ink) 1%, transparent) 100%);
    box-shadow: 0 4px 16px ${props.$color}30;
  `}

  &:hover {
    border-color: ${props => props.$active ? props.$color : 'color-mix(in srgb, var(--rj-ink) 20%, transparent)'};
    transform: translateY(-2px);
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  box-shadow: 0 4px 12px ${props => props.$color}40, inset 0 2px 4px color-mix(in srgb, var(--rj-ink) 20%, transparent);
  border: 2px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
`;

const ThemeName = styled.span<{ $active: boolean; $color: string }>`
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? props.$color : 'color-mix(in srgb, var(--rj-ink) 70%, transparent)'};
`;

const THEMES = [
  { id: '#000000', name: 'Onyx Black' },
  { id: 'var(--rj-ink)', name: 'Professional Blue' },
  { id: '#0f172a', name: 'Executive Navy' },
  { id: '#059669', name: 'Emerald' },
  { id: '#9f1239', name: 'Burgundy' },
  { id: '#6d28d9', name: 'Amethyst' }
];

export function ThemeForm() {
  const { cv, updateThemeColor } = useCVStore();

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <ThemesGrid>
        {THEMES.map((theme) => {
          const isActive = cv.themeColor === theme.id;
          return (
            <ThemeButton 
              key={theme.id}
              $color={theme.id}
              $active={isActive}
              onClick={() => updateThemeColor(theme.id)}
            >
              {isActive && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', color: theme.id }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
              <ColorSwatch $color={theme.id} />
              <ThemeName $active={isActive} $color={theme.id}>{theme.name}</ThemeName>
            </ThemeButton>
          );
        })}
      </ThemesGrid>
    </FormContainer>
  );
}
