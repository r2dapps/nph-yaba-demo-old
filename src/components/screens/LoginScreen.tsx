import React from 'react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';

const PERSONAS: {
  email: string;
  name: string;
  role: UserRole;
  org: string;
  desc: string;
  side: 'chamber' | 'member';
}[] = [
  {
    email: 'nina.admin@nph-demo.org',
    name: 'Nina Campbell',
    role: 'Super Admin',
    org: 'NPH / YABA',
    desc: 'Full access: security, pricing, members and missions.',
    side: 'chamber',
  },
  {
    email: 'raj.membership@nph-demo.org',
    name: 'Rajiv Patel',
    role: 'Membership Manager',
    org: 'NPH / YABA',
    desc: 'Approvals, CRM, introductions and membership plans.',
    side: 'chamber',
  },
  {
    email: 'priya.marketing@nph-demo.org',
    name: 'Priya Sharma',
    role: 'Marketing Manager',
    org: 'NPH / YABA',
    desc: 'Campaigns, blogs, newsletter credits and journeys.',
    side: 'chamber',
  },
  {
    email: 'owen.events@nph-demo.org',
    name: 'Owen Davies',
    role: 'Events Manager',
    org: 'NPH / YABA',
    desc: 'Roundtables, trade missions and webinars.',
    side: 'chamber',
  },
  {
    email: 'fatima.finance@nph-demo.org',
    name: 'Fatima Al-Mansoor',
    role: 'Finance',
    org: 'NPH / YABA',
    desc: 'Invoices, refunds and referral commission.',
    side: 'chamber',
  },
  {
    email: 'sam.readonly@nph-demo.org',
    name: 'Sam Thornton',
    role: 'Read-only',
    org: 'NPH / YABA',
    desc: 'Dashboards and reports only.',
    side: 'chamber',
  },
  {
    email: 'aisha.company@steelpeak-demo.co.uk',
    name: 'Aisha Begum',
    role: 'Company Admin',
    org: 'SteelPeak Ltd',
    desc: 'Company profile, seats and billing. No staff notes.',
    side: 'member',
  },
  {
    email: 'james.member@steelpeak-demo.co.uk',
    name: 'James Fletcher',
    role: 'Member',
    org: 'SteelPeak Ltd',
    desc: 'Directory, events, shop and introduction requests.',
    side: 'member',
  },
  {
    email: 'li.delegate@orbit-demo.com',
    name: 'Li Wei Chen',
    role: 'Member / Delegate',
    org: 'Orbit Exports',
    desc: 'Confirmed delegate for the Clean Tech mission.',
    side: 'member',
  },
];

export const LoginScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { setCurrentUserByEmail, setActiveTab } = useData();

  const enter = (email: string) => {
    setCurrentUserByEmail(email);
    setActiveTab('dashboard');
    onEnter();
  };

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-12">
      <aside className="lg:col-span-5 bg-ink text-cream px-8 py-10 lg:px-12 lg:py-16 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">United Kingdom · India</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-4 leading-[1.12]">
            NPH / YABA
          </h1>
          <p className="mt-3 text-lg text-[#c5cdd6] max-w-md leading-relaxed">
            Membership, trade missions and introductions for Northern businesses and Indian partners.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-[#c5cdd6]">
            <li className="border-l border-brass pl-4">Nine roles, with staff notes hidden from members</li>
            <li className="border-l border-brass pl-4">Sterling and rupee pricing on one checkout</li>
            <li className="border-l border-brass pl-4">Sample data only — payments are not live</li>
          </ul>
        </div>
        <p className="mt-12 text-xs text-[#8b97a3]">Demonstration environment. Not connected to production records.</p>
      </aside>

      <section className="lg:col-span-7 px-6 py-10 lg:px-12 lg:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-dark">Choose a persona</p>
        <h2 className="font-display text-2xl font-semibold text-ink mt-1">Sign in to the portal</h2>
        <p className="text-sm text-muted mt-2 mb-8 max-w-lg">
          Each card is a real permission set. Switch later from the header if you need to show another role.
        </p>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Chamber staff</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PERSONAS.filter((p) => p.side === 'chamber').map((p) => (
              <button
                key={p.email}
                onClick={() => enter(p.email)}
                className="text-left bg-cream border border-line rounded-lg p-4 hover:border-ink transition-colors"
              >
                <p className="text-[11px] font-semibold text-brass-dark">{p.role}</p>
                <p className="font-semibold text-ink mt-1">{p.name}</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Member organisations</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PERSONAS.filter((p) => p.side === 'member').map((p) => (
              <button
                key={p.email}
                onClick={() => enter(p.email)}
                className="text-left bg-cream border border-line rounded-lg p-4 hover:border-ink transition-colors"
              >
                <p className="text-[11px] font-semibold text-brass-dark">{p.role}</p>
                <p className="font-semibold text-ink mt-1">{p.name}</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
