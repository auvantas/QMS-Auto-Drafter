
import { Section, QuestionType, DocumentDefinition, QmsContextType } from './types';

// Helper to construct a basic document section from answers/AI suggestions
const buildSectionContent = (
  title: string,
  items: Array<{ questionId: string; label: string }>,
  context: QmsContextType,
  includeAiDraft?: boolean
): string => {
  let content = `### ${title}\n`;
  items.forEach(item => {
    const answer = context.getAnswer(item.questionId) || `[${item.label} not yet provided]`;
    content += `**${item.label}:** ${answer}\n`;
    if (includeAiDraft) {
      const aiSuggestion = context.getAiSuggestion(`${item.questionId}_ai_draft`);
      if (aiSuggestion) {
        content += `\n*AI Draft for ${item.label}:*\n${aiSuggestion.text}\n`;
        if (aiSuggestion.sources && aiSuggestion.sources.length > 0) {
          content += `\n*Sources from AI Search:*\n`;
          aiSuggestion.sources.forEach(source => {
            if (source.web && source.web.uri) {
              content += `- ${source.web.title || source.web.uri} (${source.web.uri})\n`;
            }
          });
        }
      }
    }
    content += '\n';
  });
  return content;
};

export const STRATEGY_VS_PLAN_EXPLANATION = `
**Understanding the Difference: Plan vs. Strategy**

It's important to distinguish between a "plan" and a "strategy" when defining your organization's direction.

*   **Purpose and Goal:**
    *   A **plan** is typically a list of activities or tasks to be performed. It outlines the steps or initiatives a company intends to engage in. Plans are often associated with aspirational goals or a list of desired improvements.
    *   A **strategy** is an integrated set of choices and actions aimed at achieving a specific competitive outcome or occupying a valuable position within a chosen competitive landscape. It defines how an organisation will be better than its competitors and how it will "win" in the market. Strategy is useless without a clear objective or outcome.

*   **Focus and Control:**
    *   **Planning** tends to be internally focused, emphasizing improvements and projects within the organisation's control. It is often more comfortable because it deals with resources and activities that the organisation directly manages, such as building a new plant or hiring staff.
    *   **Strategy** requires balancing internal improvements with a clear understanding of the external market and competitive landscape. It focuses on desired *outcomes* influenced by external factors like customer choices and competitor actions, which are not within the organisation's direct control.

*   **Characteristics and Approach:**
    *   **Planning** does not necessarily require internal coherence between its listed activities. It can feel comforting because the activities are perceived as doable and within control. Annual reports often function as lists of planned activities completed, rather than demonstrating how they contribute to a competitive advantage.
    *   **Strategy** is a coherent, integrated set of choices and activities (or tactics) that need to be well-aligned. It involves making choices about what to do *and, importantly, what not to do*. Strategy can involve angst because its success cannot be proven in advance. It's a process of continuous refinement and adaptation based on the dynamic external environment. Strategy is also personal and tailored to the specific organisation, its resources, and its context.

*   **Risk and Outcomes:**
    *   Simply focusing on **planning** (listing activities) without a strategy is described as potentially leading to activities that "won't add up to much" and can be a way to guarantee losing in a competitive environment.
    *   Having a **strategy** gives the best possible chance of winning. It requires defining a clear competitive position and articulating a unique value proposition that differentiates the organisation from rivals. Strategy is about creating value, either by increasing the customer's willingness to pay or decreasing the cost to the organisation (willingness to sell).

In essence, while a **plan** is a list of activities, a **strategy** is a set of integrated choices about *how to compete and win* in a specific external environment. A plan details *what* you will do; a strategy explains *why* those actions will position you to succeed relative to others.
`;


const QUALITY_MANUAL_DEF: DocumentDefinition = {
  id: 'L1-MAN-001', 
  title: 'Quality Manual',
  revision: 'Rev 0',
  compileContent: (context: QmsContextType) => {
    const { 
      companyName, companyAbbreviation, companyAddress, 
      topManagementName, topManagementTitle, qmsRepresentativeName, qmsRepresentativeTitle,
      documentEffectiveDate 
    } = context;

    let content = `# ${QUALITY_MANUAL_DEF.title}\n`;
    content += `## ${companyName || '[Company Name]'}\n`;
    if (companyAbbreviation) content += `(${companyAbbreviation})\n`;
    content += `\n**Document ID:** ${QUALITY_MANUAL_DEF.id}\n`;
    content += `**Revision:** ${QUALITY_MANUAL_DEF.revision}\n`;
    content += `**Effective Date:** ${documentEffectiveDate || '[Effective Date]'}\n\n`;
    content += `**Address:** ${companyAddress || '[Company Address]'}\n\n`;
    content += `**Approved By:** ${topManagementName || '[Top Management Name]'}, ${topManagementTitle || '[Top Management Title]'}\n`;
    if (qmsRepresentativeName) {
      content += `**QMS Representative:** ${qmsRepresentativeName}, ${qmsRepresentativeTitle || '[QMS Rep Title]'}\n`;
    }
    content += `\n---\n\n`;
    
    content += buildSectionContent('1. Context of the Organization', [
      { questionId: '1.1.a', label: "Organization's Purpose & Strategic Direction" },
      { questionId: '1.1.b', label: 'Key Stakeholders & Expectations' },
      { questionId: '1.1.c', label: 'Internal & External Issues' },
      { questionId: '1.1.d', label: 'Legal & Regulatory Requirements' },
    ], context, true);

    content += buildSectionContent('2. Scope of the QMS', [
      { questionId: '1.2.a', label: 'QMS Scope Statement' },
      { questionId: '1.2.b', label: 'Applicable Standards/Frameworks' },
    ], context, true);
    
    content += buildSectionContent('3. QMS Processes & Interactions', [
       { questionId: '1.3.a', label: 'Key QMS Processes' },
    ], context, true);

    content += `\n### 4. Leadership Commitment\n`;
    content += `**${topManagementName || '[Top Management Name]'} (${topManagementTitle || '[Top Management Title]'})** and the leadership team of **${companyName || '[Company Name]'}** are committed to the development and implementation of the Quality Management System and continually improving its effectiveness. This includes ensuring quality objectives are established, communicating the importance of meeting customer as well as statutory and regulatory requirements, conducting management reviews, and ensuring the availability of resources.\n`;
    content += `[Further details about leadership commitment to be populated from relevant questions & AI assistance...]\n`;
    
    content += "\n### 5. Planning for the QMS\n[Details about QMS planning, risk management, objectives to be populated...]\n";
    
    return content;
  }
};

const CODE_OF_CONDUCT_DEF: DocumentDefinition = {
  id: 'L1-POL-001', 
  title: 'Code of Conduct and Business Ethics',
  revision: 'Rev 0',
  compileContent: (context: QmsContextType) => {
    const { companyName, documentEffectiveDate, topManagementName, topManagementTitle } = context;

    let content = `# ${CODE_OF_CONDUCT_DEF.title}\n`;
    content += `## For ${companyName || '[Company Name]'}\n\n`;
    content += `**Document ID:** ${CODE_OF_CONDUCT_DEF.id}\n`;
    content += `**Revision:** ${CODE_OF_CONDUCT_DEF.revision}\n`;
    content += `**Effective Date:** ${documentEffectiveDate || '[Effective Date]'}\n\n`;
    content += `**Approved By:** ${topManagementName || '[Top Management Name]'}, ${topManagementTitle || '[Top Management Title]'}\n\n`;
    content += `This Code of Conduct and Business Ethics applies to all employees, officers, and directors of **${companyName || '[Company Name]'}**.\n\n---\n\n`;

    content += buildSectionContent('1. Core Ethical Values', [
      { questionId: '2.1.a', label: "Core Ethical Values & Principles" },
    ], context, true);
    
    content += buildSectionContent('2. Business Conduct Standards', [
      { questionId: '2.1.b', label: "Specific Conduct Standards (e.g., conflicts of interest, gifts)" },
    ], context, true);

    content += "\n### 3. Reporting Violations\n[Procedure for reporting violations to be populated...]\n";
    content += `\nAll personnel of **${companyName || '[Company Name]'}** are encouraged to report any suspected violations of this Code.\n`;

    return content;
  }
};


export const SECTIONS_DATA: Section[] = [
  {
    id: 's1',
    title: 'Section 1: Laying the Foundation',
    description: 'Define the purpose, scope, and context of your QMS. This information is crucial for your Quality Manual and strategic alignment.',
    questions: [
      {
        id: '1.1.a',
        text: "What is your organization's primary purpose and strategic direction?",
        type: QuestionType.TEXTAREA,
        helpText: 'Consider your mission, vision, and core business activities. This will form part of your Quality Manual. Ensure this describes a strategy, not just a list of plans.',
        placeholder: 'e.g., To be the leading provider of innovative software solutions for small businesses, focusing on user experience and customer satisfaction, achieved by differentiating through superior customer support and rapid feature deployment.',
        aiPromptTemplate: (answer) => `Based on the organizational purpose and strategic direction: "${answer}", draft an introductory paragraph for the 'Organizational Context' section of a Quality Manual. Focus on clarity and conciseness.`,
        searchQueryTemplate: (answer) => `Examples of strategic direction statements for organizations with purpose: ${answer}`,
      },
      {
        id: '1.1.b',
        text: 'Who are your key stakeholders (internal and external) and what are their relevant needs and expectations?',
        type: QuestionType.TEXTAREA,
        helpText: 'E.g., customers, employees, suppliers, regulators, shareholders. This also goes into the Quality Manual.',
        placeholder: 'e.g., Customers: reliable products, excellent support. Employees: fair wages, growth opportunities. Regulators: compliance with X, Y, Z.',
        aiPromptTemplate: (answer) => `Given the key stakeholders and their expectations: "${answer}", draft a paragraph outlining how these influence the QMS for the 'Organizational Context' section of a Quality Manual.`,
      },
      {
        id: '1.1.c',
        text: 'What are the key internal and external issues that can affect your QMS and its ability to achieve intended results?',
        type: QuestionType.TEXTAREA,
        helpText: 'Consider SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).',
        placeholder: 'e.g., Internal: aging infrastructure, skilled workforce. External: market competition, technological changes.',
        aiPromptTemplate: (answer) => `Based on these internal/external issues: "${answer}", summarize their impact on the QMS.`,
      },
      {
        id: '1.1.d',
        text: 'What are the key legal, regulatory, and contractual requirements applicable to your products/services and QMS?',
        type: QuestionType.TEXTAREA,
        helpText: 'This is critical for compliance. Be specific.',
        placeholder: 'e.g., ISO 9001:2015, GDPR, specific industry regulations like FDA for medical devices.',
        aiPromptTemplate: (answer) => `For an organization with these legal/regulatory requirements: "${answer}", draft a statement of commitment to compliance for a Quality Manual.`,
        searchQueryTemplate: (answer) => `Relevant legal and regulatory frameworks for an organization in [describe industry/region] with obligations: ${answer}`,
      },
      {
        id: '1.2.a',
        text: 'Define the scope of your QMS. What products, services, processes, and sites are covered?',
        type: QuestionType.TEXTAREA,
        helpText: 'A clear scope is essential. E.g., "The design, development, and support of X software, at our main office."',
        placeholder: 'e.g., The design, development, manufacturing, and servicing of custom electronic components at the Springfield facility.',
        aiPromptTemplate: (answer) => `Based on this QMS scope: "${answer}", draft a formal scope statement for a Quality Manual. Ensure it clearly defines boundaries and applicability.`,
      },
       {
        id: '1.2.b',
        text: 'What specific standards or frameworks (e.g., ISO 9001, AS9100) will your QMS adhere to?',
        type: QuestionType.TEXTAREA,
        placeholder: 'e.g., ISO 9001:2015, CMMI Level 3',
        aiPromptTemplate: (answer) => `Draft a sentence for a Quality Manual stating adherence to these standards: "${answer}".`,
      },
      {
        id: '1.3.a',
        text: 'Identify the key processes within your QMS and their sequence and interaction.',
        type: QuestionType.TEXTAREA,
        helpText: 'Think high-level: e.g., Sales -> Design -> Production -> Delivery. A process map can be helpful.',
        placeholder: 'e.g., Customer Inquiry -> Quoting -> Order Processing -> Design & Development -> Production -> Quality Control -> Shipping -> Post-Sales Support.',
        aiPromptTemplate: (answer) => `Based on these key QMS processes and interactions: "${answer}", draft a section for the Quality Manual describing the process approach. Consider mentioning inputs, outputs, and controls for key processes.`,
      },
    ],
    generatesDocuments: [QUALITY_MANUAL_DEF]
  },
  {
    id: 's2',
    title: 'Section 2: Developing Core Corporate Policies (Level 1)',
    description: 'Establish fundamental policies that guide your organization. These will be referenced in your QMS.',
    questions: [
      {
        id: '2.1.a',
        text: 'What are your organization\'s core ethical values and principles?',
        type: QuestionType.TEXTAREA,
        helpText: 'E.g., Integrity, Honesty, Respect, Accountability. This forms the basis of your Code of Conduct.',
        placeholder: 'e.g., Integrity, Customer Focus, Innovation, Teamwork, Responsibility.',
        aiPromptTemplate: (answer) => `Based on these core ethical values: "${answer}", draft the 'Core Principles' section of a Code of Conduct (${CODE_OF_CONDUCT_DEF.id}).`,
        searchQueryTemplate: (answer) => `Examples of core ethical values statements for corporate codes of conduct. Values: ${answer}`,
      },
      {
        id: '2.1.b',
        text: 'What specific standards of business conduct do you want to establish (e.g., conflicts of interest, gifts & entertainment, confidentiality, fair dealing)?',
        type: QuestionType.TEXTAREA,
        placeholder: 'e.g., Strict policy on conflicts of interest, no acceptance of gifts above nominal value, protection of confidential information, fair competition.',
        aiPromptTemplate: (answer) => `For a Code of Conduct, draft clauses covering these business conduct standards: "${answer}". Provide a brief explanation for each standard.`,
      },
      // Add more questions for HR Policies (2.2), HSEQ Policies (2.3), etc.
      // For brevity, only a few questions are listed. A full implementation would include all.
    ],
    generatesDocuments: [CODE_OF_CONDUCT_DEF] // Add other policy documents here
  },
  // Sections 3, 4, 5, 6 would be structured similarly, with their respective questions and document definitions.
  // For brevity, these are omitted but would follow the pattern above.
  // Example:
  // { id: 's3', title: 'Section 3: QMS Manuals & Plans (Level 2)', ... }
  // { id: 's4', title: 'Section 4: Procedures (Level 3)', ... }
  // { id: 's5', title: 'Section 5: Supporting Docs (Level 4)', ... }
  // { id: 's6', title: 'Section 6: Implementation & Improvement', ... }
];

export const ALL_DOCUMENT_DEFINITIONS: DocumentDefinition[] = SECTIONS_DATA.reduce((acc, section) => {
  if (section.generatesDocuments) {
    section.generatesDocuments.forEach(docDef => {
      if (!acc.find(d => d.id === docDef.id)) {
        acc.push(docDef);
      }
    });
  }
  return acc;
}, [] as DocumentDefinition[]);
