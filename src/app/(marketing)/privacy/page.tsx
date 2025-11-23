"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";

// ==================== ICONS ====================
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

const DocumentTextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CogIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const CookieIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
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

const UsersIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
  flex-shrink: 0;

  ${({ $variant }) => {
    switch ($variant) {
      case 'lock':
        return `svg { color: var(--accent); }`;
      case 'document':
        return `svg { color: var(--primary-500); }`;
      case 'cog':
        return `svg { color: var(--success); }`;
      case 'sparkles':
        return `svg { color: #FF8FA3; }`;
      case 'shield':
        return `svg { color: #E6B566; }`;
      case 'cookie':
        return `svg { color: #D4A574; }`;
      case 'user':
        return `svg { color: var(--primary-500); }`;
      case 'globe':
        return `svg { color: var(--accent); }`;
      case 'users':
        return `svg { color: #FF8FA3; }`;
      case 'refresh':
        return `svg { color: var(--success); }`;
      default:
        return `svg { color: var(--primary-500); }`;
    }
  }}

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    svg {
      width: 24px;
      height: 24px;
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
    content: "✓";
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

const HighlightBox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 179, 186, 0.08) 0%,
    rgba(255, 204, 229, 0.08) 100%
  );
  border: 1px solid rgba(255, 179, 186, 0.25);
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
    rgba(var(--primary-500-rgb), 0.08) 0%,
    rgba(var(--primary-700-rgb), 0.08) 100%
  );
  border: 1px solid var(--primary-200);
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
    background: var(--primary-500);
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
      box-shadow: 0 10px 25px rgba(var(--accent-rgb), 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-top: 48px;
  }
`;

export default function PrivacyPage() {
  return (
    <Container>
      <Content>
        <Header>
          <Title>Privacy Policy</Title>
          <Subtitle>
            We take your privacy seriously. Here's how we protect your data.
          </Subtitle>
          <LastUpdated>Last updated: January 9, 2025</LastUpdated>
        </Header>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="lock">
              <LockIcon />
            </SectionIcon>
            Introduction
          </SectionTitle>
          <Paragraph>
            Welcome to Rejectly.pro ("we," "our," or "us"). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our resume analysis platform.
          </Paragraph>
          <Paragraph>
            <strong>By using Rejectly.pro, you agree to the collection and use
            of information in accordance with this policy.</strong> If you do not
            agree with our policies and practices, please do not use our services.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="document">
              <DocumentTextIcon />
            </SectionIcon>
            Information We Collect
          </SectionTitle>
          <Paragraph>
            We collect information that you provide directly to us when using our
            services:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Account Information:</strong> Email address, name, and
              password when you create an account
            </ListItem>
            <ListItem>
              <strong>Resume Content:</strong> The text and files you upload for
              analysis, including your resume, work history, skills, and
              qualifications
            </ListItem>
            <ListItem>
              <strong>Job Postings:</strong> Job descriptions and requirements
              you paste or upload for comparison
            </ListItem>
            <ListItem>
              <strong>Payment Information:</strong> When you upgrade to Pro, we
              collect payment data through our secure payment processor (Stripe)
            </ListItem>
            <ListItem>
              <strong>Usage Data:</strong> Information about how you interact with
              our service, including analysis history and preferences
            </ListItem>
            <ListItem>
              <strong>Device Information:</strong> Browser type, IP address,
              operating system, and device identifiers
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="cog">
              <CogIcon />
            </SectionIcon>
            How We Use Your Information
          </SectionTitle>
          <Paragraph>
            We use the information we collect for the following purposes:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Provide our services:</strong> Analyze your resume against job
              postings using AI, generate match scores, identify missing skills,
              and provide personalized recommendations
            </ListItem>
            <ListItem>
              <strong>Improve our platform:</strong> Understand how users interact
              with our service to improve features and user experience
            </ListItem>
            <ListItem>
              <strong>Account management:</strong> Create and manage your account,
              process payments, and provide customer support
            </ListItem>
            <ListItem>
              <strong>Communication:</strong> Send you service updates, security
              alerts, and marketing communications (you can opt-out anytime)
            </ListItem>
            <ListItem>
              <strong>Security:</strong> Detect, prevent, and address technical
              issues, fraud, and violations of our Terms of Service
            </ListItem>
            <ListItem>
              <strong>Legal compliance:</strong> Comply with legal obligations and
              protect our rights
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="sparkles">
              <SparklesIcon />
            </SectionIcon>
            AI and Data Processing
          </SectionTitle>
          <HighlightBox>
            <Paragraph>
              <strong>Important:</strong> Your resume and job posting data is
              processed using OpenAI's GPT-4 API to provide our analysis services.
              When you use our platform, your data is sent to OpenAI's servers for
              processing.
            </Paragraph>
          </HighlightBox>
          <Paragraph>
            We have implemented appropriate safeguards:
          </Paragraph>
          <List>
            <ListItem>
              We use OpenAI's API in accordance with their data usage policies
            </ListItem>
            <ListItem>
              OpenAI does not use data submitted via their API to train their
              models (as per OpenAI's API data usage policy)
            </ListItem>
            <ListItem>
              Your data is encrypted in transit using industry-standard TLS
              encryption
            </ListItem>
            <ListItem>
              We do not share your personal resume data with any third parties except
              as necessary to provide our services
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="shield">
              <ShieldCheckIcon />
            </SectionIcon>
            Data Storage and Security
          </SectionTitle>
          <Paragraph>
            We take the security of your data seriously and implement appropriate
            technical and organizational measures:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Encryption:</strong> All data is encrypted in transit (TLS)
              and at rest
            </ListItem>
            <ListItem>
              <strong>Secure Storage:</strong> Your resumes and documents are stored
              securely in Supabase cloud storage with access controls
            </ListItem>
            <ListItem>
              <strong>Authentication:</strong> We use industry-standard
              authentication mechanisms to protect your account
            </ListItem>
            <ListItem>
              <strong>Regular Audits:</strong> We regularly review our security
              practices and update them as needed
            </ListItem>
            <ListItem>
              <strong>Limited Access:</strong> Only authorized personnel have
              access to personal data, and only when necessary
            </ListItem>
          </List>
          <Paragraph>
            <strong>Data Retention:</strong> We retain your data for as long as
            your account is active or as needed to provide you services. You can
            delete your data at any time through your account settings.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="cookie">
              <CookieIcon />
            </SectionIcon>
            Cookies and Tracking
          </SectionTitle>
          <Paragraph>
            We use cookies and similar tracking technologies to improve your
            experience:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Essential Cookies:</strong> Required for authentication and
              security
            </ListItem>
            <ListItem>
              <strong>Analytics Cookies:</strong> Help us understand how users
              interact with our platform
            </ListItem>
            <ListItem>
              <strong>Preference Cookies:</strong> Remember your settings and
              preferences (e.g., dark mode)
            </ListItem>
          </List>
          <Paragraph>
            You can control cookies through your browser settings, but disabling
            certain cookies may affect functionality.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="user">
              <UserIcon />
            </SectionIcon>
            Your Privacy Rights (GDPR)
          </SectionTitle>
          <Paragraph>
            If you are located in the European Economic Area (EEA), you have the
            following rights under GDPR:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Access:</strong> Request a copy of the personal data we hold
              about you
            </ListItem>
            <ListItem>
              <strong>Rectification:</strong> Request correction of inaccurate or
              incomplete data
            </ListItem>
            <ListItem>
              <strong>Erasure:</strong> Request deletion of your personal data
              ("right to be forgotten")
            </ListItem>
            <ListItem>
              <strong>Portability:</strong> Request transfer of your data to
              another service
            </ListItem>
            <ListItem>
              <strong>Restriction:</strong> Request restriction of processing of
              your data
            </ListItem>
            <ListItem>
              <strong>Objection:</strong> Object to processing of your data for
              certain purposes
            </ListItem>
            <ListItem>
              <strong>Withdraw Consent:</strong> Withdraw consent at any time
              where we rely on consent
            </ListItem>
          </List>
          <Paragraph>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@rejectly.pro">privacy@rejectly.pro</a>
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="globe">
              <GlobeIcon />
            </SectionIcon>
            International Data Transfers
          </SectionTitle>
          <Paragraph>
            Your information may be transferred to and maintained on servers
            located outside of your country. We ensure appropriate safeguards are
            in place to protect your data in accordance with this Privacy Policy
            and applicable laws.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="users">
              <UsersIcon />
            </SectionIcon>
            Children's Privacy
          </SectionTitle>
          <Paragraph>
            Our service is not directed to individuals under the age of 16. We do
            not knowingly collect personal information from children. If you become
            aware that a child has provided us with personal information, please
            contact us.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>
            <SectionIcon $variant="refresh">
              <RefreshIcon />
            </SectionIcon>
            Changes to This Policy
          </SectionTitle>
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page and
            updating the "Last updated" date. We encourage you to review this
            Privacy Policy periodically.
          </Paragraph>
          <Paragraph>
            Continued use of our services after changes constitutes acceptance of
            the updated policy.
          </Paragraph>
        </Section>

        <ContactBox>
          <h3>Questions About Privacy?</h3>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, we're here to help.
          </p>
          <a href="mailto:privacy@rejectly.pro">
            <MailIcon />
            Contact Us
          </a>
        </ContactBox>
      </Content>
      <Footer />
    </Container>
  );
}
