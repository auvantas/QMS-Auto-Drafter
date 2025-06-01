
import React from 'react';

const IsoInfoComponent: React.FC = () => {
  const principles = [
    { name: "Customer focus", description: "Understanding current and future customer needs, meeting customer requirements, and striving to exceed customer expectations." },
    { name: "Leadership", description: "Establishing unity of purpose and direction and creating conditions in which people are engaged in achieving the quality objectives of the organization." },
    { name: "Engagement of people", description: "Competent, empowered, and engaged people at all levels throughout the organization are essential to enhance its capability to create and deliver value." },
    { name: "Process approach", description: "Consistent and predictable results are achieved more effectively and efficiently when activities are understood and managed as interrelated processes that function as a coherent system." },
    { name: "Improvement", description: "Successful organizations have an ongoing focus on improvement." },
    { name: "Evidence-based decision making", description: "Decisions based on the analysis and evaluation of data and information are more likely to produce desired results." },
    { name: "Relationship management", description: "For sustained success, an organization manages its relationships with interested parties, such as suppliers." }
  ];

  const benefits = [
    "Increased efficiency and productivity",
    "Improved customer satisfaction and loyalty",
    "Enhanced market reputation and credibility",
    "Better decision-making processes",
    "Greater employee engagement and morale",
    "Reduced waste and operational costs",
    "Facilitation of continual improvement",
    "Better integration and alignment of internal processes",
    "Access to new markets (as ISO 9001 is often a requirement)"
  ];

  return (
    <div className="animate-fadeIn p-6 bg-white shadow-xl rounded-lg">
      <header className="mb-8 p-6 bg-gradient-to-r from-qms-primary to-blue-600 text-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">About ISO 9001:2015 - Quality Management Systems</h2>
      </header>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-qms-text-primary mb-3">What is ISO 9001?</h3>
        <p className="text-qms-text-secondary leading-relaxed">
          ISO 9001 is the world's most recognized Quality Management System (QMS) standard. Its aim is to help organizations
          meet the needs of their customers and other stakeholders more effectively. This is achieved by building a framework
          to ensure consistent quality in the provision of goods and/or services.
        </p>
        <p className="text-qms-text-secondary leading-relaxed mt-2">
          The standard is based on a number of quality management principles, including a strong customer focus, the motivation
          and implication of top management, the process approach, and continual improvement. ISO 9001:2015 is the current
          version of the standard.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-qms-text-primary mb-4">Key Quality Management Principles (QMPs)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map(principle => (
            <div key={principle.name} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-qms-primary mb-1">{principle.name}</h4>
              <p className="text-sm text-qms-text-secondary">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-qms-text-primary mb-3">Benefits of Implementing ISO 9001</h3>
        <ul className="list-disc list-inside text-qms-text-secondary space-y-2 pl-4">
          {benefits.map(benefit => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>
      
      <section>
        <h3 className="text-2xl font-semibold text-qms-text-primary mb-3">How QMS Auto-Drafter Can Help</h3>
        <p className="text-qms-text-secondary leading-relaxed">
          While this QMS Auto-Drafter application does not guarantee ISO 9001 certification, it is designed to help you
          structure and draft key documentation that is often required or beneficial for a QMS aligned with ISO 9001 principles.
          The Q&A format helps address aspects related to:
        </p>
        <ul className="list-disc list-inside text-qms-text-secondary space-y-1 pl-4 mt-2">
            <li>Defining the context of your organization and stakeholder needs.</li>
            <li>Establishing a scope for your QMS.</li>
            <li>Developing policies and objectives.</li>
            <li>Documenting key processes and procedures.</li>
        </ul>
        <p className="text-qms-text-secondary leading-relaxed mt-2">
          The AI-assisted drafting and web search features can further help you research and formulate content relevant to
          ISO 9001 requirements. Always consult the official ISO 9001 standard and consider expert guidance for
          full implementation and certification.
        </p>
      </section>
    </div>
  );
};

export default IsoInfoComponent;
