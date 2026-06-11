import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import type { TailoredResume } from './ResumeBuilder';

const styles = StyleSheet.create({
  page: {
    paddingTop: 45,
    paddingBottom: 45,
    paddingLeft: 45,
    paddingRight: 45,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  // Document Header in Clean Minimalism style
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 44,
    height: 44,
    backgroundColor: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  monogramText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  candidateName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  candidateTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#4F46E5', // overridden dynamically
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    fontSize: 8.5,
    color: '#64748B',
  },
  contactDivider: {
    color: '#CBD5E1',
  },
  contactLink: {
    color: '#0F172A',
    textDecoration: 'none',
  },
  
  // Section Header with Left-Border Accent
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#0F172A',
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#0F172A', // overridden dynamically
    marginTop: 18,
    marginBottom: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  
  // Paragraph Content
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#334155',
    textAlign: 'justify',
    marginBottom: 8,
  },
  
  // Work History Blocks
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  companyText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 1,
  },
  periodText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#4F46E5', // overridden dynamically
    textAlign: 'right',
  },
  bulletPointContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletPointDot: {
    fontSize: 9,
    marginRight: 6,
    color: '#64748B',
    marginTop: 1,
  },
  bulletPointText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.45,
    flex: 1,
  },
  
  // Education Blocks
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  degreeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  institutionText: {
    fontSize: 9,
    color: '#334155',
  },
  locationText: {
    fontSize: 8.5,
    color: '#64748B',
    fontStyle: 'italic',
  },
  
  // Skills Blocks
  skillsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 6,
  },
  skillRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 9,
  },
  skillCategory: {
    width: 110,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    fontSize: 8.5,
    letterSpacing: 0.5,
  },
  skillItemsText: {
    flex: 1,
    color: '#334155',
    lineHeight: 1.3,
  },
  
  // Projects Component
  projectItem: {
    marginBottom: 10,
  },
  projectHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  projectTech: {
    fontSize: 8,
    color: '#64748B',
    fontStyle: 'italic',
  },
  projectLinkText: {
    fontSize: 8.5,
    color: '#4F46E5', // overridden dynamically
    textDecoration: 'none',
  },
  projectDesc: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
  },
  
  // Simple Horizontal Badges for Certifications/Languages
  badgeList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  badgeItem: {
    fontSize: 8.5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    color: '#334155',
  },
  
  // Clean references columns
  referencesGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  referenceCard: {
    width: '47%',
    marginBottom: 6,
  },
  refName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 1,
  },
  refDetail: {
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.3,
  },

  // Document Footer (Page count / Confidential indicator)
  footerContainer: {
    position: 'absolute',
    bottom: 25,
    left: 45,
    right: 45,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.5,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

interface ResumePDFProps {
  resume: TailoredResume;
  accentColor?: string;
  fontPair?: string;
  layoutStyle?: 'split' | 'single';
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ 
  resume, 
  accentColor = '#4F46E5', 
  fontPair = 'outfit',
  layoutStyle = 'single'
}) => {
  // Helper to extract Name Initials for the elegant Vanguard-style signature monogram box
  const getInitials = (name: string): string => {
    if (!name) return 'V';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(resume.contact.name);

  // Dynamic overrides
  const dynamicStyles = {
    titleAccent: { color: accentColor },
    leftBorderAccent: { borderLeftColor: accentColor },
    periodTextAccent: { color: accentColor },
    linkAccent: { color: accentColor },
  };

  const hasProjects = resume.projects && resume.projects.length > 0;
  const hasCertifications = resume.certifications && resume.certifications.length > 0;
  const hasLanguages = resume.languages && resume.languages.length > 0;
  const hasReferences = resume.references && resume.references.length > 0;

  return (
    <Document>
      {/* 
        Single or multi-page layout. 
        Using standard Helvetica page flow so that text wraps naturally 
        without overlap or jumping behind side-columns.
      */}
      <Page size="A4" style={styles.page}>
        
        {/* Header Block */}
        <View style={styles.headerContainer} wrap={false}>
          <View style={styles.headerLeft}>
            <Text style={styles.candidateName}>{resume.contact.name}</Text>
            <Text style={[styles.candidateTitle, dynamicStyles.titleAccent]}>{resume.contact.title}</Text>
            
            <View style={styles.contactRow}>
              <Text>{resume.contact.email}</Text>
              <Text style={styles.contactDivider}>•</Text>
              <Text>{resume.contact.phone}</Text>
              <Text style={styles.contactDivider}>•</Text>
              <Text>{resume.contact.location}</Text>
              
              {resume.contact.website && (
                <>
                  <Text style={styles.contactDivider}>•</Text>
                  <Link src={resume.contact.website.startsWith('http') ? resume.contact.website : `https://${resume.contact.website}`} style={[styles.contactLink, styles.contactRow]}>
                    <Text>{resume.contact.website}</Text>
                  </Link>
                </>
              )}
              {resume.contact.linkedin && (
                <>
                  <Text style={styles.contactDivider}>•</Text>
                  <Link src={resume.contact.linkedin.startsWith('http') ? resume.contact.linkedin : `https://${resume.contact.linkedin}`} style={[styles.contactLink, styles.contactRow]}>
                    <Text>LinkedIn: {resume.contact.linkedin}</Text>
                  </Link>
                </>
              )}
              {resume.contact.github && (
                <>
                  <Text style={styles.contactDivider}>•</Text>
                  <Link src={resume.contact.github.startsWith('http') ? resume.contact.github : `https://${resume.contact.github}`} style={[styles.contactLink, styles.contactRow]}>
                    <Text>GitHub: {resume.contact.github}</Text>
                  </Link>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Professional Summary */}
        {resume.summary && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
              Executive Summary
            </Text>
            <Text style={styles.summaryText}>{resume.summary}</Text>
          </View>
        )}

        {/* Core Expertise / Skills */}
        <View wrap={false} style={{ marginBottom: 6 }}>
          <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
            Core Expertise
          </Text>
          <View style={styles.skillsGrid}>
            {resume.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{skill.category}</Text>
                <Text style={styles.skillItemsText}>{skill.items.join('  •  ')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Work Experience */}
        <View style={{ marginBottom: 6 }}>
          <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
            Work History
          </Text>
          
          {resume.experience.map((exp, idx) => (
            <View key={idx} style={styles.experienceItem} wrap={false}>
              <View style={styles.experienceHeader}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.roleText}>{exp.role}</Text>
                  <Text style={styles.companyText}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</Text>
                </View>
                <Text style={[styles.periodText, dynamicStyles.periodTextAccent]}>{exp.period}</Text>
              </View>
              
              <View style={{ marginTop: 4 }}>
                {exp.description.map((desc, i) => {
                  const cleanText = desc.replace(/^[•-]\s*/, '');
                  return (
                    <View key={i} style={styles.bulletPointContainer}>
                      <Text style={styles.bulletPointDot}>•</Text>
                      <Text style={styles.bulletPointText}>{cleanText}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={{ marginBottom: 6 }}>
          <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
            Education
          </Text>
          {resume.education.map((edu, idx) => (
            <View key={idx} style={styles.educationItem} wrap={false}>
              <View style={styles.educationHeader}>
                <Text style={styles.degreeText}>{edu.degree}</Text>
                <Text style={[styles.periodText, dynamicStyles.periodTextAccent]}>{edu.period}</Text>
              </View>
              <Text style={styles.institutionText}>
                {edu.institution} {edu.location ? `  |  ${edu.location}` : ''}
              </Text>
              {edu.details && (
                <Text style={[styles.bulletPointText, { marginTop: 2, color: '#64748B' }]}>
                  {edu.details}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Projects */}
        {hasProjects && (
          <View style={{ marginBottom: 6 }}>
            <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
              Featured Projects
            </Text>
            {resume.projects!.map((proj, idx) => (
              <View key={idx} style={styles.projectItem} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  <Text style={styles.projectTech}>Tech Stack: {proj.technologies.join(', ')}</Text>
                </View>
                {proj.link && (
                  <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={[styles.projectLinkText, dynamicStyles.linkAccent, { marginBottom: 3 }]}>
                    <Text>Project Link: {proj.link}</Text>
                  </Link>
                )}
                <Text style={styles.projectDesc}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Credentials / Certifications */}
        {hasCertifications && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
              Certifications & Credentials
            </Text>
            <View style={styles.badgeList}>
              {resume.certifications!.map((cert, idx) => (
                <Text key={idx} style={styles.badgeItem}>{cert}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {hasLanguages && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
              Languages
            </Text>
            <View style={styles.badgeList}>
              {resume.languages!.map((lang, idx) => (
                <Text key={idx} style={styles.badgeItem}>{lang}</Text>
              ))}
            </View>
          </View>
        )}

        {/* References */}
        {hasReferences && (
          <View wrap={false} style={{ marginBottom: 6 }}>
            <Text style={[styles.sectionHeader, dynamicStyles.titleAccent, dynamicStyles.leftBorderAccent]}>
              References
            </Text>
            <View style={styles.referencesGrid}>
              {resume.references!.map((ref, idx) => (
                <View key={idx} style={styles.referenceCard}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  {ref.title && <Text style={styles.refDetail}>{ref.title}</Text>}
                  {ref.company && <Text style={styles.refDetail}>{ref.company}</Text>}
                  {ref.relationship && (
                    <Text style={[styles.refDetail, { fontStyle: 'italic', color: '#64748B' }]}>
                      {ref.relationship}
                    </Text>
                  )}
                  {(ref.email || ref.phone) && (
                    <Text style={[styles.refDetail, { marginTop: 1, color: '#334155' }]}>
                      {[ref.email, ref.phone].filter(Boolean).join('  •  ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerText}>RESUME ARCHITECT • PRIVATE & CONFIDENTIAL</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>

      </Page>
    </Document>
  );
};
