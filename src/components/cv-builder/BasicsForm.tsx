"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const PhotoUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const PhotoBubble = styled.label`
  width: 84px;
  height: 84px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(255, 255, 255, 0.4);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.5);
    color: #fff;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  
  small {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export function BasicsForm() {
  const { cv, updateContact, updatePhoto } = useCVStore();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updatePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <PhotoUploadWrapper>
        <PhotoBubble>
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handlePhotoChange}
          />
          {cv.photoUrl ? (
            <img src={cv.photoUrl} alt="Profile" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </PhotoBubble>
        <PhotoText>
          <span>Profile Photo</span>
          {cv.photoUrl ? (
            <button 
              onClick={(e) => { e.preventDefault(); updatePhoto(""); }}
              style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', fontSize: '12px', cursor: 'pointer', textAlign: 'left', marginTop: '2px', fontWeight: 500 }}
            >
              Remove Photo
            </button>
          ) : (
            <small>Recommended for UK/EU regions.</small>
          )}
        </PhotoText>
      </PhotoUploadWrapper>

      <Row>
        <InputGroup style={{ flex: 1 }}>
          <Label>Full Name</Label>
          <Input 
            placeholder="e.g. Alex Chen" 
            value={cv.contact.name}
            onChange={(e) => updateContact({ name: e.target.value })}
            autoFocus
          />
        </InputGroup>
      </Row>

      <Row>
        <InputGroup style={{ flex: 1 }}>
          <Label>Email</Label>
          <Input 
            type="email"
            placeholder="alex@example.com" 
            value={cv.contact.email}
            onChange={(e) => updateContact({ email: e.target.value })}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Label>Phone</Label>
          <Input 
            type="tel"
            placeholder="+1 234 567 890" 
            value={cv.contact.phone}
            onChange={(e) => updateContact({ phone: e.target.value })}
          />
        </InputGroup>
      </Row>

      <Row>
        <InputGroup style={{ flex: 1 }}>
          <Label>Location</Label>
          <AutocompleteInput 
            placeholder="e.g. San Francisco, CA" 
            value={cv.contact.location ?? ""}
            onChange={(val) => updateContact({ location: val })}
            fetchType="location"
          />
        </InputGroup>
      </Row>

      <Row>
        <InputGroup style={{ flex: 1 }}>
          <Label>LinkedIn URL (Optional)</Label>
          <Input 
            placeholder="linkedin.com/in/alexchen" 
            value={cv.contact.linkedin || ""}
            onChange={(e) => updateContact({ linkedin: e.target.value })}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Label>Portfolio / Website (Optional)</Label>
          <Input 
            placeholder="alexchen.dev" 
            value={cv.contact.portfolio || ""}
            onChange={(e) => updateContact({ portfolio: e.target.value })}
          />
        </InputGroup>
      </Row>

    </FormContainer>
  );
}
