'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signUp } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Kayıt başarılı! E-postanızı kontrol edin.');
      // Email confirmation bekleyeceğiz
    } catch (error: any) {
      toast.error(error.message || 'Kayıt yapılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Title>Hesap Oluştur</Title>
      <Subtitle>Ücretsiz hesap oluşturun ve CV analizine başlayın</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          label="Ad Soyad"
          type="text"
          placeholder="Ahmet Yılmaz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          autoComplete="name"
        />

        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoComplete="email"
        />

        <Input
          label="Şifre"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          autoComplete="new-password"
          helperText="En az 6 karakter"
        />

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Kayıt Ol
        </Button>
      </Form>

      <TermsText>
        Kayıt olarak{' '}
        <a href={ROUTES.PUBLIC.TERMS} target="_blank">
          Kullanım Koşulları
        </a>{' '}
        ve{' '}
        <a href={ROUTES.PUBLIC.PRIVACY} target="_blank">
          Gizlilik Politikası
        </a>
        'nı kabul etmiş olursunuz.
      </TermsText>

      <Footer>
        Zaten hesabınız var mı?{' '}
        <a href={ROUTES.AUTH.LOGIN}>Giriş yapın</a>
      </Footer>
    </>
  );
}