"use client";

import styled from "styled-components";
import { useState } from "react";
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

const CategoryIcon = styled.span`
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
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
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
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
    background: rgba(102, 126, 234, 0.05);
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
  color: var(--primary-color);
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
    color: var(--primary-color);
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
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
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

type FAQ = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  icon: string;
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
      icon: "🚀",
      questions: [
        {
          question: "How does Rejectly.pro work?",
          answer:
            "Upload your CV and paste a job description. Our AI analyzes the match, identifies gaps, and provides actionable recommendations to improve your chances. The entire process takes 15-30 seconds.",
        },
        {
          question: "What file formats do you support?",
          answer:
            "We support <strong>PDF and DOCX</strong> formats. You can also paste text directly for analysis. Maximum file size is 5MB. Our AI can parse complex formatting and extract the relevant information.",
        },
        {
          question: "How long does the analysis take?",
          answer:
            "Our AI analysis typically takes <strong>15-30 seconds</strong> to complete. For complex CVs and longer job descriptions, it may take up to 1 minute, but never longer.",
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
      icon: "💳",
      questions: [
        {
          question: "How many analyses can I do with the free plan?",
          answer:
            "The free plan allows <strong>3 analyses per month</strong>. You can compare up to 3 job postings per analysis. Upgrade to Pro for unlimited analyses and advanced features.",
        },
        {
          question: "What's included in the Pro plan?",
          answer:
            "Pro includes <strong>unlimited analyses, detailed AI insights, professional rewriting of 3 bullet points, ATS optimization recommendations, and alternative role suggestions</strong>. Only $9/month with no long-term commitment.",
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
      icon: "🔒",
      questions: [
        {
          question: "Is my data secure?",
          answer:
            "Absolutely! All your data is <strong>encrypted in transit (TLS) and at rest</strong>. We never share your information with third parties. We're fully GDPR compliant and take data security seriously. Your CVs are stored securely in encrypted cloud storage.",
        },
        {
          question: "How is my CV data used?",
          answer:
            "Your CV data is processed by our AI (OpenAI GPT-4) solely to provide analysis services. According to OpenAI's API data usage policy, data submitted via API is <strong>not used to train their models</strong>. You can delete your data at any time from your account settings.",
        },
        {
          question: "Who can see my CV?",
          answer:
            "Only you can see your uploaded CVs. Our team does not have access to your personal data except when absolutely necessary for troubleshooting (with your explicit consent). We do not share, sell, or distribute your CVs to anyone.",
        },
        {
          question: "Can I delete my account and data?",
          answer:
            "Yes! You can delete your account and all associated data at any time through your account settings. This action is permanent and will remove all your CVs, analyses, and personal information from our systems.",
        },
      ],
    },
    {
      title: "Features & Functionality",
      icon: "✨",
      questions: [
        {
          question: "What languages do you support?",
          answer:
            "Currently, we support <strong>English and Turkish</strong> CVs and job descriptions. Our AI can analyze content in both languages with high accuracy. We're planning to add more languages based on user demand.",
        },
        {
          question: "How accurate is the AI analysis?",
          answer:
            "Our AI is powered by OpenAI's GPT-4, one of the most advanced language models available. While highly accurate, <strong>AI analysis should be used as guidance, not absolute truth</strong>. We recommend combining AI insights with your own judgment and career expertise.",
        },
        {
          question: "Can I analyze multiple job postings at once?",
          answer:
            "Currently, each analysis compares your CV to one job posting. However, you can run multiple analyses (3 per month on Free, unlimited on Pro) to compare your CV against different positions and track which roles you're best suited for.",
        },
        {
          question: "Do you provide cover letter generation?",
          answer:
            "Not yet, but it's on our roadmap! Currently, we focus on CV analysis and optimization. Cover letter generation and other AI-powered career tools are planned for future releases. <a href='mailto:feedback@rejectly.pro'>Let us know</a> if this is important to you!",
        },
        {
          question: "What is ATS optimization?",
          answer:
            "ATS (Applicant Tracking System) is software that many companies use to screen CVs before humans see them. Our <strong>Pro plan</strong> provides recommendations to optimize your CV for ATS, including keyword suggestions, formatting tips, and structure improvements to pass automated screenings.",
        },
      ],
    },
    {
      title: "Technical & Troubleshooting",
      icon: "🛠️",
      questions: [
        {
          question: "My PDF isn't uploading. What should I do?",
          answer:
            "Ensure your PDF is under 5MB and is a valid PDF file (not a scanned image). If issues persist, try converting to DOCX or copying the text directly. If you still experience problems, contact us at <a href='mailto:support@rejectly.pro'>support@rejectly.pro</a>.",
        },
        {
          question: "The analysis is taking longer than usual. Why?",
          answer:
            "Analysis times can vary based on CV length, job description complexity, and current server load. If it takes longer than 2 minutes, please refresh the page and try again. If the issue persists, our AI service might be experiencing high demand.",
        },
        {
          question: "Can I use Rejectly.pro on mobile?",
          answer:
            "Yes! Our platform is fully responsive and works on mobile devices, tablets, and desktops. The experience is optimized for all screen sizes, so you can analyze CVs on the go.",
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
              <CategoryIcon>{category.icon}</CategoryIcon>
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
          <h3>Still Have Questions?</h3>
          <p>
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <a href="mailto:support@rejectly.pro">
            <span>✉️</span>
            Contact Support
          </a>
        </CTABox>
      </Content>
      <Footer />
    </Container>
  );
}
