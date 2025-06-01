
import React from 'react';
import { SECTIONS_DATA } from '../constants';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  activeSectionId: string | null;
  onNavigate: (view: ActiveView, id?: string) => void;
}

// SVG Icons
const HomeIcon: React.FC<{ className?: string }> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-3.434-1.279h-1.875a3.75 3.75 0 01-3.75-3.75V5.25a9.768 9.768 0 00-1.279-.234z" />
  </svg>
);

const ListIcon: React.FC<{ className?: string }> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
  <path fillRule="evenodd" d="M2.625 6.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H3.375a.75.75 0 01-.75-.75v-.01zM3.375 12a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12.75a.75.75 0 00-.75-.75h-.01zm.75 5.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H4.125a.75.75 0 01-.75-.75v-.01zM7.125 6.75A.75.75 0 017.875 6H18a.75.75 0 010 1.5H7.875a.75.75 0 01-.75-.75zM7.875 12H18a.75.75 0 010 1.5H7.875a.75.75 0 010-1.5zm0 5.25H18a.75.75 0 010 1.5H7.875a.75.75 0 010-1.5z" clipRule="evenodd" />
</svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const BuildingOfficeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 00-.75.75v18a.75.75 0 00.75.75h15a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v3a.75.75 0 00.75.75h3v-3.375A3.75 3.75 0 0016.5 9.75V6.75A3.75 3.75 0 0012.75 3H5.25a.75.75 0 00-.75-.75V2.25zm3 11.25A.75.75 0 018.25 12h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8.25a.75.75 0 01-.75-.75v-.01zM9.75 9a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.01zm.75 3.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM7.5 9a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75H7.5zm3-3A.75.75 0 0111.25 6h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V6.75zM9.75 6a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-.01zM7.5 6A.75.75 0 006.75 6.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H7.5z" clipRule="evenodd" />
    <path d="M12.75 17.25a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75v-2.25a.75.75 0 00-.75-.75H13.5a.75.75 0 00-.75.75v2.25z" />
  </svg>
);


const SidebarComponent: React.FC<SidebarProps> = ({ activeView, activeSectionId, onNavigate }) => {
  const baseClasses = "flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-md transition-colors duration-150";
  const activeClasses = "bg-qms-primary text-white shadow-lg";
  const inactiveClasses = "text-gray-200 hover:bg-blue-700 hover:text-white";

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col min-h-screen p-4 space-y-2">
      <h1 className="text-2xl font-bold text-center py-4 mb-4 border-b border-blue-700">
        QMS Auto-Drafter
      </h1>
      
      <button
        onClick={() => onNavigate('companyInfo')}
        className={`${baseClasses} ${activeView === 'companyInfo' ? activeClasses : inactiveClasses}`}
      >
        <BuildingOfficeIcon className="mr-3 h-5 w-5" />
        Company Information
      </button>

      <button
        onClick={() => onNavigate('dashboard')}
        className={`${baseClasses} ${activeView === 'dashboard' ? activeClasses : inactiveClasses}`}
      >
        <HomeIcon className="mr-3 h-5 w-5" />
        Dashboard / Home
      </button>

      <button
        onClick={() => onNavigate('documents')}
        className={`${baseClasses} ${activeView === 'documents' ? activeClasses : inactiveClasses}`}
      >
        <DocumentIcon className="mr-3 h-5 w-5" />
        View Generated Documents
      </button>
      
      <button
        onClick={() => onNavigate('isoInfo')}
        className={`${baseClasses} ${activeView === 'isoInfo' ? activeClasses : inactiveClasses}`}
      >
        <InformationCircleIcon className="mr-3 h-5 w-5" />
        About ISO 9001:2015
      </button>

      <div className="pt-4 mt-4 border-t border-blue-700">
        <h2 className="px-4 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">QMS Sections</h2>
        {SECTIONS_DATA.map(section => (
          <button
            key={section.id}
            onClick={() => onNavigate('section', section.id)}
            className={`${baseClasses} ${activeView === 'section' && activeSectionId === section.id ? activeClasses : inactiveClasses}`}
          >
            <ListIcon className="mr-3 h-5 w-5" />
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarComponent;
