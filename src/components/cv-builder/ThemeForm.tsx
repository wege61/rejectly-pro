import styled from "styled-components";
import { useCVStore } from "./store";
import { motion } from "framer-motion";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
  line-height: 1.5;
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.08)'};
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
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
    box-shadow: 0 4px 16px ${props.$color}30;
  `}

  &:hover {
    border-color: ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  box-shadow: 0 4px 12px ${props => props.$color}40, inset 0 2px 4px rgba(255,255,255,0.2);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const ThemeName = styled.span<{ $active: boolean; $color: string }>`
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.7)'};
`;

const THEMES = [
  { id: '#000000', name: 'Onyx Black' },
  { id: '#2563eb', name: 'Professional Blue' },
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
      <div>
        <Title>Accent Color</Title>
        <Subtitle>Give your CV a final touch of personality. This will subtly color the headers and section dividers.</Subtitle>
      </div>

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
