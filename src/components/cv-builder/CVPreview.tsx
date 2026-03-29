import styled from "styled-components";
import { useCVStore } from "./store";
import { motion } from "framer-motion";
import type { CVExperience, CVEducation, CVCertification } from '@/types/cv';

const Paper = styled.div`
  width: 100%;
  max-width: 780px; 
  aspect-ratio: 1 / 1.414;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2);
  display: flex;
  flex-direction: column;
  padding: 48px;
  color: #1a1a1a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div<{ $theme: string }>`
  padding-bottom: 24px;
  border-bottom: 2px solid ${props => props.$theme};
  margin-bottom: 24px;
`;

const Name = styled.h1<{ $theme: string }>`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  color: ${props => props.$theme};
`;

const ContactInfo = styled.div`
  color: #555;
  font-size: 13px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ContactItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SectionTitle = styled.h2<{ $theme: string }>`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.$theme};
  margin: 0 0 16px 0;
  border-bottom: 1px solid ${props => props.$theme}40;
  padding-bottom: 8px;
`;

const EmptyPlaceholder = styled(motion.div)`
  height: 24px;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  width: 100%;
`;

const ProfilePhoto = styled.div`
  width: 95px;
  aspect-ratio: 4 / 5;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.1);
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center 15%; /* Odak noktasını yüz hizasında tutar */
  }
`;

const parseDateForSort = (dateStr?: string | null) => {
  if (!dateStr || dateStr.trim() === '') return 0;
  const lower = dateStr.toLowerCase();
  if (lower.includes('present') || lower.includes('devam') || lower.includes('current')) {
    return Infinity; // Always newest
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }
  // Fallback: extract 4 digit year
  const match = dateStr.match(/\d{4}/);
  if (match) {
    return parseInt(match[0]) * 31556952000; // rough ms value for a year to sort cleanly
  }
  return 0; // If completely unparseable string, treat as oldest
};


export function CVPreview() {
  const { cv } = useCVStore();
  
  const hasContactInfo = 
    cv.contact.name || 
    cv.contact.email || 
    cv.contact.phone || 
    cv.contact.location;

  const validEducation = cv.education.filter(e => e.institution?.trim() !== "");
  const sortedEducation = [...validEducation].sort((a, b) => {
    return parseDateForSort(b.graduationDate) - parseDateForSort(a.graduationDate);
  });

  const validExperience = cv.experience.filter(e => e.title?.trim() !== "" || e.company?.trim() !== "");
  const sortedExperience = [...validExperience].sort((a, b) => {
    // For experience, usually EndDate defines if it's recent or not, or StartDate if end date is missing
    const dateToCompareB = b.endDate ? b.endDate : b.startDate;
    const dateToCompareA = a.endDate ? a.endDate : a.startDate;
    return parseDateForSort(dateToCompareB) - parseDateForSort(dateToCompareA);
  });

  const validCerts = (cv.certifications || []).filter(c => c.name?.trim() !== "");

  const theme = cv.themeColor || '#000000';

  return (
    <Paper id="cv-preview-paper">
      
      {/* Contact Section */}
      <Header $theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            {cv.contact.name ? (
              <Name $theme={theme}>{cv.contact.name}</Name>
            ) : (
              <EmptyPlaceholder style={{ width: '60%', height: '32px', marginBottom: '8px' }} />
            )}
            
            <ContactInfo>
              {cv.contact.email && <ContactItem>{cv.contact.email}</ContactItem>}
              {cv.contact.phone && <ContactItem>• {cv.contact.phone}</ContactItem>}
              {cv.contact.location && <ContactItem>• {cv.contact.location}</ContactItem>}
              {cv.contact.linkedin && <ContactItem>• {cv.contact.linkedin.replace('https://', '')}</ContactItem>}
              {cv.contact.portfolio && <ContactItem>• {cv.contact.portfolio.replace('https://', '')}</ContactItem>}
            </ContactInfo>
            
            {!hasContactInfo && !cv.contact.name && (
              <EmptyPlaceholder style={{ width: '80%', height: '16px', marginTop: '12px' }} />
            )}
          </div>
          {cv.photoUrl && (
            <ProfilePhoto>
              <img src={cv.photoUrl} alt="Profile" />
            </ProfilePhoto>
          )}
        </div>
      </Header>
      
      {/* Summary Section (If exists) */}
      {cv.summary && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>Summary</SectionTitle>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#333' }}>
            {cv.summary}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {(sortedExperience.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>Experience</SectionTitle>
          {sortedExperience.map((exp: CVExperience, idx: number) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{exp.title}</span>
                {(exp.startDate || exp.endDate) && (
                  <span style={{ color: '#666', fontSize: '13px' }}>
                    {[exp.startDate, exp.endDate || (exp.startDate ? 'Present' : '')].filter(Boolean).join(' — ')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '8px', color: '#444', fontWeight: 500 }}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                {exp.bullets.map((bullet: string, i: number) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {(sortedEducation.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>Education</SectionTitle>
          {sortedEducation.map((edu: CVEducation, idx: number) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                </span>
                <span style={{ color: '#666', fontSize: '13px' }}>{edu.graduationDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', color: '#444' }}>
                  {[edu.institution, edu.location].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {(validCerts.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>Certifications & Courses</SectionTitle>
          {validCerts.map((cert: CVCertification, idx: number) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{cert.name}</span>
                <span style={{ color: '#666', fontSize: '13px' }}>{cert.date}</span>
              </div>
              {(cert.issuer || cert.credentialId) && (
                <div style={{ fontSize: '14px', color: '#444' }}>
                  {[cert.issuer, cert.credentialId ? `ID: ${cert.credentialId}` : ''].filter(Boolean).join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {(cv.skills.technical.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>Skills</SectionTitle>
          <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
            {cv.skills.technical.join(' • ')}
          </div>
        </div>
      )}

    </Paper>
  );
}
