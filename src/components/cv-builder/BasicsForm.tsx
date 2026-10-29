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
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px dashed color-mix(in srgb, var(--rj-ink) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: color-mix(in srgb, var(--rj-ink) 40%, transparent);

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 8%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 50%, transparent);
    color: var(--rj-ink);
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
    color: var(--rj-ink);
  }
  
  small {
    font-size: 12px;
    color: color-mix(in srgb, var(--rj-ink) 40%, transparent);
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
  color: color-mix(in srgb, var(--rj-ink) 80%, transparent);
`;

const Input = styled.input`
  width: 100%;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--rj-ink);
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }

  &::placeholder {
    color: color-mix(in srgb, var(--rj-ink) 20%, transparent);
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
          <span>Photo</span>
          {cv.photoUrl ? (
            <button 
              onClick={(e) => { e.preventDefault(); updatePhoto(""); }}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--rj-ink-2)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', marginTop: '2px', fontWeight: 500 }}
            >
              Remove photo
            </button>
          ) : (
            <small>Optional. Most US employers prefer no photo, and an ATS can&apos;t read images.</small>
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
            onFocus={(e) => {
              if (e.target.value === "Gordon Freeman, Ph.D.") updateContact({ name: "" });
            }}
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
            onFocus={(e) => {
              if (e.target.value === "gfreeman@blackmesa.gov") updateContact({ email: "" });
            }}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Label>Phone</Label>
          <Input 
            type="tel"
            placeholder="+1 234 567 890" 
            value={cv.contact.phone}
            onChange={(e) => updateContact({ phone: e.target.value })}
            onFocus={(e) => {
              if (e.target.value === "(Classified)") updateContact({ phone: "" });
            }}
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
            onFocus={(e) => {
              if (e.target.value === "Black Mesa Research Facility, NM") updateContact({ location: "" });
            }}
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
            onFocus={(e) => {
              if (e.target.value === "linkedin.com/in/freeman-phd") updateContact({ linkedin: "" });
            }}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Label>Portfolio / Website (Optional)</Label>
          <Input 
            placeholder="alexchen.dev" 
            value={cv.contact.portfolio || ""}
            onChange={(e) => updateContact({ portfolio: e.target.value })}
            onFocus={(e) => {
              if (e.target.value === "blackmesa.gov/personnel/gfreeman") updateContact({ portfolio: "" });
            }}
          />
        </InputGroup>
      </Row>

    </FormContainer>
  );
}
