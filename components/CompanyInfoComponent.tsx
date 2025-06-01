
import React from 'react';
import { useQms } from '../contexts/QmsContext';
import { ActiveView } from '../types';

interface CompanyInfoComponentProps {
  onNavigate: (view: ActiveView, id?: string) => void;
}

const CompanyInfoComponent: React.FC<CompanyInfoComponentProps> = ({ onNavigate }) => {
  const {
    companyName, updateCompanyName,
    companyAbbreviation, updateCompanyAbbreviation,
    companyAddress, updateCompanyAddress,
    topManagementName, updateTopManagementName,
    topManagementTitle, updateTopManagementTitle,
    qmsRepresentativeName, updateQmsRepresentativeName,
    qmsRepresentativeTitle, updateQmsRepresentativeTitle,
    documentEffectiveDate, updateDocumentEffectiveDate,
  } = useQms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Data is already in context due to onChange handlers
    onNavigate('dashboard');
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-qms-primary focus:border-qms-primary sm:text-sm";
  const labelClass = "block text-sm font-medium text-qms-text-primary";

  return (
    <div className="animate-fadeIn p-6 bg-white shadow-xl rounded-lg max-w-2xl mx-auto">
      <header className="mb-8 p-6 bg-gradient-to-r from-qms-primary to-blue-600 text-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold">Company Information</h2>
        <p className="mt-2 text-blue-100">Please provide some basic details about your organization. This information will be used to prefill your QMS documents.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyName" className={labelClass}>Company Full Legal Name</label>
          <input type="text" id="companyName" value={companyName} onChange={(e) => updateCompanyName(e.target.value)} className={inputClass} placeholder="e.g., Acme Innovations Ltd." required />
        </div>

        <div>
          <label htmlFor="companyAbbreviation" className={labelClass}>Company Abbreviation (Optional)</label>
          <input type="text" id="companyAbbreviation" value={companyAbbreviation} onChange={(e) => updateCompanyAbbreviation(e.target.value)} className={inputClass} placeholder="e.g., AIL" />
        </div>

        <div>
          <label htmlFor="companyAddress" className={labelClass}>Company Full Address</label>
          <textarea id="companyAddress" value={companyAddress} onChange={(e) => updateCompanyAddress(e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="e.g., 123 Innovation Drive, Tech City, TX 75001, USA" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="topManagementName" className={labelClass}>Top Management Full Name</label>
            <input type="text" id="topManagementName" value={topManagementName} onChange={(e) => updateTopManagementName(e.target.value)} className={inputClass} placeholder="e.g., Dr. Jane Doe" required/>
          </div>
          <div>
            <label htmlFor="topManagementTitle" className={labelClass}>Top Management Title</label>
            <input type="text" id="topManagementTitle" value={topManagementTitle} onChange={(e) => updateTopManagementTitle(e.target.value)} className={inputClass} placeholder="e.g., CEO / Managing Director" required/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="qmsRepresentativeName" className={labelClass}>QMS Representative Full Name (Optional)</label>
            <input type="text" id="qmsRepresentativeName" value={qmsRepresentativeName} onChange={(e) => updateQmsRepresentativeName(e.target.value)} className={inputClass} placeholder="e.g., John Smith" />
          </div>
          <div>
            <label htmlFor="qmsRepresentativeTitle" className={labelClass}>QMS Representative Title (Optional)</label>
            <input type="text" id="qmsRepresentativeTitle" value={qmsRepresentativeTitle} onChange={(e) => updateQmsRepresentativeTitle(e.target.value)} className={inputClass} placeholder="e.g., Quality Manager" />
          </div>
        </div>
        
        <div>
          <label htmlFor="documentEffectiveDate" className={labelClass}>Default Document Effective Date</label>
          <input type="text" id="documentEffectiveDate" value={documentEffectiveDate} onChange={(e) => updateDocumentEffectiveDate(e.target.value)} className={inputClass} placeholder="e.g., YYYY-MM-DD or 'To be determined'" />
           <p className="mt-1 text-xs text-qms-text-secondary">This will be used as a default effective date in your documents. You can use "To be determined" or a specific date.</p>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-qms-secondary hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-qms-secondary transition duration-150"
          >
            Save & Continue to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoComponent;
