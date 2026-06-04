import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { TailoredResume } from './ResumeBuilder';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  // LEFT SIDEBAR
  sidebar: {
    flex: 0.34,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingTop: 0,
    paddingLeft: 6,
  },
  // RIGHT MAIN CONTENT
  mainContent: {
    flex: 0.66,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  // HEADERS
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    color: '#4F46E5',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E52D',
    color: '#4F46E5',
  },
  sidebarSectionHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E52D',
    color: '#4F46E5',
  },
  // TEXT STYLES
  normalText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#475569',
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  smallText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  lightText: {
    fontSize: 9,
    color: '#CBD5E1',
  },
  // CONTACT INFO
  contactItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6,
    fontSize: 8.5,
    color: '#475569',
    wordBreak: 'break-all',
    flexWrap: 'wrap',
  },
  contactLinkText: {
    fontSize: 8.5,
    color: '#475569',
    wordBreak: 'break-all',
    maxWidth: '95%',
  },
  contactLabel: {
    fontWeight: 'bold',
    marginRight: 6,
    color: '#4F46E5',
  },
  // EXPERIENCE
  experienceItem: {
    marginBottom: 12,
    pageBreakInside: 'avoid',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  jobMeta: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
    color: '#94A3B8',
  },
  jobDescription: {
    marginLeft: 10,
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 4,
    color: '#475569',
    lineHeight: 1.3,
  },
  // EDUCATION
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  institution: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 1,
  },
  period: {
    fontSize: 8,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  // SKILLS
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  skillItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 1,
  },
  // SUMMARY
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#475569',
    marginBottom: 12,
    textAlign: 'justify',
  },
  // PROJECTS
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  projectTech: {
    fontSize: 8,
    color: '#94A3B8',
    marginBottom: 3,
  },
  projectDesc: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
  },
});

interface ResumePDFProps {
  resume: TailoredResume;
  accentColor?: string;
  fontPair?: string;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ resume, accentColor = '#4F46E5', fontPair = 'outfit' }) => {
  const experienceItems = resume.experience.map((exp, idx) => (
    <View key={idx} style={styles.experienceItem}>
      <View style={styles.jobMeta}>
        <View>
          <Text style={styles.jobTitle}>{exp.role}</Text>
          <Text style={styles.smallText}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</Text>
        </View>
        <Text style={styles.smallText}>{exp.period}</Text>
      </View>
      <View style={styles.jobDescription}>
        {exp.description.map((desc, i) => (
          <Text key={i} style={styles.bulletPoint}>• {desc}</Text>
        ))}
      </View>
    </View>
  ));

  const educationItems = resume.education.map((edu, idx) => (
    <View key={idx} style={styles.educationItem}>
      <Text style={styles.degree}>{edu.degree}</Text>
      <Text style={styles.institution}>{edu.institution}</Text>
      <Text style={styles.period}>{edu.period} {edu.location ? `| ${edu.location}` : ''}</Text>
      {edu.details && <Text style={[styles.smallText, { marginTop: 2 }]}>{edu.details}</Text>}
    </View>
  ));

  const skillsSection = resume.skills.map((skill, idx) => (
    <View key={idx} style={styles.skillCategory}>
      <Text style={styles.skillCategoryName}>{skill.category}</Text>
      <Text style={styles.skillItem}>{skill.items.join(', ')}</Text>
    </View>
  ));

  const projectItems = resume.projects?.map((proj, idx) => (
    <View key={idx} style={styles.projectItem}>
      <Text style={styles.projectName}>{proj.name}</Text>
      <Text style={styles.projectTech}>
        {proj.link && `${proj.link} | `}Tech: {proj.technologies.join(', ')}
      </Text>
      <Text style={styles.projectDesc}>{proj.description}</Text>
    </View>
  )) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* LEFT SIDEBAR */}
          <View style={styles.sidebar}>
            {/* Contact Info */}
            <View style={{ marginBottom: 28 }}>
              <Text style={styles.sidebarSectionHeader}>Contact</Text>
              <View style={styles.contactItem}>
                <Text style={styles.normalText}>{resume.contact.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.normalText}>{resume.contact.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.normalText}>{resume.contact.location}</Text>
              </View>
              {resume.contact.website && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLinkText}>{resume.contact.website}</Text>
                </View>
              )}
              {resume.contact.linkedin && (
                <View style={[styles.contactItem, { maxWidth: '100%' }]}>
                  <Text style={[styles.contactLinkText, { maxWidth: '100%' }]}>{resume.contact.linkedin}</Text>
                </View>
              )}
              {resume.contact.github && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactLinkText}>{resume.contact.github}</Text>
                </View>
              )}
            </View>

            {/* Skills Section */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sidebarSectionHeader}>Core Expertise</Text>
              {skillsSection}
            </View>

            {/* Education Section */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sidebarSectionHeader}>Education</Text>
              {educationItems}
            </View>

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sidebarSectionHeader}>Certifications</Text>
                {resume.certifications.map((cert, idx) => (
                  <Text key={idx} style={styles.skillItem}>• {cert}</Text>
                ))}
              </View>
            )}

            {/* Languages */}
            {resume.languages && resume.languages.length > 0 && (
              <View>
                <Text style={styles.sidebarSectionHeader}>Languages</Text>
                {resume.languages.map((lang, idx) => (
                  <Text key={idx} style={styles.skillItem}>• {lang}</Text>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT MAIN CONTENT */}
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={{ marginBottom: 12, borderBottomWidth: 2.5, borderBottomColor: '#4F46E5', paddingBottom: 10 }}>
              <Text style={styles.headerTitle}>{resume.contact.name}</Text>
              <Text style={styles.headerSubtitle}>{resume.contact.title}</Text>
            </View>

            {/* Professional Summary */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.sectionHeader}>Professional Summary</Text>
              <Text style={styles.summary}>{resume.summary}</Text>
            </View>

            {/* Work Experience */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.sectionHeader}>Work History</Text>
              {experienceItems}
            </View>

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionHeader}>Projects</Text>
                {projectItems}
              </View>
            )}

            {/* References */}
            {resume.references && resume.references.length > 0 && (
              <View>
                <Text style={styles.sectionHeader}>References</Text>
                {resume.references.map((ref, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }}>
                    <Text style={styles.boldText}>{ref.name}</Text>
                    {ref.title && <Text style={styles.smallText}>{ref.title}</Text>}
                    {ref.company && <Text style={styles.smallText}>{ref.company}</Text>}
                    {ref.relationship && <Text style={styles.smallText}>{ref.relationship}</Text>}
                    {ref.email && <Text style={styles.smallText}>{ref.email}</Text>}
                    {ref.phone && <Text style={styles.smallText}>{ref.phone}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
