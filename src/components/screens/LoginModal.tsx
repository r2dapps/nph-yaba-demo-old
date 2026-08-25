import React from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PERSONAS: { email: string; name: string; role: UserRole; org: string }[] = [
  { email: 'nina.admin@nph-demo.org', name: 'Nina Campbell', role: 'Super Admin', org: 'NPH / YABA' },
  { email: 'raj.membership@nph-demo.org', name: 'Rajiv Patel', role: 'Membership Manager', org: 'NPH / YABA' },
  { email: 'priya.marketing@nph-demo.org', name: 'Priya Sharma', role: 'Marketing Manager', org: 'NPH / YABA' },
  { email: 'owen.events@nph-demo.org', name: 'Owen Davies', role: 'Events Manager', org: 'NPH / YABA' },
  { email: 'fatima.finance@nph-demo.org', name: 'Fatima Al-Mansoor', role: 'Finance', org: 'NPH / YABA' },
  { email: 'sam.readonly@nph-demo.org', name: 'Sam Thornton', role: 'Read-only', org: 'NPH / YABA' },
  { email: 'aisha.company@steelpeak-demo.co.uk', name: 'Aisha Begum', role: 'Company Admin', org: 'SteelPeak Ltd' },
  { email: 'james.member@steelpeak-demo.co.uk', name: 'James Fletcher', role: 'Member', org: 'SteelPeak Ltd' },
  { email: 'li.delegate@orbit-demo.com', name: 'Li Wei Chen', role: 'Member / Delegate', org: 'Orbit Exports' },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUserByEmail, setActiveTab } = useData();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50">
      <div className="bg-cream border border-line w-full sm:max-w-lg sm:rounded-lg max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Switch persona</h2>
            <p className="text-xs text-muted mt-0.5">Menus and permissions update immediately.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-paper" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {PERSONAS.map((p) => {
            const selected = currentUser.email === p.email;
            return (
              <button
                key={p.email}
                type="button"
                onClick={() => {
                  setCurrentUserByEmail(p.email);
                  setActiveTab('dashboard');
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-md ${selected ? 'bg-ink text-cream' : 'hover:bg-paper'}`}
              >
                <span className="block text-sm font-semibold">{p.name}</span>
                <span className={`block text-xs ${selected ? 'text-[#c5cdd6]' : 'text-muted'}`}>
                  {p.role} · {p.org}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
