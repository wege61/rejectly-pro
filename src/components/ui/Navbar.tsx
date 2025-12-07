"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const MenuContainer = styled.nav`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 12px 32px;
  background: var(--bg-alt);
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const MenuItemWrapper = styled.div`
  position: relative;
`;

const MenuItemText = styled.span`
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover {
    color: var(--text-color);
    opacity: 0.9;
  }
`;

const DropdownContainer = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: calc(100% + 20px);
  left: 50%;
  transform: translateX(-50%);
  padding-top: 16px;
  display: ${({ $isActive }) => ($isActive ? "block" : "none")};
`;

const DropdownContent = styled.div`
  background: var(--bg-alt);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownInner = styled.div`
  width: max-content;
  height: 100%;
  padding: 16px;
`;

// MenuItem Component
interface MenuItemProps {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
}: MenuItemProps) => {
  const handleClick = () => {
    if (href && !children) {
      window.location.href = href;
    }
  };

  return (
    <MenuItemWrapper
      onMouseEnter={() => setActive(item)}
      onClick={handleClick}
    >
      <MenuItemText style={{ cursor: href ? "pointer" : "default" }}>
        {item}
      </MenuItemText>
      {children && (
        <DropdownContainer $isActive={active === item}>
          <DropdownContent>
            <DropdownInner>{children}</DropdownInner>
          </DropdownContent>
        </DropdownContainer>
      )}
    </MenuItemWrapper>
  );
};

// Menu Component
interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

export const Menu = ({ setActive, children }: MenuProps) => {
  return (
    <MenuContainer onMouseLeave={() => setActive(null)}>
      {children}
    </MenuContainer>
  );
};

// ProductItem Component
interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

const ProductItemWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--surface-color);
  }
`;

const ProductItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const ProductItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const ProductItemDescription = styled.p`
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  max-width: 180px;
  line-height: 1.4;
`;

export const ProductItem = ({
  title,
  description,
  href,
  icon,
}: ProductItemProps) => {
  return (
    <ProductItemWrapper href={href}>
      {icon && <ProductItemIcon>{icon}</ProductItemIcon>}
      <ProductItemContent>
        <ProductItemTitle>{title}</ProductItemTitle>
        <ProductItemDescription>{description}</ProductItemDescription>
      </ProductItemContent>
    </ProductItemWrapper>
  );
};

// HoveredLink Component
const StyledHoveredLink = styled.a`
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-color);
    background: var(--surface-color);
  }
`;

interface HoveredLinkProps {
  children: React.ReactNode;
  href: string;
}

export const HoveredLink = ({ children, href }: HoveredLinkProps) => {
  return <StyledHoveredLink href={href}>{children}</StyledHoveredLink>;
};

// Dropdown Grid for multiple items
export const DropdownGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 8px;
`;

// Simple links container
export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 150px;
`;
