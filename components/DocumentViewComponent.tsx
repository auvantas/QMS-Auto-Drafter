
import React, { useState } from 'react';
import { DocumentDefinition } from '../types';
import { ALL_DOCUMENT_DEFINITIONS } from '../constants';
import { useQms } from '../contexts/QmsContext';
import ModalComponent from './ModalComponent';

// SVG Icon for Download (Heroicons)
const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


const DocumentViewComponent: React.FC = () => {
  const qmsContext = useQms();
  const [selectedDoc, setSelectedDoc] = useState<DocumentDefinition | null>(null);
  const [docContent, setDocContent] = useState<string>('');

  const handleViewDocument = (docDef: DocumentDefinition) => {
    const content = docDef.compileContent(qmsContext);
    setDocContent(content);
    setSelectedDoc(docDef);
  };

  const closeModal = () => {
    setSelectedDoc(null);
    setDocContent('');
  };
  
  const handleCopyToClipboard = () => {
    if(docContent) {
        navigator.clipboard.writeText(docContent)
            .then(() => alert('Document content copied to clipboard!'))
            .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  const handleDownloadDocument = () => {
    if (!selectedDoc || !docContent) return;

    const filename = `${selectedDoc.title.replace(/\s+/g, '_')}_${selectedDoc.revision}.md`;
    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeIn">
      <header className="mb-8 p-6 bg-gradient-to-r from-qms-secondary to-emerald-600 text-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">Generated QMS Documents</h2>
        <p className="mt-2 text-emerald-100">Review the documents compiled from your answers and AI assistance. You can copy or download the content.</p>
      </header>
      
      {ALL_DOCUMENT_DEFINITIONS.length === 0 && (
        <p className="text-qms-text-secondary">No document definitions found. Please define documents in constants.ts.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_DOCUMENT_DEFINITIONS.map(docDef => (
          <div key={docDef.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 flex flex-col">
            <h3 className="text-xl font-semibold text-qms-primary mb-2">{docDef.title}</h3>
            <p className="text-sm text-qms-text-secondary mb-1">ID: {docDef.id}</p>
            <p className="text-sm text-qms-text-secondary mb-4">Revision: {docDef.revision}</p>
            <button
              onClick={() => handleViewDocument(docDef)}
              className="w-full mt-auto px-4 py-2 bg-qms-secondary text-white rounded-md hover:bg-emerald-600 transition duration-150"
            >
              View/Compile Document
            </button>
          </div>
        ))}
      </div>

      <ModalComponent isOpen={!!selectedDoc} onClose={closeModal} title={selectedDoc?.title || 'Document Preview'}>
        {selectedDoc && (
          <>
            <div className="bg-gray-50 p-4 rounded-md border max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{docContent}</pre>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center px-4 py-2 bg-qms-accent text-white rounded-md hover:bg-amber-600 transition duration-150 text-sm"
                    aria-label="Copy document content to clipboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m0 0h-3.375m3.375 0h3.375M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Copy to Clipboard
                </button>
                 <button
                    onClick={handleDownloadDocument}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 text-sm"
                    aria-label="Download document content as a markdown file"
                >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Download Document
                </button>
            </div>
          </>
        )}
      </ModalComponent>
    </div>
  );
};

export default DocumentViewComponent;
