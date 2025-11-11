"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const SectionIcon = styled.span`
  font-size: 32px;

  @media (max-width: 768px) {
    font-size: 28px;
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
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContactBox = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
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
    background: #667eea;
    color: white;
    padding: 14px 28px;
    border-radius: 20px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
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
            <SectionIcon>🔒</SectionIcon>
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
            <SectionIcon>📊</SectionIcon>
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
            <SectionIcon>⚙️</SectionIcon>
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
            <SectionIcon>🤖</SectionIcon>
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
            <SectionIcon>💾</SectionIcon>
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
            <SectionIcon>🍪</SectionIcon>
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
            <SectionIcon>👤</SectionIcon>
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
            <SectionIcon>🌍</SectionIcon>
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
            <SectionIcon>👶</SectionIcon>
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
            <SectionIcon>🔄</SectionIcon>
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
            <span>✉️</span>
            Contact Us
          </a>
        </ContactBox>
      </Content>
      <Footer />
    </Container>
  );
}
