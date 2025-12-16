'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { useRef } from 'react';

const PanelWrapper = styled.div`
  position: sticky;
  top: 5vh;
  height: 90vh;
  padding: 16px;
  padding-left: 0;
  display: flex;
  flex-direction: column;
`;

const ImagePanel = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
`;



const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;

  @media (max-width: 1280px) {
    padding: 24px;
  }
`;

const TopSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: white;
  letter-spacing: -0.025em;
  line-height: 1.1;
  max-width: 18ch;
  margin-bottom: 12px;

  @media (max-width: 1280px) {
    font-size: 26px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  max-width: 40ch;
  margin-bottom: 16px;
`;

const SocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div<{ $offset?: boolean }>`
  width: 28px;
  height: 28px;
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
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
`;

const StarIcon = styled.svg`
  width: 14px;
  height: 14px;
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

const CarouselSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const CarouselWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px;
  padding-right: 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
  flex: 1;
  align-items: stretch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselCard = styled.div<{ $bgImage: string }>`
  position: relative;
  flex-shrink: 0;
  width: calc(50% - 6px);
  height: 100%;
  min-height: 240px;
  border-radius: 20px;
  overflow: hidden;
  background-image: url(${({ $bgImage }) => $bgImage});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1280px) {
    min-height: 200px;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 50%,
    transparent 100%
  );
`;

const CardContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 16px;
`;

const CardCategory = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-top: 6px;
  line-height: 1.3;
  max-width: 20ch;

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

const CarouselNav = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const carouselData = [
  {
    category: 'ATS Optimization',
    title: 'Beat the bots, land interviews',
    src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  },
  {
    category: 'AI Analysis',
    title: 'Smart resume scoring in seconds',
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  },
  {
    category: 'Career Growth',
    title: 'Get noticed by top recruiters',
    src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  },
  {
    category: 'Success Stories',
    title: '10,000+ dream jobs landed',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
];

export default function AuthSidePanel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <PanelWrapper>
      <ImagePanel>
        <ContentWrapper>
          <TopSection>
            <Title>Land Your Dream Job</Title>
            <Description>
              AI-powered resume analysis that helps you beat ATS systems and stand out to recruiters.
            </Description>
            <SocialProof>
              <AvatarStack>
                <Avatar>
                  <Image
                    src="https://i.pravatar.cc/150?img=1"
                    alt="User"
                    fill
                    sizes="28px"
                    style={{ objectFit: 'cover' }}
                  />
                </Avatar>
                <Avatar $offset>
                  <Image
                    src="https://i.pravatar.cc/150?img=2"
                    alt="User"
                    fill
                    sizes="28px"
                    style={{ objectFit: 'cover' }}
                  />
                </Avatar>
                <Avatar $offset>
                  <Image
                    src="https://i.pravatar.cc/150?img=3"
                    alt="User"
                    fill
                    sizes="28px"
                    style={{ objectFit: 'cover' }}
                  />
                </Avatar>
                <Avatar $offset>
                  <Image
                    src="https://i.pravatar.cc/150?img=4"
                    alt="User"
                    fill
                    sizes="28px"
                    style={{ objectFit: 'cover' }}
                  />
                </Avatar>
                <Avatar $offset>
                  <Image
                    src="https://i.pravatar.cc/150?img=5"
                    alt="User"
                    fill
                    sizes="28px"
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
            </SocialProof>
          </TopSection>

          <CarouselSection>
            <CarouselWrapper>
              <CarouselTrack ref={carouselRef}>
                {carouselData.map((card, index) => (
                  <CarouselCard key={index} $bgImage={card.src}>
                    <CardOverlay />
                    <CardContent>
                      <CardCategory>{card.category}</CardCategory>
                      <CardTitle>{card.title}</CardTitle>
                    </CardContent>
                  </CarouselCard>
                ))}
              </CarouselTrack>
              <CarouselNav>
                <NavButton onClick={scrollLeft}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </NavButton>
                <NavButton onClick={scrollRight}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </NavButton>
              </CarouselNav>
            </CarouselWrapper>
          </CarouselSection>
        </ContentWrapper>
      </ImagePanel>
    </PanelWrapper>
  );
}
