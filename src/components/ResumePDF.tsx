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
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 36,
    paddingBottom: 44,
    paddingRight: 24,
    // Left padding is handled by mainContent's marginLeft to keep sidebar full bleed
    display: 'flex',
    flexDirection: 'row',
  },
  // Solid full-bleed sidebar background on every page
  sidebarBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '30%',
    backgroundColor: '#2E3544',
    borderLeftWidth: 10, // Leftmost vertical accent focus line
  },
  // Sidebar content only on the first page
  sidebarContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    color: '#FFFFFF',
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  // Main column perfectly cleared of sidebar on every page
  mainContent: {
    marginLeft: '33%',
    display: 'flex',
    flexDirection: 'column',
    width: '67%',
  },
  
  // Sidebar Components
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#4A5568',
    paddingBottom: 5,
    marginBottom: 10,
  },
  sidebarContactItem: {
    marginBottom: 10,
  },
  sidebarContactLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  sidebarContactValue: {
    fontSize: 8.5,
    color: '#FFFFFF',
    lineHeight: 1.35,
  },
  sidebarContactLink: {
    fontSize: 8.5,
    color: '#FFFFFF',
    textDecoration: 'none',
    lineHeight: 1.25,
  },
  sidebarSkillCategory: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 2,
  },
  sidebarSkillItem: {
    fontSize: 8.5,
    color: '#E2E8F0',
    lineHeight: 1.3,
    marginBottom: 5,
  },
  sidebarAwardItem: {
    marginBottom: 8,
  },
  sidebarAwardHeader: {
    fontSize: 7.5,
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  sidebarAwardName: {
    fontSize: 8.5,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 1.25,
  },

  // Main Right Column Components
  headerContainer: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  candidateName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  candidateTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#64748B',
  },
  
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#1E293B',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 5,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: '#475569',
    textAlign: 'justify',
  },

  // Dual-column format for Experience / Education listings
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 14,
  },
  itemLeftCol: {
    width: '32%',
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  itemRightCol: {
    width: '68%',
    display: 'flex',
    flexDirection: 'column',
  },
  periodText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    lineHeight: 1.3,
  },
  companyText: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 1.25,
  },
  locationText: {
    fontSize: 8,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 1,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  bulletPointContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 2,
  },
  bulletPointDot: {
    fontSize: 9,
    marginRight: 5,
    color: '#94A3B8',
    marginTop: 0.5,
  },
  bulletPointText: {
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.45,
    flex: 1,
  },

  // Education Styles
  degreeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  eduDetails: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 3,
    lineHeight: 1.35,
  },

  // Projects Styles (Nested format matching Experience)
  projectItem: {
    marginBottom: 10,
  },
  projectHeaderDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  projectName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  projectTech: {
    fontSize: 8,
    color: '#64748B',
    fontStyle: 'italic',
  },
  projectLinkText: {
    fontSize: 8,
    color: '#4F46E5', // overridden dynamically below
    textDecoration: 'none',
    marginBottom: 3,
  },
  projectDesc: {
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.35,
  },

  // References styles
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
    color: '#1E293B',
    marginBottom: 2,
  },
  refDetail: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.3,
  },
  refContact: {
    fontSize: 8,
    color: '#334155',
    fontWeight: 'bold',
    marginTop: 2,
    lineHeight: 1.3,
  },

  footerContainer: {
    position: 'absolute',
    bottom: 12,
    left: '33%',
    right: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 4,
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
    letterSpacing: 0.5,
  }
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
  const hasProjects = resume.projects && resume.projects.length > 0;
  const hasCertifications = resume.certifications && resume.certifications.length > 0;
  const hasLanguages = resume.languages && resume.languages.length > 0;
  const hasReferences = resume.references && resume.references.length > 0;

  // Dynamic overrides
  const dynamicStyles = {
    titleAccent: { color: accentColor },
    borderLeftColor: { borderLeftColor: accentColor },
    linkAccent: { color: accentColor },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column Sidebar Background - fixed on every page */}
        <View style={[styles.sidebarBackground, dynamicStyles.borderLeftColor]} fixed />
        
        {/* Left Column Sidebar Content - Absolute positioned on first page only */}
        <View style={styles.sidebarContent}>
          
          {/* Contact Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            
            {resume.contact.phone && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>Phone</Text>
                <Text style={styles.sidebarContactValue}>{resume.contact.phone}</Text>
              </View>
            )}
            
            {resume.contact.email && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>Email</Text>
                <Text style={styles.sidebarContactValue}>{resume.contact.email}</Text>
              </View>
            )}
            
            {resume.contact.location && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>Address</Text>
                <Text style={styles.sidebarContactValue}>{resume.contact.location}</Text>
              </View>
            )}

            {resume.contact.linkedin && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>LinkedIn</Text>
                <Link src={resume.contact.linkedin.startsWith('http') ? resume.contact.linkedin : `https://${resume.contact.linkedin}`} style={styles.sidebarContactLink}>
                  <Text>{resume.contact.linkedin}</Text>
                </Link>
              </View>
            )}

            {resume.contact.github && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>GitHub</Text>
                <Link src={resume.contact.github.startsWith('http') ? resume.contact.github : `https://${resume.contact.github}`} style={styles.sidebarContactLink}>
                  <Text>{resume.contact.github}</Text>
                </Link>
              </View>
            )}

            {resume.contact.website && (
              <View style={styles.sidebarContactItem}>
                <Text style={styles.sidebarContactLabel}>Website</Text>
                <Link src={resume.contact.website.startsWith('http') ? resume.contact.website : `https://${resume.contact.website}`} style={styles.sidebarContactLink}>
                  <Text>{resume.contact.website}</Text>
                </Link>
              </View>
            )}
          </View>

          {/* Expertise Section */}
          {resume.skills && resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Expertise</Text>
              {resume.skills.map((skill, idx) => (
                <View key={idx} style={{ marginBottom: 6 }}>
                  <Text style={styles.sidebarSkillCategory}>{skill.category}</Text>
                  <Text style={styles.sidebarSkillItem}>{skill.items.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Language Section */}
          {hasLanguages && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Language</Text>
              {resume.languages!.map((lang, idx) => (
                <Text key={idx} style={styles.sidebarSkillItem}>• {lang}</Text>
              ))}
            </View>
          )}

          {/* Awards Section */}
          {hasCertifications && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Awards</Text>
              {resume.certifications!.map((cert, idx) => {
                const parts = cert.split('|');
                if (parts.length > 1) {
                  return (
                    <View key={idx} style={styles.sidebarAwardItem}>
                      <Text style={styles.sidebarAwardHeader}>{parts[0].trim()}</Text>
                      <Text style={styles.sidebarAwardName}>{parts.slice(1).join('|').trim()}</Text>
                    </View>
                  );
                }
                return (
                  <View key={idx} style={styles.sidebarAwardItem}>
                    <Text style={styles.sidebarAwardName}>{cert}</Text>
                  </View>
                );
              })}
            </View>
          )}

        </View>

        {/* Right Column Main Body */}
        <View style={styles.mainContent}>
          
          {/* Header (Candidate Name & Professional Title) */}
          <View style={styles.headerContainer} wrap={false}>
            <Text style={styles.candidateName}>{resume.contact.name}</Text>
            <Text style={[styles.candidateTitle, dynamicStyles.titleAccent]}>{resume.contact.title}</Text>
          </View>

          {/* Profile Summary */}
          {resume.summary && (
            <View style={styles.sectionContainer} wrap={false}>
              <Text style={styles.sectionHeader}>Profile</Text>
              <Text style={styles.summaryText}>{resume.summary}</Text>
            </View>
          )}

          {/* Experience Section */}
          <View style={styles.sectionContainer}>
            {/* Keeping the Experience header and the first job together so they don't break across pages */}
            <View wrap={false}>
              <Text style={styles.sectionHeader}>Experience</Text>
              {resume.experience.length > 0 && (
                <View style={styles.itemRow}>
                  <View style={styles.itemLeftCol}>
                    <Text style={styles.periodText}>{resume.experience[0].period}</Text>
                    <Text style={styles.companyText}>{resume.experience[0].company}</Text>
                    {resume.experience[0].location && <Text style={styles.locationText}>{resume.experience[0].location}</Text>}
                  </View>
                  <View style={styles.itemRightCol}>
                    <Text style={styles.roleText}>{resume.experience[0].role}</Text>
                    {resume.experience[0].description.map((desc, i) => {
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
              )}
            </View>

            {/* Render the remaining Experience items */}
            {resume.experience.slice(1).map((exp, idx) => (
              <View key={idx} style={styles.itemRow} wrap={false}>
                <View style={styles.itemLeftCol}>
                  <Text style={styles.periodText}>{exp.period}</Text>
                  <Text style={styles.companyText}>{exp.company}</Text>
                  {exp.location && <Text style={styles.locationText}>{exp.location}</Text>}
                </View>
                <View style={styles.itemRightCol}>
                  <Text style={styles.roleText}>{exp.role}</Text>
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

          {/* Education Section - Blocked entirely to prevent page-break orphan headers */}
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionHeader}>Education</Text>
            {resume.education.map((edu, idx) => (
              <View key={idx} style={styles.itemRow} wrap={false}>
                <View style={styles.itemLeftCol}>
                  <Text style={styles.periodText}>{edu.period}</Text>
                  <Text style={styles.companyText}>{edu.institution}</Text>
                  {edu.location && <Text style={styles.locationText}>{edu.location}</Text>}
                </View>
                <View style={styles.itemRightCol}>
                  <Text style={styles.degreeText}>{edu.degree}</Text>
                  {edu.details && <Text style={styles.eduDetails}>{edu.details}</Text>}
                </View>
              </View>
            ))}
          </View>

          {/* Featured Projects Section - Blocked entirely to prevent split headers */}
          {hasProjects && (
            <View style={styles.sectionContainer} wrap={false}>
              <Text style={styles.sectionHeader}>Featured Projects</Text>
              {resume.projects!.map((proj, idx) => (
                <View key={idx} style={styles.itemRow} wrap={false}>
                  <View style={styles.itemLeftCol}>
                    <Text style={styles.periodText}>Project</Text>
                    {proj.link && (
                      <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={[styles.projectLinkText, dynamicStyles.linkAccent]}>
                        <Text>View Project</Text>
                      </Link>
                    )}
                  </View>
                  <View style={styles.itemRightCol}>
                    <Text style={styles.roleText}>{proj.name}</Text>
                    <Text style={[styles.projectTech, { marginBottom: 4 }]}>Technologies: {proj.technologies.join(', ')}</Text>
                    <Text style={styles.projectDesc}>{proj.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* References Section - Blocked entirely to prevent split headers */}
          {hasReferences && (
            <View style={styles.sectionContainer} wrap={false}>
              <Text style={styles.sectionHeader}>References</Text>
              <View style={styles.referencesGrid}>
                {resume.references!.map((ref, idx) => (
                  <View key={idx} style={styles.referenceCard}>
                    <Text style={styles.refName}>{ref.name}</Text>
                    {ref.title && <Text style={styles.refDetail}>{ref.title}</Text>}
                    {ref.company && <Text style={styles.refDetail}>{ref.company}</Text>}
                    {ref.relationship && (
                      <Text style={[styles.refDetail, { fontStyle: 'italic', color: '#64748B', marginTop: 1 }]}>
                        {ref.relationship}
                      </Text>
                    )}
                    {(ref.email || ref.phone) && (
                      <Text style={styles.refContact}>
                        {[
                          ref.phone ? `Phone: ${ref.phone}` : null,
                          ref.email ? `Email: ${ref.email}` : null
                        ].filter(Boolean).join('\n')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

        </View>

        {/* Unified minimal clean footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>

      </Page>
    </Document>
  );
};
