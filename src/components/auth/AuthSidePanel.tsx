'use client';

import styled from 'styled-components';
import Image from 'next/image';

const PanelWrapper = styled.div`
  position: sticky;
  top: 5vh;
  height: 90vh;
  padding: 16px;
  padding-left: 0;
`;

const ImagePanel = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  background: #1a1a2e;
`;

const BackgroundImage = styled.div`
  position: absolute;
  
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80');
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  
  background: rgba(0, 0, 0, 0.4);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
`;

const InfoCard = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  padding: 24px;

  @media (max-width: 1280px) {
    bottom: 16px;
    left: 16px;
    right: 16px;
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: white;
  letter-spacing: -0.025em;
  line-height: 1.05;
  max-width: 18ch;

  @media (max-width: 1280px) {
    font-size: 28px;
    max-width: 20ch;
  }
`;

const Description = styled.p`
  margin-top: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 52ch;

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

const Footer = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div<{ $offset?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  margin-left: ${({ $offset }) => ($offset ? '-8px' : '0')};
  border: 2px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const StarIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: #f59e0b;
  fill: #f59e0b;
`;

const RatingText = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  strong {
    color: white;
    font-weight: 600;
  }
`;

export default function AuthSidePanel() {
  return (
    <PanelWrapper>
      <ImagePanel>
        <BackgroundImage />
        <Overlay />
        <InfoCard>
          <Title>Land Your Dream Job</Title>
          <Description>
            AI-powered CV analysis that helps you beat ATS systems and stand out to recruiters.
          </Description>
          <Footer>
            <AvatarStack>
              <Avatar>
                <Image
                  src="https://i.pravatar.cc/150?img=1"
                  alt="User"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </Avatar>
              <Avatar $offset>
                <Image
                  src="https://i.pravatar.cc/150?img=2"
                  alt="User"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </Avatar>
              <Avatar $offset>
                <Image
                  src="https://i.pravatar.cc/150?img=3"
                  alt="User"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </Avatar>
              <Avatar $offset>
                <Image
                  src="https://i.pravatar.cc/150?img=4"
                  alt="User"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </Avatar>
              <Avatar $offset>
                <Image
                  src="https://i.pravatar.cc/150?img=5"
                  alt="User"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </Avatar>
            </AvatarStack>
            <Rating>
              <StarIcon viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </StarIcon>
              <RatingText>
                <strong>4.8/5</strong>
                <span>(127 reviews)</span>
              </RatingText>
            </Rating>
          </Footer>
        </InfoCard>
      </ImagePanel>
    </PanelWrapper>
  );
}
