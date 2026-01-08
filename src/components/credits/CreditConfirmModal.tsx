'use client';

import styled, { keyframes, css } from 'styled-components';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

const coinDrop = keyframes`
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  50% { transform: translateY(5px) rotate(180deg); opacity: 1; }
  100% { transform: translateY(0) rotate(360deg); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const ModalContent = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CreditIcon = styled.div<{ $insufficient?: boolean }>`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ $insufficient }) =>
    $insufficient
      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
      : 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  animation: ${coinDrop} 0.5s ease-out;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
`;

const CreditDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CreditBox = styled.div<{ $highlight?: boolean }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $highlight }) =>
    $highlight ? 'var(--primary-50)' : theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 100px;
  ${({ $highlight }) => $highlight && css`animation: ${pulse} 2s ease-in-out infinite;`}
`;

const CreditValue = styled.div<{ $warning?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $warning }) => ($warning ? '#f59e0b' : 'var(--accent)')};
`;

const CreditLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Arrow = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: rgba(var(--accent-rgb), 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: inline-block;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const WarningBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: #92400e;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

interface CreditConfirmModalProps {
  isOpen: boolean;
  action: string;
  creditsRequired: number;
  currentCredits: number;
  hasSubscription: boolean;
  isProcessing: boolean;
  canProceed: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CreditConfirmModal({
  isOpen,
  action,
  creditsRequired,
  currentCredits,
  hasSubscription,
  isProcessing,
  canProceed,
  onConfirm,
  onCancel,
}: CreditConfirmModalProps) {
  const router = useRouter();
  const remainingCredits = currentCredits - creditsRequired;
  const isInsufficientCredits = !hasSubscription && currentCredits < creditsRequired;

  const handleBuyCredits = () => {
    onCancel();
    router.push(ROUTES.APP.BILLING);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="sm">
      <ModalContent>
        <CreditIcon $insufficient={isInsufficientCredits}>
          {isInsufficientCredits ? '⚠️' : '🪙'}
        </CreditIcon>

        {isInsufficientCredits ? (
          <>
            <Title>Yetersiz Kredi</Title>
            <Description>
              <strong>{action}</strong> için <strong>{creditsRequired} kredi</strong> gerekiyor,
              ancak <strong>{currentCredits} krediniz</strong> var.
            </Description>
            <WarningBanner>
              <span>💡</span>
              <span>Kredi satın alarak devam edebilir veya Pro aboneliğe geçebilirsiniz.</span>
            </WarningBanner>
            <ButtonGroup>
              <Button variant="secondary" onClick={onCancel}>
                Vazgeç
              </Button>
              <Button onClick={handleBuyCredits}>
                Kredi Satın Al
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Title>Kredi Kullanımı</Title>
            <Description>
              <strong>{action}</strong> işlemi için kredi kullanılacak.
            </Description>

            <ActionText>
              {action}
            </ActionText>

            <CreditDisplay>
              <CreditBox>
                <CreditValue>{currentCredits}</CreditValue>
                <CreditLabel>Mevcut</CreditLabel>
              </CreditBox>
              <Arrow>→</Arrow>
              <CreditBox $highlight>
                <CreditValue $warning={remainingCredits <= 2}>
                  {remainingCredits}
                </CreditValue>
                <CreditLabel>Kalan</CreditLabel>
              </CreditBox>
            </CreditDisplay>

            {remainingCredits <= 2 && remainingCredits > 0 && (
              <WarningBanner>
                <span>⚠️</span>
                <span>İşlem sonrası krediniz azalacak. Daha fazla kredi almayı düşünün.</span>
              </WarningBanner>
            )}

            <ButtonGroup>
              <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
                Vazgeç
              </Button>
              <Button onClick={onConfirm} isLoading={isProcessing} disabled={!canProceed}>
                {creditsRequired} Kredi Kullan
              </Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
