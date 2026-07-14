import styled from "styled-components";
import { useCVStore } from "./store";
import { motion } from "framer-motion";
import type { CVExperience, CVEducation, CVCertification, CVLeadership, CVLanguage } from '@/types/cv';
import { detectLocale, CV_HEADINGS } from "@/lib/languageUtils";

const Paper = styled.div`
  width: 100%;
  max-width: 780px; 
  min-height: 1103px; /* Standard A4 height relative to 780px width */
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2);
  display: flex;
  flex-direction: column;
  padding: 48px;
  color: #1a1a1a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  height: max-content;

  @media (max-width: 780px) {
    /* Maintain A4 proportion minimally on smaller screens */
    min-height: 141.4vw;
  }
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
  
  // If the date string has text but no year (e.g. "Bis heute", "Aujourd'hui", "Настоящее время")
  // it is almost certainly a translated version of "Present". Treat it as Infinity.
  return Infinity; 
};


export function CVPreview() {
  const { cv } = useCVStore();
  
  const allText = [
    cv.summary,
    ...cv.experience.map(e => `${e.title} ${e.bullets.join(" ")}`)
  ].join(" ");
  
  const cvLanguage = detectLocale(allText);
  const headings = CV_HEADINGS[cvLanguage] || CV_HEADINGS['en'];
  
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

  const validProjects = (cv.projects || []).filter(p => p.name?.trim() !== '');

  const validCerts = (cv.certifications || []).filter(c => c.name?.trim() !== '');

  const validLeadership = (cv.leadership || []).filter(l => l.title?.trim() !== '' || l.organization?.trim() !== '');
  const sortedLeadership = [...validLeadership].sort((a, b) => {
    const dateA = a.endDate ? a.endDate : a.startDate;
    const dateB = b.endDate ? b.endDate : b.startDate;
    return parseDateForSort(dateB) - parseDateForSort(dateA);
  });

  const validLanguages = (cv.languages || []).filter(l => l.language?.trim() !== '');

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
          <SectionTitle $theme={theme}>{headings.summary}</SectionTitle>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#333' }}>
            {cv.summary}
          </p>
        </div>
      )}

      {/* Experience & Projects Sections */}
      {cv.isEntryLevel ? (
        <>
          {validProjects.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SectionTitle $theme={theme}>{headings.projects || 'Projects'}</SectionTitle>
              {validProjects.map((proj: CVProject, idx: number) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{proj.name}</span>
                    {(proj.startDate || proj.endDate) && (
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        {[proj.startDate, proj.endDate || (proj.startDate ? 'Present' : '')].filter(Boolean).join(' — ')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px', color: '#444', fontWeight: 500 }}>
                    {proj.role || 'Project'} {proj.url && `• ${proj.url}`}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                      {proj.bullets.map((bullet: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {sortedExperience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SectionTitle $theme={theme}>{validProjects.length > 0 ? (headings.experience_only || 'Experience') : (headings.experience || 'Experience & Projects')}</SectionTitle>
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
        </>
      ) : (
        <>
          {sortedExperience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SectionTitle $theme={theme}>{headings.experience}</SectionTitle>
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
          {validProjects.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {sortedExperience.length === 0 && (
                <SectionTitle $theme={theme}>{headings.projects || 'Projects'}</SectionTitle>
              )}
              {validProjects.map((proj: CVProject, idx: number) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{proj.name}</span>
                    {(proj.startDate || proj.endDate) && (
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        {[proj.startDate, proj.endDate || (proj.startDate ? 'Present' : '')].filter(Boolean).join(' — ')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px', color: '#444', fontWeight: 500 }}>
                    {proj.role || 'Project'} {proj.url && `• ${proj.url}`}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                      {proj.bullets.map((bullet: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Education Section */}
      {(sortedEducation.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>{headings.education}</SectionTitle>
          {sortedEducation.map((edu: CVEducation, idx: number) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                </span>
                <span style={{ color: '#666', fontSize: '13px' }}>{edu.graduationDate}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#444', marginTop: '2px' }}>
                {[edu.institution, edu.location].filter(Boolean).join(', ')}
              </div>
              {edu.details && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', lineHeight: 1.5 }}>
                  {edu.details}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {(validCerts.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>{headings.certifications}</SectionTitle>
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

      {/* Leadership & Activities Section */}
      {(sortedLeadership.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>{headings.leadership}</SectionTitle>
          {sortedLeadership.map((role: CVLeadership, idx: number) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{role.title}</span>
                {(role.startDate || role.endDate) && (
                  <span style={{ color: '#666', fontSize: '13px' }}>
                    {[role.startDate, role.endDate || (role.startDate ? 'Present' : '')].filter(Boolean).join(' — ')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', color: '#444', fontWeight: 500, marginBottom: '6px' }}>
                {role.organization}{role.location ? ` • ${role.location}` : ''}
              </div>
              {role.bullets && role.bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                  {role.bullets.map((bullet: string, i: number) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {(cv.skills.technical.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>{headings.skills}</SectionTitle>
          <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
            {cv.skills.technical.join(' • ')}
          </div>
        </div>
      )}

      {/* Languages Section */}
      {(validLanguages.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle $theme={theme}>{headings.languages}</SectionTitle>
          <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>
            {validLanguages.map((l: CVLanguage) =>
              l.proficiency ? `${l.language} (${l.proficiency})` : l.language
            ).join(' • ')}
          </div>
        </div>
      )}

    </Paper>
  );
}
