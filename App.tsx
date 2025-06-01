
import React, { useState, useMemo } from 'react';
import { QmsProvider } from './contexts/QmsContext';
import LayoutComponent from './components/LayoutComponent';
import SectionComponent from './components/SectionComponent';
import DocumentViewComponent from './components/DocumentViewComponent';
import IsoInfoComponent from './components/IsoInfoComponent';
import CompanyInfoComponent from './components/CompanyInfoComponent'; // Import CompanyInfoComponent
import { SECTIONS_DATA } from './constants';
import { Section, ActiveView } from './types';

const DashboardComponent: React.FC<{onNavigate: (view: ActiveView, id?: string) => void}> = ({onNavigate}) => (
  <div className="animate-fadeIn p-6 bg-white shadow-xl rounded-lg">
    <h2 className="text-3xl font-bold text-qms-primary mb-4">Welcome to QMS Auto-Drafter!</h2>
    <p className="text-lg text-qms-text-secondary mb-6">
      This application will guide you through creating your Quality Management System documentation.
      Use the sidebar to navigate through QMS sections, answer questions, and leverage AI assistance
      to draft and refine your content.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold text-qms-primary mb-2">Getting Started</h3>
        <ul className="list-disc list-inside text-qms-text-secondary space-y-1">
           <li>Start by filling out your <button onClick={() => onNavigate('companyInfo')} className="text-qms-primary hover:underline font-medium">Company Information</button>.</li>
          <li>Select a QMS section from the sidebar to begin.</li>
          <li>Answer the questions provided.</li>
          <li>Use "AI Draft Assist" to get help writing content.</li>
          <li>Use "AI Search Info" for research and examples.</li>
          <li>View compiled documents under "View Generated Documents".</li>
          <li>Learn more about ISO 9001:2015 in the "About ISO 9001:2015" section.</li>
        </ul>
      </div>
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <h3 className="text-xl font-semibold text-qms-secondary mb-2">Tips for Success</h3>
         <ul className="list-disc list-inside text-qms-text-secondary space-y-1">
          <li>Be thorough and accurate in your answers.</li>
          <li>Review AI-generated content carefully.</li>
          <li>Adapt suggestions to your specific organizational context.</li>
          <li>Remember, this tool assists, but you are the expert on your organization.</li>
        </ul>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('companyInfo'); // Start with companyInfo view
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const handleNavigate = (view: ActiveView, id?: string) => {
    setActiveView(view);
    if (view === 'section' && id) {
      setActiveSectionId(id);
    } else {
      setActiveSectionId(null);
    }
  };

  const currentSection: Section | undefined = useMemo(() => {
    if (activeView === 'section' && activeSectionId) {
      return SECTIONS_DATA.find(s => s.id === activeSectionId);
    }
    return undefined;
  }, [activeView, activeSectionId]);

  const renderMainContent = () => {
    switch (activeView) {
      case 'companyInfo':
        return <CompanyInfoComponent onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardComponent onNavigate={handleNavigate} />;
      case 'section':
        return currentSection ? <SectionComponent section={currentSection} /> : <p>Section not found.</p>;
      case 'documents':
        return <DocumentViewComponent />;
      case 'isoInfo':
        return <IsoInfoComponent />;
      default:
        return <DashboardComponent onNavigate={handleNavigate} />; // Fallback to dashboard
    }
  };

  return (
    <QmsProvider>
      <LayoutComponent 
        activeView={activeView}
        activeSectionId={activeSectionId}
        onNavigate={handleNavigate}
      >
        {renderMainContent()}
      </LayoutComponent>
    </QmsProvider>
  );
};

export default App;
