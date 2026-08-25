import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  UserCheck,
  Building2,
  Lock,
  Tag,
  Share2,
} from 'lucide-react';
import { EventItem } from '../../types';

export const EventsScreen: React.FC<{
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenPersonDetail }) => {
  const {
    currentUser,
    currentRole,
    can,
    events,
    registrations,
    createRegistration,
    createEvent,
    formatCurrency,
    addToCart,
    setActiveTab,
  } = useData();

  const [selectedEventGuests, setSelectedEventGuests] = useState<EventItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCapacity, setNewCapacity] = useState(60);
  const [newPriceGbp, setNewPriceGbp] = useState(0);
  const [newPriceInr, setNewPriceInr] = useState(0);
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newDescription, setNewDescription] = useState('');

  const canCreateEvents = can('create_events_missions');

  const handleRegisterSelf = (evt: EventItem) => {
    // Check if free or paid
    if (evt.price_gbp > 0) {
      addToCart({
        id: evt.id,
        title: `Delegate Pass: ${evt.title}`,
        type: 'Event',
        unit_price_gbp: evt.price_gbp,
        unit_price_inr: evt.price_inr,
        quantity: 1,
      });
      setActiveTab('shop');
    } else {
      createRegistration({
        type: 'Event',
        item_id: evt.id,
        item_title: evt.title,
        person_id: 'per_007',
        person_name: currentUser.full_name,
        organisation_id: currentUser.organisation_id || 'org_002',
        organisation_name: 'SteelPeak Ltd',
      });
      alert(`Registration submitted for "${evt.title}". Confirmation email dispatched.`);
    }
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    createEvent({
      title: newTitle,
      date_time: `${newDate}T10:00:00Z`,
      location: newLocation || 'Chamber Headquarters, Leeds',
      capacity: newCapacity,
      registered_count: 0,
      price_gbp: newPriceGbp,
      price_inr: newPriceInr,
      description: newDescription || 'Exclusive bilateral roundtable and networking summit.',
      status: 'Upcoming',
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Events & Bilateral Roundtables
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {events.length} Roundtables & Summits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive networking, government minister dialogues, and sector-specific roundtables across the UK and India.
          </p>
        </div>

        {canCreateEvents && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-ink text-cream hover:bg-ink-2 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Roundtable Event
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => {
          const isSoldOut = evt.registered_count >= evt.capacity;
          const pct = Math.min(100, Math.round((evt.registered_count / evt.capacity) * 100));

          return (
            <div
              key={evt.id}
              className="bg-cream border border-line rounded-lg p-6  hover: transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                    {evt.status}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {evt.price_gbp === 0
                        ? 'Complimentary / Included'
                        : formatCurrency(evt.price_gbp, evt.price_inr)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(evt.date_time).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    <span>·</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.location}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {evt.description}
                </p>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Attendance Capacity
                    </span>
                    <span className={isSoldOut ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                      {evt.registered_count} / {evt.capacity} seats filled ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isSoldOut
                          ? 'bg-rose-500'
                          : pct > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedEventGuests(evt)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  View Guest List ({evt.registered_count})
                </button>

                <button
                  onClick={() => handleRegisterSelf(evt)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all  flex items-center gap-1.5 ${
                    isSoldOut
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-ink text-cream hover:bg-ink-2'
                  }`}
                >
                  {isSoldOut ? 'Join Waitlist' : 'Register Delegate'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guest List Modal */}
      {selectedEventGuests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-lg  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmed Delegates & Guests
                </h3>
                <p className="text-xs text-slate-500">{selectedEventGuests.title}</p>
              </div>
              <button
                onClick={() => setSelectedEventGuests(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {[
                { name: 'Aisha Begum', org: 'SteelPeak Ltd', role: 'Managing Director', status: 'Confirmed' },
                { name: 'James Fletcher', org: 'SteelPeak Ltd', role: 'Head of Supply Chain', status: 'Confirmed' },
                { name: 'Li Wei Chen', org: 'Orbit Exports', role: 'VP Operations', status: 'Confirmed' },
                { name: 'Dr. Alistair Finch', org: 'Northern CleanTech Consortium', role: 'CEO', status: 'Confirmed' },
                { name: 'Meera Rao', org: 'Bharat Forge & Robotics', role: 'Chief Strategy Officer', status: 'Confirmed' },
              ].map((guest, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{guest.name}</p>
                    <p className="text-[11px] text-slate-500">{guest.role} · {guest.org}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {guest.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEventGuests(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-lg  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Create New Roundtable / Summit
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. UK-India Advanced Manufacturing & Robotics Summit"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                    placeholder="e.g. Lowry Centre, Salford Quays, Manchester"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (£ GBP)</label>
                  <input
                    type="number"
                    value={newPriceGbp}
                    onChange={(e) => setNewPriceGbp(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={newPriceInr}
                    onChange={(e) => setNewPriceInr(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Description & Agenda</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  placeholder="Outline key ministers in attendance, B2B matchmaking tracks, and roundtable themes..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Publish Roundtable Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
