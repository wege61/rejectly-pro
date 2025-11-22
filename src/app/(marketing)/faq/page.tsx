"use client";

import styled from "styled-components";
import { useState } from "react";
import { Footer } from "@/components/ui/Footer";

// ==================== ICONS ====================
const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
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

const WrenchIcon = () => (
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
  background: linear-gradient(135deg, #9B87C4 0%, #B4A7D6 100%);
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

const FAQSection = styled.section`
  margin-bottom: 48px;
`;

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CategoryIcon = styled.div<{ $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;

  ${({ $variant }) => {
    switch ($variant) {
      case 'rocket':
        return `
          background: linear-gradient(135deg, rgba(255, 179, 186, 0.15) 0%, rgba(255, 204, 229, 0.15) 100%);
          border: 1px solid rgba(255, 179, 186, 0.3);
          svg { color: #FF8FA3; }
        `;
      case 'credit':
        return `
          background: linear-gradient(135deg, rgba(180, 231, 245, 0.15) 0%, rgba(199, 233, 251, 0.15) 100%);
          border: 1px solid rgba(180, 231, 245, 0.3);
          svg { color: #7BCAE3; }
        `;
      case 'lock':
        return `
          background: linear-gradient(135deg, rgba(185, 232, 216, 0.15) 0%, rgba(208, 240, 228, 0.15) 100%);
          border: 1px solid rgba(185, 232, 216, 0.3);
          svg { color: #6BBF9F; }
        `;
      case 'sparkles':
        return `
          background: linear-gradient(135deg, rgba(191, 172, 226, 0.15) 0%, rgba(212, 197, 249, 0.15) 100%);
          border: 1px solid rgba(191, 172, 226, 0.3);
          svg { color: #9B87C4; }
        `;
      case 'wrench':
        return `
          background: linear-gradient(135deg, rgba(255, 228, 181, 0.15) 0%, rgba(255, 240, 209, 0.15) 100%);
          border: 1px solid rgba(255, 228, 181, 0.3);
          svg { color: #E6B566; }
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
    width: 36px;
    height: 36px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div<{ $isOpen: boolean }>`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-color: rgba(155, 135, 196, 0.3);
    box-shadow: 0 4px 12px rgba(155, 135, 196, 0.1);
  `}
`;

const Question = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(155, 135, 196, 0.05);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const QuestionText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  flex: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuestionIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 24px;
  color: #9B87C4;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  flex-shrink: 0;
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "0 24px 20px 24px" : "0 24px")};

  @media (max-width: 768px) {
    padding: ${({ $isOpen }) => ($isOpen ? "0 20px 16px 20px" : "0 20px")};
  }
`;

const AnswerText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);

  strong {
    color: var(--text-color);
    font-weight: 600;
  }

  a {
    color: #9B87C4;
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const CTABox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(191, 172, 226, 0.08) 0%,
    rgba(180, 167, 214, 0.08) 100%
  );
  border: 1px solid rgba(155, 135, 196, 0.2);
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
    background: linear-gradient(135deg, #9B87C4 0%, #B4A7D6 100%);
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
      box-shadow: 0 10px 25px rgba(155, 135, 196, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-top: 48px;
  }
`;

const CTATitle = styled.h2`
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #9B87C4 0%, #B4A7D6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

type FAQ = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  icon: React.ReactNode;
  variant: string;
  questions: FAQ[];
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqCategories: FAQCategory[] = [
    {
      title: "Getting Started",
      icon: <RocketIcon />,
      variant: "rocket",
      questions: [
        {
          question: "How does Rejectly.pro work?",
          answer:
            "Upload your resume and paste a job description. Our AI analyzes the match, identifies gaps, and provides actionable recommendations to improve your chances. The entire process takes 15-30 seconds.",
        },
        {
          question: "What file formats do you support?",
          answer:
            "We support <strong>PDF and DOCX</strong> formats. You can also paste text directly for analysis. Maximum file size is 5MB. Our AI can parse complex formatting and extract the relevant information.",
        },
        {
          question: "How long does the analysis take?",
          answer:
            "Our AI analysis typically takes <strong>15-30 seconds</strong> to complete. For complex resumes and longer job descriptions, it may take up to 1 minute, but never longer.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "You can try our <strong>Quick Demo</strong> without an account! For saving your analyses and accessing more features, creating a free account is recommended. It only takes 30 seconds to sign up.",
        },
      ],
    },
    {
      title: "Pricing & Plans",
      icon: <CreditCardIcon />,
      variant: "credit",
      questions: [
        {
          question: "How does the credit system work?",
          answer:
            "You can purchase credits to unlock Pro analyses. <strong>Single credit: $2</strong>, <strong>Starter pack (10 credits): $7</strong> (best value at $0.70/report). Each Pro analysis uses 1 credit. Alternatively, subscribe for <strong>$12/month</strong> for unlimited analyses.",
        },
        {
          question: "What's included in a Pro analysis?",
          answer:
            "Pro includes <strong>detailed AI insights, professional rewriting of 3 bullet points, cover letter generation, ATS optimization recommendations, alternative role suggestions, and AI-optimized resume PDF</strong>. Purchase credits starting at $2 or subscribe for unlimited access.",
        },
        {
          question: "Can I cancel anytime?",
          answer:
            "Yes! No commitment required. You can cancel anytime from your account settings. After canceling, you'll continue to have Pro features until the end of your billing period. No questions asked.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "We don't provide refunds for partial months or unused services. However, you can cancel anytime to stop future charges. We recommend trying our free plan first to ensure it meets your needs.",
        },
        {
          question: "Can I upgrade or downgrade my plan?",
          answer:
            "Yes! You can upgrade from Free to Pro at any time. When downgrading from Pro to Free, the change takes effect at the end of your current billing period, so you don't lose any paid time.",
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <LockIcon />,
      variant: "lock",
      questions: [
        {
          question: "Is my data secure?",
          answer:
            "Absolutely! All your data is <strong>encrypted in transit (TLS) and at rest</strong>. We never share your information with third parties. We're fully GDPR compliant and take data security seriously. Your resumes are stored securely in encrypted cloud storage.",
        },
        {
          question: "How is my resume data used?",
          answer:
            "Your resume data is processed by our AI (OpenAI GPT-4) solely to provide analysis services. According to OpenAI's API data usage policy, data submitted via API is <strong>not used to train their models</strong>. You can delete your data at any time from your account settings.",
        },
        {
          question: "Who can see my resume?",
          answer:
            "Only you can see your uploaded resumes. Our team does not have access to your personal data except when absolutely necessary for troubleshooting (with your explicit consent). We do not share, sell, or distribute your resumes to anyone.",
        },
        {
          question: "Can I delete my account and data?",
          answer:
            "Yes! You can delete your account and all associated data at any time through your account settings. This action is permanent and will remove all your resumes, analyses, and personal information from our systems.",
        },
      ],
    },
    {
      title: "Features & Functionality",
      icon: <SparklesIcon />,
      variant: "sparkles",
      questions: [
        {
          question: "What languages do you support?",
          answer:
            "Currently, we support <strong>English and Turkish</strong> resumes and job descriptions. Our AI can analyze content in both languages with high accuracy. We're planning to add more languages based on user demand.",
        },
        {
          question: "How accurate is the AI analysis?",
          answer:
            "Our AI is powered by OpenAI's GPT-4, one of the most advanced language models available. While highly accurate, <strong>AI analysis should be used as guidance, not absolute truth</strong>. We recommend combining AI insights with your own judgment and career expertise.",
        },
        {
          question: "Can I analyze multiple job postings at once?",
          answer:
            "Currently, each analysis compares your resume to one job posting. However, you can run multiple analyses with credits or unlimited analyses with a Pro subscription to compare your resume against different positions and track which roles you're best suited for.",
        },
        {
          question: "Do you provide cover letter generation?",
          answer:
            "Not yet, but it's on our roadmap! Currently, we focus on resume analysis and optimization. Cover letter generation and other AI-powered career tools are planned for future releases. <a href='mailto:feedback@rejectly.pro'>Let us know</a> if this is important to you!",
        },
        {
          question: "What is ATS optimization?",
          answer:
            "ATS (Applicant Tracking System) is software that many companies use to screen resumes before humans see them. Our <strong>Pro plan</strong> provides recommendations to optimize your resume for ATS, including keyword suggestions, formatting tips, and structure improvements to pass automated screenings.",
        },
      ],
    },
    {
      title: "Technical & Troubleshooting",
      icon: <WrenchIcon />,
      variant: "wrench",
      questions: [
        {
          question: "My PDF isn't uploading. What should I do?",
          answer:
            "Ensure your PDF is under 5MB and is a valid PDF file (not a scanned image). If issues persist, try converting to DOCX or copying the text directly. If you still experience problems, contact us at <a href='mailto:support@rejectly.pro'>support@rejectly.pro</a>.",
        },
        {
          question: "The analysis is taking longer than usual. Why?",
          answer:
            "Analysis times can vary based on resume length, job description complexity, and current server load. If it takes longer than 2 minutes, please refresh the page and try again. If the issue persists, our AI service might be experiencing high demand.",
        },
        {
          question: "Can I use Rejectly.pro on mobile?",
          answer:
            "Yes! Our platform is fully responsive and works on mobile devices, tablets, and desktops. The experience is optimized for all screen sizes, so you can analyze resumes on the go.",
        },
        {
          question: "Do you have an API?",
          answer:
            "We don't currently offer a public API, but we're considering it for the future. If you're interested in API access for bulk analysis or integration with your platform, please reach out to <a href='mailto:enterprise@rejectly.pro'>enterprise@rejectly.pro</a>.",
        },
      ],
    },
  ];

  return (
    <Container>
      <Content>
        <Header>
          <Title>Frequently Asked Questions</Title>
          <Subtitle>
            Everything you need to know about Rejectly.pro
          </Subtitle>
        </Header>

        {faqCategories.map((category, categoryIndex) => (
          <FAQSection key={categoryIndex}>
            <CategoryTitle>
              <CategoryIcon $variant={category.variant}>{category.icon}</CategoryIcon>
              {category.title}
            </CategoryTitle>
            <FAQList>
              {category.questions.map((faq, questionIndex) => {
                const itemId = `${categoryIndex}-${questionIndex}`;
                const isOpen = openItems.includes(itemId);

                return (
                  <FAQItem key={itemId} $isOpen={isOpen}>
                    <Question onClick={() => toggleItem(itemId)}>
                      <QuestionText>{faq.question}</QuestionText>
                      <QuestionIcon $isOpen={isOpen}>
                        {isOpen ? "−" : "+"}
                      </QuestionIcon>
                    </Question>
                    <Answer $isOpen={isOpen}>
                      <AnswerText
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </Answer>
                  </FAQItem>
                );
              })}
            </FAQList>
          </FAQSection>
        ))}

        <CTABox>
          <CTATitle>Still Have Questions?</CTATitle>
          <p>
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <a href="mailto:support@rejectly.pro">
            <MailIcon />
            Contact Support
          </a>
        </CTABox>
      </Content>
      <Footer />
    </Container>
  );
}
