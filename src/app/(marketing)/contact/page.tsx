"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { useState } from "react";
import { Mail, Zap, BookOpen } from "lucide-react";

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
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const MainSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  margin-bottom: 120px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 48px;
    margin-bottom: 80px;
  }
`;

const FormSection = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const FormTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-color);
`;

const FormSubtitle = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 14px 16px;
  font-size: 15px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const Textarea = styled.textarea`
  padding: 14px 16px;
  font-size: 15px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  font-size: 15px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const InfoCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-200);
    box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.1);
  }
`;

const InfoIcon = styled.div`
  margin-bottom: 16px;
  color: var(--accent);

  svg {
    width: 32px;
    height: 32px;
  }
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-color);
`;

const InfoText = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;

  a {
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(
    135deg,
    rgba(var(--success-rgb), 0.1) 0%,
    rgba(var(--success-rgb), 0.05) 100%
  );
  border: 1px solid rgba(var(--success-rgb), 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  color: var(--success);
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(
    135deg,
    rgba(var(--error-rgb), 0.1) 0%,
    rgba(var(--error-rgb), 0.05) 100%
  );
  border: 1px solid rgba(var(--error-rgb), 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  color: var(--error);
  font-size: 15px;
  font-weight: 500;
`;

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send this to your backend
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "general",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title>Get in Touch</Title>
          <Subtitle>
            Have a question or feedback? We'd love to hear from you. Send us a message
            and we'll respond as soon as possible.
          </Subtitle>
        </Header>

        <MainSection>
          <FormSection>
            <FormTitle>Send us a message</FormTitle>
            <FormSubtitle>Fill out the form below and we'll get back to you soon</FormSubtitle>

            {submitStatus === "success" && (
              <SuccessMessage>
                <CheckIcon />
                Thank you for your message! We'll get back to you within 24 hours.
              </SuccessMessage>
            )}

            {submitStatus === "error" && (
              <ErrorMessage>
                Something went wrong. Please try again or email us directly.
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="partnership">Partnership Opportunity</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </SubmitButton>
            </Form>
          </FormSection>

          <InfoSection>
            <InfoCard>
              <InfoIcon>
                <Mail />
              </InfoIcon>
              <InfoTitle>Email Us</InfoTitle>
              <InfoText>
                For general inquiries:{" "}
                <a href="mailto:hello@rejectly.pro">hello@rejectly.pro</a>
                <br />
                For support:{" "}
                <a href="mailto:support@rejectly.pro">support@rejectly.pro</a>
              </InfoText>
            </InfoCard>



            <InfoCard>
              <InfoIcon>
                <Zap />
              </InfoIcon>
              <InfoTitle>Response Time</InfoTitle>
              <InfoText>
                We typically respond to all inquiries within 24 hours during business
                days. For urgent matters, please email{" "}
                <a href="mailto:urgent@rejectly.pro">urgent@rejectly.pro</a>
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoIcon>
                <BookOpen />
              </InfoIcon>
              <InfoTitle>Help Center</InfoTitle>
              <InfoText>
                Looking for quick answers? Check out our FAQ page for commonly asked
                questions about pricing, features, and account management.
              </InfoText>
            </InfoCard>
          </InfoSection>
        </MainSection>
      </Content>
      <Footer />
    </Container>
  );
}
