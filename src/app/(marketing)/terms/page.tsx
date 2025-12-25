"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";


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
      case 'document':
        return `svg { color: var(--success); }`;
      case 'user':
        return `svg { color: var(--primary-500); }`;
      case 'credit':
        return `svg { color: var(--accent); }`;
      case 'check':
        return `svg { color: var(--success); }`;
      case 'clipboard':
        return `svg { color: #E6B566; }`;
      case 'lock':
        return `svg { color: #7BCAE3; }`;
      case 'exclamation':
        return `svg { color: #FF8FA3; }`;
      case 'scale':
        return `svg { color: #D4A574; }`;
      case 'refresh':
        return `svg { color: var(--accent); }`;
      case 'globe':
        return `svg { color: var(--success); }`;
      case 'duplicate':
        return `svg { color: #E6B566; }`;
      case 'link':
        return `svg { color: var(--primary-500); }`;
      case 'mail':
        return `svg { color: var(--accent); }`;
      case 'bookmark':
        return `svg { color: #FF8FA3; }`;
      default:
        return `svg { color: #9B87C4; }`;
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
      box-shadow: 0 10px 25px rgba(var(--success-rgb), 0.3);
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
            Subscription and Billing
          </SectionTitle>
          <Paragraph>
            Rejectly.pro offers both free and paid subscription plans:
          </Paragraph>

          <HighlightBox>
            <Paragraph>
              <strong>Credit System:</strong> Purchase credits for Pro analyses.
              Single credit: $2, Starter pack (10 credits): $7. Each Pro
              analysis uses 1 credit.
            </Paragraph>
            <Paragraph>
              <strong>Pro Subscription ($12/month):</strong> Unlimited analyses
              with advanced features including professional resume rewriting,
              ATS optimization, cover letter generation, and role
              recommendations.
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
