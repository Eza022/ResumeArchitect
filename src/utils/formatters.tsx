import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { TailoredResume } from '../types/resume';

export const formatResumeToMarkdown = (resume: TailoredResume): string => {
  let md = `# ${resume.contact.name}\n`;
  md += `**${resume.contact.title}**\n\n`;
  md += `✉️ ${resume.contact.email} | 📞 ${resume.contact.phone} | 📍 ${resume.contact.location}\n`;
  
  const links = [];
  if (resume.contact.website) links.push(`🌐 ${resume.contact.website}`);
  if (resume.contact.linkedin) links.push(`🔗 LinkedIn: ${resume.contact.linkedin}`);
  if (resume.contact.github) links.push(`💻 GitHub: ${resume.contact.github}`);
  if (links.length > 0) {
    md += `${links.join(' | ')}\n`;
  }
  
  md += `\n---\n\n`;
  md += `## Professional Summary\n${resume.summary}\n\n`;
  
  md += `## Professional Experience\n\n`;
  resume.experience.forEach(exp => {
    md += `### ${exp.role} | ${exp.company}\n`;
    md += `*${exp.period}* | *${exp.location || ''}*\n`;
    exp.description.forEach(point => {
      md += `- ${point}\n`;
    });
    md += `\n`;
  });
  
  md += `## Skills\n\n`;
  resume.skills.forEach(skill => {
    md += `**${skill.category}**: ${skill.items.join(', ')}\n\n`;
  });
  
  if (resume.projects && resume.projects.length > 0) {
    md += `## Projects\n\n`;
    resume.projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      if (proj.link) md += `*Link: ${proj.link}* | `;
      md += `*Tech Stack: ${proj.technologies.join(', ')}*\n`;
      md += `${proj.description}\n\n`;
    });
  }
  
  if (resume.education && resume.education.length > 0) {
    md += `## Education\n\n`;
    resume.education.forEach(edu => {
      md += `### ${edu.degree}\n`;
      md += `${edu.institution} | ${edu.period}\n`;
      if (edu.details) md += `${edu.details}\n`;
      md += `\n`;
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    md += `\n## Certifications\n`;
    resume.certifications.forEach(cert => {
      md += `- ${cert}\n`;
    });
  }

  if (resume.languages && resume.languages.length > 0) {
    md += `\n## Languages\n`;
    resume.languages.forEach(lang => {
      md += `- ${lang}\n`;
    });
  }

  return md;
};

const pdfExportStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  body: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#334155',
  },
  paragraph: {
    marginBottom: 12,
  }
});

export const createTextDocument = (title: string, content: string) => {
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  
  return (
    <Document>
      <Page size="A4" style={pdfExportStyles.page}>
        <Text style={pdfExportStyles.header}>{title}</Text>
        <View style={{ marginTop: 10 }}>
          {paragraphs.map((p, i) => (
            <Text key={i} style={[pdfExportStyles.body, pdfExportStyles.paragraph]}>
              {p}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};
