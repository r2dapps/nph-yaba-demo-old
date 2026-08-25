import React from 'react';

export const StatusPill: React.FC<{
  tone?: 'neutral' | 'ok' | 'warn' | 'alert' | 'brass';
  children: React.ReactNode;
}> = ({ tone = 'neutral', children }) => {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-50 text-ok border-emerald-200'
      : tone === 'warn'
        ? 'bg-amber-50 text-warn border-amber-200'
        : tone === 'alert'
          ? 'bg-rose-50 text-alert border-rose-200'
          : tone === 'brass'
            ? 'bg-[#f4ead3] text-brass-dark border-[#e2d2a8]'
            : 'bg-cream text-muted border-line';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {children}
    </span>
  );
};

export const PageHeader: React.FC<{
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}> = ({ kicker, title, description, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
    <div className="min-w-0">
      {kicker && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brass-dark mb-1">{kicker}</p>
      )}
      <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-ink leading-tight">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-muted max-w-2xl leading-relaxed">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
  </div>
);

export const Panel: React.FC<{
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, action, children, className = '' }) => (
  <section className={`bg-cream border border-line rounded-lg overflow-hidden ${className}`}>
    {title && (
      <header className="px-5 py-3.5 border-b border-line flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        {action}
      </header>
    )}
    <div className={title ? '' : 'p-5'}>{title ? children : <div className="p-5">{children}</div>}</div>
  </section>
);

export const Btn: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}> = ({ variant = 'secondary', children, onClick, disabled, type = 'button', className = '' }) => {
  const base =
    'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50';
  const v =
    variant === 'primary'
      ? 'bg-ink text-cream hover:bg-ink-2'
      : variant === 'danger'
        ? 'bg-alert text-white hover:bg-rose-800'
        : variant === 'ghost'
          ? 'bg-transparent text-ink hover:bg-[#efe8d9]'
          : 'bg-cream text-ink border border-line hover:bg-[#efe8d9]';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${v} ${className}`}>
      {children}
    </button>
  );
};
