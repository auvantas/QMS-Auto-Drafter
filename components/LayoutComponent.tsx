
import React, { ReactNode } from 'react';
import SidebarComponent from './SidebarComponent';
import { ActiveView } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeView: ActiveView;
  activeSectionId: string | null;
  onNavigate: (view: ActiveView, id?: string) => void;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children, activeView, activeSectionId, onNavigate }) => {
  return (
    <div className="flex min-h-screen">
      <SidebarComponent 
        activeView={activeView}
        activeSectionId={activeSectionId}
        onNavigate={onNavigate}
      />
      <main className="flex-1 p-8 bg-qms-bg overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutComponent;
    