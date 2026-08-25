import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, ShoppingCart, Bell, Menu, Database } from 'lucide-react';

interface NavbarProps {
  onOpenSheetViewer: () => void;
  onOpenCart: () => void;
  onOpenLoginModal: () => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSheetViewer,
  onOpenCart,
  onOpenLoginModal,
  onOpenMenu,
}) => {
  const {
    currentUser,
    currentRole,
    searchQuery,
    setSearchQuery,
    cart,
    tasks,
    setActiveTab,
    organisations,
  } = useData();

  const [open, setOpen] = useState(false);
  const userOrg = organisations.find((o) => o.id === currentUser.organisation_id);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <header className="bg-ink text-cream sticky top-0 z-40 border-b border-ink-2">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-16 flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 -ml-1 rounded-md hover:bg-ink-2"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button type="button" onClick={() => setActiveTab('dashboard')} className="flex items-center gap-3 shrink-0 text-left">
          <span className="w-9 h-9 rounded-sm bg-brass text-ink font-display font-semibold flex items-center justify-center text-sm">
            NY
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-[1.05rem] font-semibold leading-none">NPH / YABA</span>
            <span className="block text-[11px] text-[#9aa7b3] mt-1 tracking-wide">Member portal</span>
          </span>
        </button>

        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <label className="relative w-full">
            <span className="sr-only">Search</span>
            <Search className="w-4 h-4 text-[#9aa7b3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search organisations, missions, orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink-2 border border-[#2a4660] text-cream placeholder:text-[#8b97a3] text-sm rounded-md pl-9 pr-3 py-2"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSheetViewer}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md hover:bg-ink-2"
          >
            <Database className="w-4 h-4" />
            Tables
          </button>
          <button type="button" onClick={onOpenCart} className="relative p-2 rounded-md hover:bg-ink-2" aria-label="Basket">
            <ShoppingCart className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brass text-ink text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setActiveTab('workflow')} className="relative p-2 rounded-md hover:bg-ink-2" aria-label="Tasks">
            <Bell className="w-4 h-4" />
            {pendingTasks > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-alert text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {pendingTasks}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-md hover:bg-ink-2"
            >
              <span className="w-8 h-8 rounded-full bg-ink-2 border border-brass/50 flex items-center justify-center font-semibold text-brass text-xs">
                {currentUser.full_name.charAt(0)}
              </span>
              <span className="hidden sm:block text-left">
                <span className="block text-xs font-semibold leading-tight">{currentUser.full_name}</span>
                <span className="block text-[10px] text-[#9aa7b3]">{currentRole}</span>
              </span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-cream text-ink border border-line rounded-lg py-2 z-50 shadow-none">
                <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted font-semibold">
                  {userOrg?.name}
                </p>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-paper"
                  onClick={() => {
                    setOpen(false);
                    onOpenLoginModal();
                  }}
                >
                  Switch persona
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-paper"
                  onClick={() => {
                    setOpen(false);
                    sessionStorage.removeItem('nph-demo-in-v2');
                    window.location.reload();
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
