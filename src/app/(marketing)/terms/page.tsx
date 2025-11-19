"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";

// ==================== ICONS ====================
const DocumentIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ClipboardIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const ExclamationIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const ScaleIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DocumentDuplicateIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
    />
  </svg>
);

const LinkIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const MailIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 64px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 768px) {
    margin-bottom: 48px;
    padding-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #B9E8D8 0%, #B4E7F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const LastUpdated = styled.p`
  font-size: 14px;
  color: var(--text-tertiary);
  font-style: italic;
`;

const Section = styled.section`
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SectionIcon = styled.div<{ $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;

  ${({ $variant }) => {
    switch ($variant) {
      case 'document':
        return `
          background: linear-gradient(135deg, rgba(185, 232, 216, 0.15) 0%, rgba(208, 240, 228, 0.15) 100%);
          border: 1px solid rgba(185, 232, 216, 0.3);
          svg { color: #6BBF9F; }
        `;
      case 'user':
        return `
          background: linear-gradient(135deg, rgba(180, 231, 245, 0.15) 0%, rgba(199, 233, 251, 0.15) 100%);
          border: 1px solid rgba(180, 231, 245, 0.3);
          svg { color: #7BCAE3; }
        `;
      case 'credit':
        return `
          background: linear-gradient(135deg, rgba(191, 172, 226, 0.15) 0%, rgba(212, 197, 249, 0.15) 100%);
          border: 1px solid rgba(191, 172, 226, 0.3);
          svg { color: #9B87C4; }
        `;
      case 'check':
        return `
          background: linear-gradient(135deg, rgba(185, 232, 216, 0.15) 0%, rgba(180, 231, 245, 0.15) 100%);
          border: 1px solid rgba(185, 232, 216, 0.3);
          svg { color: #6BBF9F; }
        `;
      case 'clipboard':
        return `
          background: linear-gradient(135deg, rgba(255, 228, 181, 0.15) 0%, rgba(255, 240, 209, 0.15) 100%);
          border: 1px solid rgba(255, 228, 181, 0.3);
          svg { color: #E6B566; }
        `;
      case 'lock':
        return `
          background: linear-gradient(135deg, rgba(180, 231, 245, 0.15) 0%, rgba(185, 232, 216, 0.15) 100%);
          border: 1px solid rgba(180, 231, 245, 0.3);
          svg { color: #7BCAE3; }
        `;
      case 'exclamation':
        return `
          background: linear-gradient(135deg, rgba(255, 179, 186, 0.15) 0%, rgba(255, 204, 229, 0.15) 100%);
          border: 1px solid rgba(255, 179, 186, 0.3);
          svg { color: #FF8FA3; }
        `;
      case 'scale':
        return `
          background: linear-gradient(135deg, rgba(226, 161, 111, 0.15) 0%, rgba(235, 190, 155, 0.15) 100%);
          border: 1px solid rgba(226, 161, 111, 0.3);
          svg { color: #D4A574; }
        `;
      case 'refresh':
        return `
          background: linear-gradient(135deg, rgba(191, 172, 226, 0.15) 0%, rgba(180, 231, 245, 0.15) 100%);
          border: 1px solid rgba(191, 172, 226, 0.3);
          svg { color: #9B87C4; }
        `;
      case 'globe':
        return `
          background: linear-gradient(135deg, rgba(185, 232, 216, 0.15) 0%, rgba(180, 231, 245, 0.15) 100%);
          border: 1px solid rgba(185, 232, 216, 0.3);
          svg { color: #6BBF9F; }
        `;
      case 'duplicate':
        return `
          background: linear-gradient(135deg, rgba(255, 228, 181, 0.15) 0%, rgba(255, 240, 209, 0.15) 100%);
          border: 1px solid rgba(255, 228, 181, 0.3);
          svg { color: #E6B566; }
        `;
      case 'link':
        return `
          background: linear-gradient(135deg, rgba(180, 231, 245, 0.15) 0%, rgba(191, 172, 226, 0.15) 100%);
          border: 1px solid rgba(180, 231, 245, 0.3);
          svg { color: #7BCAE3; }
        `;
      case 'mail':
        return `
          background: linear-gradient(135deg, rgba(191, 172, 226, 0.15) 0%, rgba(212, 197, 249, 0.15) 100%);
          border: 1px solid rgba(191, 172, 226, 0.3);
          svg { color: #9B87C4; }
        `;
      case 'bookmark':
        return `
          background: linear-gradient(135deg, rgba(255, 179, 186, 0.15) 0%, rgba(255, 198, 211, 0.15) 100%);
          border: 1px solid rgba(255, 179, 186, 0.3);
          svg { color: #FF8FA3; }
        `;
      default:
        return `
          background: linear-gradient(135deg, rgba(155, 135, 196, 0.1) 0%, rgba(180, 167, 214, 0.1) 100%);
          border: 1px solid rgba(155, 135, 196, 0.2);
          svg { color: #9B87C4; }
        `;
    }
  }}

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 16px;

  strong {
    color: var(--text-color);
    font-weight: 600;
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
`;

const ListItem = styled.li`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  padding-left: 32px;
  margin-bottom: 12px;
  position: relative;

  &:before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: 700;
    font-size: 18px;
  }

  strong {
    color: var(--text-color);
    font-weight: 600;
  }
`;

const WarningBox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 179, 186, 0.08) 0%,
    rgba(255, 204, 229, 0.08) 100%
  );
  border: 1px solid rgba(255, 179, 186, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(185, 232, 216, 0.08) 0%,
    rgba(180, 231, 245, 0.08) 100%
  );
  border: 1px solid rgba(185, 232, 216, 0.25);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContactBox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(185, 232, 216, 0.08) 0%,
    rgba(180, 231, 245, 0.08) 100%
  );
  border: 1px solid rgba(185, 232, 216, 0.25);
  border-radius: 16px;
  padding: 32px;
  margin-top: 64px;
  text-align: center;

  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-color);
  }

  p {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #6BBF9F 0%, #7BCAE3 100%);
    color: white;
    padding: 14px 28px;
    border-radius: 20px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(107, 191, 159, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-top: 48px;
  }
`;

export default function TermsPage() {
  return (
    <Container>
      <Content>
        <Header>
          <Title>Terms of Service</Title>
          <Subtitle>
            Please read these terms carefully before using our services.
          </Subtitle>
          <LastUpdated>Last updated: January 9, 2025</LastUpdated>
        </Header>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="document">
              <DocumentIcon />
            </SectionIcon>
            Agreement to Terms
          </SectionTitle>
          <Paragraph>
            Welcome to Rejectly.pro! These Terms of Service ("Terms") govern your
            access to and use of our resume analysis platform, including our website,
            services, and applications (collectively, the "Service").
          </Paragraph>
          <Paragraph>
            <strong>By accessing or using Rejectly.pro, you agree to be bound by
            these Terms.</strong> If you disagree with any part of these terms,
            you do not have permission to access the Service.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="user">
              <UserIcon />
            </SectionIcon>
            Accounts and Registration
          </SectionTitle>
          <Paragraph>
            To use certain features of our Service, you must register for an
            account:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Age Requirement:</strong> You must be at least 16 years old
              to use our Service
            </ListItem>
            <ListItem>
              <strong>Accurate Information:</strong> You agree to provide accurate,
              current, and complete information during registration
            </ListItem>
            <ListItem>
              <strong>Account Security:</strong> You are responsible for
              maintaining the security of your account and password
            </ListItem>
            <ListItem>
              <strong>Account Responsibility:</strong> You are responsible for all
              activities that occur under your account
            </ListItem>
            <ListItem>
              <strong>One Account Per User:</strong> You may not create multiple
              accounts to abuse our free tier or circumvent limitations
            </ListItem>
          </List>
          <Paragraph>
            We reserve the right to refuse service, terminate accounts, or remove
            content at our sole discretion.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="credit">
              <CreditCardIcon />
            </SectionIcon>
            Subscription and Billing
          </SectionTitle>
          <Paragraph>
            Rejectly.pro offers both free and paid subscription plans:
          </Paragraph>

          <HighlightBox>
            <Paragraph>
              <strong>Free Plan:</strong> Limited to 3 analyses per month with
              basic features. No payment required.
            </Paragraph>
            <Paragraph>
              <strong>Pro Plan ($9/month):</strong> Unlimited analyses with
              advanced features including professional resume rewriting, ATS
              optimization, and role recommendations.
            </Paragraph>
          </HighlightBox>

          <List>
            <ListItem>
              <strong>Automatic Renewal:</strong> Paid subscriptions automatically
              renew unless canceled before the renewal date
            </ListItem>
            <ListItem>
              <strong>Payment Processing:</strong> All payments are processed
              securely through Stripe
            </ListItem>
            <ListItem>
              <strong>Cancellation:</strong> You can cancel your subscription at
              any time. Access to Pro features continues until the end of your
              billing period
            </ListItem>
            <ListItem>
              <strong>No Refunds:</strong> We do not provide refunds for partial
              months or unused services
            </ListItem>
            <ListItem>
              <strong>Price Changes:</strong> We reserve the right to modify
              subscription prices with 30 days' notice to existing subscribers
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="check">
              <CheckCircleIcon />
            </SectionIcon>
            Acceptable Use
          </SectionTitle>
          <Paragraph>
            You agree to use our Service only for lawful purposes and in accordance
            with these Terms. You agree NOT to:
          </Paragraph>
          <List>
            <ListItem>
              Upload any content that infringes intellectual property rights or
              contains false information
            </ListItem>
            <ListItem>
              Use the Service to harass, abuse, or harm another person
            </ListItem>
            <ListItem>
              Attempt to bypass, disable, or interfere with security features of
              the Service
            </ListItem>
            <ListItem>
              Use automated systems (bots, scrapers) to access the Service without
              permission
            </ListItem>
            <ListItem>
              Upload malicious code, viruses, or any harmful content
            </ListItem>
            <ListItem>
              Resell, redistribute, or make the Service available to third parties
              without authorization
            </ListItem>
            <ListItem>
              Reverse engineer, decompile, or attempt to extract source code from
              our Service
            </ListItem>
          </List>
          <WarningBox>
            <Paragraph>
              <strong>Violation of these terms may result in immediate
              termination of your account without refund.</strong>
            </Paragraph>
          </WarningBox>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="clipboard">
              <ClipboardIcon />
            </SectionIcon>
            Your Content and Data
          </SectionTitle>
          <Paragraph>
            When you upload resumes, job postings, or other content to our Service:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Ownership:</strong> You retain all ownership rights to your
              content
            </ListItem>
            <ListItem>
              <strong>License to Use:</strong> You grant us a limited license to
              process, analyze, and store your content solely to provide our
              services
            </ListItem>
            <ListItem>
              <strong>AI Processing:</strong> Your content will be processed using
              OpenAI's GPT-4 API. See our Privacy Policy for details
            </ListItem>
            <ListItem>
              <strong>Responsibility:</strong> You are solely responsible for the
              content you upload and its accuracy
            </ListItem>
            <ListItem>
              <strong>Data Deletion:</strong> You can delete your data at any time
              through your account settings
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="lock">
              <LockIcon />
            </SectionIcon>
            Intellectual Property
          </SectionTitle>
          <Paragraph>
            The Service and its original content (excluding user-uploaded content),
            features, and functionality are owned by Rejectly.pro and are protected
            by international copyright, trademark, and other intellectual property
            laws.
          </Paragraph>
          <Paragraph>
            Our trademarks and trade dress may not be used without our prior
            written permission.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="exclamation">
              <ExclamationIcon />
            </SectionIcon>
            Disclaimers and Limitations
          </SectionTitle>
          <HighlightBox>
            <Paragraph>
              <strong>Important Disclaimers:</strong>
            </Paragraph>
            <List>
              <ListItem>
                <strong>No Guarantees:</strong> We do not guarantee that using our
                Service will result in job interviews or employment
              </ListItem>
              <ListItem>
                <strong>AI Accuracy:</strong> Our AI-powered analysis is provided
                "as is" and may contain errors or inaccuracies
              </ListItem>
              <ListItem>
                <strong>Not Career Advice:</strong> Our Service provides automated
                analysis only and should not be considered professional career
                counseling
              </ListItem>
              <ListItem>
                <strong>Service Availability:</strong> We do not guarantee
                uninterrupted or error-free service
              </ListItem>
            </List>
          </HighlightBox>

          <Paragraph>
            <strong>Limitation of Liability:</strong> To the maximum extent
            permitted by law, Rejectly.pro shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from
            your use of the Service.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="scale">
              <ScaleIcon />
            </SectionIcon>
            Indemnification
          </SectionTitle>
          <Paragraph>
            You agree to indemnify and hold harmless Rejectly.pro and its officers,
            directors, employees, and agents from any claims, damages, losses, or
            expenses (including legal fees) arising from:
          </Paragraph>
          <List>
            <ListItem>Your use of the Service</ListItem>
            <ListItem>Your violation of these Terms</ListItem>
            <ListItem>Your violation of any third-party rights</ListItem>
            <ListItem>Content you upload to the Service</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="refresh">
              <RefreshIcon />
            </SectionIcon>
            Termination
          </SectionTitle>
          <Paragraph>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice, for any reason, including:
          </Paragraph>
          <List>
            <ListItem>Breach of these Terms</ListItem>
            <ListItem>Fraudulent or illegal activity</ListItem>
            <ListItem>Request by law enforcement or government agencies</ListItem>
            <ListItem>Extended periods of inactivity (12+ months)</ListItem>
          </List>
          <Paragraph>
            Upon termination, your right to use the Service will immediately cease.
            If you wish to terminate your account, you may do so through your
            account settings.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="globe">
              <GlobeIcon />
            </SectionIcon>
            Governing Law and Disputes
          </SectionTitle>
          <Paragraph>
            These Terms shall be governed by and construed in accordance with the
            laws of the jurisdiction in which Rejectly.pro operates, without regard
            to conflict of law principles.
          </Paragraph>
          <Paragraph>
            Any disputes arising from these Terms or your use of the Service shall
            be resolved through binding arbitration, except where prohibited by law.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="duplicate">
              <DocumentDuplicateIcon />
            </SectionIcon>
            Changes to Terms
          </SectionTitle>
          <Paragraph>
            We reserve the right to modify these Terms at any time. We will notify
            users of material changes by:
          </Paragraph>
          <List>
            <ListItem>Posting the updated Terms on this page</ListItem>
            <ListItem>Updating the "Last updated" date</ListItem>
            <ListItem>
              Sending email notification for significant changes (for registered
              users)
            </ListItem>
          </List>
          <Paragraph>
            Your continued use of the Service after changes constitutes acceptance
            of the updated Terms.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="link">
              <LinkIcon />
            </SectionIcon>
            Third-Party Services
          </SectionTitle>
          <Paragraph>
            Our Service may contain links to third-party websites or services
            (including OpenAI, Stripe, job boards). We are not responsible for the
            content, privacy policies, or practices of third-party services.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="mail">
              <MailIcon />
            </SectionIcon>
            Contact Information
          </SectionTitle>
          <Paragraph>
            For questions about these Terms, please contact us at:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Email:</strong>{" "}
              <a href="mailto:legal@rejectly.pro">legal@rejectly.pro</a>
            </ListItem>
            <ListItem>
              <strong>Privacy Inquiries:</strong>{" "}
              <a href="mailto:privacy@rejectly.pro">privacy@rejectly.pro</a>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="bookmark">
              <BookmarkIcon />
            </SectionIcon>
            Severability
          </SectionTitle>
          <Paragraph>
            If any provision of these Terms is found to be unenforceable or invalid,
            that provision will be limited or eliminated to the minimum extent
            necessary, and the remaining provisions will remain in full force and
            effect.
          </Paragraph>
        </Section>

        <ContactBox>
          <h3>Questions About These Terms?</h3>
          <p>
            If you have any questions about our Terms of Service or legal policies,
            we're here to help.
          </p>
          <a href="mailto:legal@rejectly.pro">
            <MailIcon />
            Contact Legal Team
          </a>
        </ContactBox>
      </Content>
      <Footer />
    </Container>
  );
}
