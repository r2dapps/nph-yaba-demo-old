import React, { useEffect, useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginScreen } from './components/screens/LoginScreen';

import { DashboardScreen } from './components/screens/DashboardScreen';
import { MembersScreen } from './components/screens/MembersScreen';
import { PlansPricingScreen } from './components/screens/PlansPricingScreen';
import { DirectoryScreen, MyCompanyScreen } from './components/screens/DirectoryScreen';
import { RegistrationsQueueScreen } from './components/screens/RegistrationsQueueScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { TradeMissionsScreen, WebinarsScreen } from './components/screens/TradeMissionsScreen';
import { ShopCartScreen, OrdersInvoicesScreen } from './components/screens/ShopCartScreen';
import { ReferralsCommissionScreen, IntroductionsScreen } from './components/screens/ReferralsCommissionScreen';
import { BlogSubmissionsScreen, NewsletterCreditsScreen } from './components/screens/BlogSubmissionsScreen';
import { CampaignsScreen, AutomationsScreen, WorkflowSlaScreen } from './components/screens/CampaignsScreen';
import { ReportsScreen, SecurityAuditScreen, MigrationScreen } from './components/screens/ReportsScreen';
import { OrganisationDetailModal, PersonDetailModal } from './components/screens/OrganisationDetailModal';
import { GoogleSheetViewerModal } from './components/screens/GoogleSheetViewerModal';
import { LoginModal } from './components/screens/LoginModal';

const SESSION_KEY = 'nph-demo-in-v2';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useData();
  const [entered, setEntered] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(() => localStorage.getItem('nph-nav-collapsed') === '1');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isSheetViewerOpen, setIsSheetViewerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (entered) sessionStorage.setItem(SESSION_KEY, '1');
  }, [entered]);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeTab]);

  const toggleNavCollapsed = () => {
    setNavCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('nph-nav-collapsed', next ? '1' : '0');
      return next;
    });
  };

  if (!entered) {
    return (
      <LoginScreen
        onEnter={() => {
          sessionStorage.setItem(SESSION_KEY, '1');
          setEntered(true);
        }}
      />
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            onOpenOrgDetail={(id) => setSelectedOrgId(id)}
            onOpenPersonDetail={(id) => setSelectedPersonId(id)}
          />
        );
      case 'members':
      case 'organisations':
        return <MembersScreen onOpenOrgDetail={(id) => setSelectedOrgId(id)} />;
      case 'directory':
        return (
          <DirectoryScreen
            onOpenOrgDetail={(id) => setSelectedOrgId(id)}
            onOpenPersonDetail={(id) => setSelectedPersonId(id)}
          />
        );
      case 'my-company':
        return <MyCompanyScreen onOpenPersonDetail={(id) => setSelectedPersonId(id)} />;
      case 'plans':
        return <PlansPricingScreen />;
      case 'registrations':
        return (
          <RegistrationsQueueScreen
            onOpenOrgDetail={(id) => setSelectedOrgId(id)}
            onOpenPersonDetail={(id) => setSelectedPersonId(id)}
          />
        );
      case 'events':
        return <EventsScreen onOpenPersonDetail={(id) => setSelectedPersonId(id)} />;
      case 'missions':
        return <TradeMissionsScreen onOpenPersonDetail={(id) => setSelectedPersonId(id)} />;
      case 'webinars':
        return <WebinarsScreen />;
      case 'shop':
        return <ShopCartScreen />;
      case 'orders':
        return <OrdersInvoicesScreen />;
      case 'referrals':
        return <ReferralsCommissionScreen onOpenOrgDetail={(id) => setSelectedOrgId(id)} />;
      case 'introductions':
        return <IntroductionsScreen />;
      case 'blogs':
        return <BlogSubmissionsScreen />;
      case 'newsletter':
        return <NewsletterCreditsScreen />;
      case 'campaigns':
        return <CampaignsScreen />;
      case 'automations':
        return <AutomationsScreen />;
      case 'workflow':
        return <WorkflowSlaScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'security':
        return <SecurityAuditScreen />;
      case 'migration':
        return <MigrationScreen />;
      default:
        return (
          <DashboardScreen
            onOpenOrgDetail={(id) => setSelectedOrgId(id)}
            onOpenPersonDetail={(id) => setSelectedPersonId(id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <DemoBanner onOpenSheetViewer={() => setIsSheetViewerOpen(true)} />
      <Navbar
        onOpenSheetViewer={() => setIsSheetViewerOpen(true)}
        onOpenCart={() => setActiveTab('shop')}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto relative">
        {menuOpen && (
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-ink/40 z-40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-0 transform transition-transform lg:transform-none ${
            menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-[calc(100vh-6.5rem)] lg:h-auto lg:min-h-[calc(100vh-6.5rem)]">
            <Sidebar
              onOpenSheetViewer={() => setIsSheetViewerOpen(true)}
              onNavigate={() => setMenuOpen(false)}
              collapsed={menuOpen ? false : navCollapsed}
              onToggleCollapse={toggleNavCollapsed}
            />
          </div>
        </div>

        <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto max-h-[calc(100vh-6.5rem)]">
          {renderActiveScreen()}
        </main>
      </div>

      <OrganisationDetailModal
        orgId={selectedOrgId}
        onClose={() => setSelectedOrgId(null)}
        onOpenPersonDetail={(personId) => {
          setSelectedOrgId(null);
          setSelectedPersonId(personId);
        }}
      />
      <PersonDetailModal
        personId={selectedPersonId}
        onClose={() => setSelectedPersonId(null)}
        onOpenOrgDetail={(orgId) => {
          setSelectedPersonId(null);
          setSelectedOrgId(orgId);
        }}
      />
      <GoogleSheetViewerModal isOpen={isSheetViewerOpen} onClose={() => setIsSheetViewerOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
