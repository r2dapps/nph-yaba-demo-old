import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Tags,
  Check,
  Edit2,
  Plus,
  Shield,
  CreditCard,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react';
import { MembershipPlan } from '../../types';

export const PlansPricingScreen: React.FC<{
  onSelectPlanForCheckout?: (plan: MembershipPlan) => void;
}> = ({ onSelectPlanForCheckout }) => {
  const { currentRole, can, plans, updatePlan, addToCart, formatCurrency, setActiveTab } = useData();

  const canEditPlans = can('edit_plans_pricing');

  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState<MembershipPlan | null>(null);

  const handleStartEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updatePlan(formData);
      setEditingPlan(null);
      setFormData(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Membership Plans & Pricing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Multi-Currency: £ GBP & ₹ INR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Annual and monthly tiers for UK exporters, Indian conglomerates, and bilateral fellows.
          </p>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border bg-white  p-6 flex flex-col justify-between relative transition-all ${
              plan.popular
                ? 'border-amber-500 ring-2 ring-amber-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 ">
                Most Popular for UK Exporters
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{plan.billing} Billing</p>
                </div>
                {canEditPlans && (
                  <button
                    onClick={() => handleStartEdit(plan)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit Plan & Pricing"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Price Block */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-slate-900">
                    {formatCurrency(plan.price_gbp, plan.price_inr)}
                  </span>
                  <span className="text-xs text-slate-500">/ {plan.billing.toLowerCase()}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Includes <strong>{plan.seats} team seat(s)</strong> with individual portal logins.
                </p>
              </div>

              {/* Benefits list */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Benefits
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {plan.benefits_text.split(',').map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  addToCart({
                    id: plan.id,
                    title: `${plan.name} (${plan.billing})`,
                    type: 'Membership',
                    unit_price_gbp: plan.price_gbp,
                    unit_price_inr: plan.price_inr,
                    quantity: 1,
                    billing_type: plan.billing as 'Monthly' | 'Annual',
                  });
                  setActiveTab('shop');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all  flex items-center justify-center gap-1.5 ${
                  plan.popular
                    ? 'bg-ink text-cream hover:bg-ink-2 font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Select Plan & Upgrade
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal (Staff only) */}
      {editingPlan && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-lg  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-600" />
                Edit Plan: {editingPlan.name}
              </h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (£ GBP)</label>
                  <input
                    type="number"
                    value={formData.price_gbp}
                    onChange={(e) =>
                      setFormData({ ...formData, price_gbp: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={formData.price_inr}
                    onChange={(e) =>
                      setFormData({ ...formData, price_inr: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Team Seats</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Billing Cycle</label>
                  <select
                    value={formData.billing}
                    onChange={(e) =>
                      setFormData({ ...formData, billing: e.target.value as 'Monthly' | 'Annual' })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Benefits Text (comma-separated)
                </label>
                <textarea
                  value={formData.benefits_text}
                  onChange={(e) => setFormData({ ...formData, benefits_text: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
