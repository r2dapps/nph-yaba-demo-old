import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Organisation,
  Person,
  LocationItem,
  Membership,
  MembershipPlan,
  Registration,
  EventItem,
  EventAttendee,
  Mission,
  Delegate,
  Webinar,
  WebinarAttendee,
  Product,
  Order,
  OrderLine,
  Blog,
  NewsletterFeature,
  Introduction,
  Referral,
  Campaign,
  AutomationJourney,
  WorkflowTask,
  AuditLogItem,
  CartItem,
  hasPermission,
  Capability,
  TradeDocument,
  NewsletterCreditItem,
  BlogStatus,
} from '../types';
import {
  SEED_USERS,
  SEED_ORGANISATIONS,
  SEED_PEOPLE,
  SEED_LOCATIONS,
  SEED_MEMBERSHIPS,
  SEED_PLANS,
  SEED_REGISTRATIONS,
  SEED_EVENTS,
  SEED_EVENT_ATTENDEES,
  SEED_MISSIONS,
  SEED_DELEGATES,
  SEED_WEBINARS,
  SEED_WEBINAR_ATTENDEES,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_ORDER_LINES,
  SEED_BLOGS,
  SEED_NEWSLETTER_FEATURES,
  SEED_INTRODUCTIONS,
  SEED_REFERRALS,
  SEED_CAMPAIGNS,
  SEED_AUTOMATIONS,
  SEED_TASKS,
  SEED_AUDIT_LOGS,
  SEED_TRADE_DOCUMENTS,
} from '../data/seedData';

interface DataContextType {
  // Current user & authentication simulation
  currentUser: User;
  currentRole: UserRole;
  setCurrentUserByEmail: (email: string) => void;
  can: (capability: Capability) => boolean;

  // Active view & navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currency: 'GBP' | 'INR';
  setCurrency: (c: 'GBP' | 'INR') => void;
  formatCurrency: (amountGbp: number, amountInr?: number) => string;

  // Data sets
  users: User[];
  organisations: Organisation[];
  people: Person[];
  locations: LocationItem[];
  memberships: Membership[];
  plans: MembershipPlan[];
  registrations: Registration[];
  events: EventItem[];
  eventAttendees: EventAttendee[];
  missions: Mission[];
  delegates: Delegate[];
  webinars: Webinar[];
  webinarAttendees: WebinarAttendee[];
  products: Product[];
  orders: Order[];
  orderLines: OrderLine[];
  blogs: Blog[];
  newsletterFeatures: NewsletterFeature[];
  newsletterCredits: NewsletterCreditItem[];
  tradeDocuments: TradeDocument[];
  introductions: Introduction[];
  referrals: Referral[];
  campaigns: Campaign[];
  automations: AutomationJourney[];
  tasks: WorkflowTask[];
  auditLogs: AuditLogItem[];

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  checkoutCart: (gateway: 'Stripe' | 'Razorpay' | 'Manual' | 'Bank Transfer') => Order;
  checkout: (gateway: 'Stripe' | 'Razorpay' | 'Manual' | 'Bank Transfer') => Order;

  // Actions
  addAuditLog: (action: string, record_type: string, record_id: string, details?: string) => void;
  updateMembershipStatus: (orgId: string, status: 'Active' | 'Grace' | 'Suspended' | 'Expired') => void;
  updateOrganisation: (org: Organisation) => void;
  updatePerson: (person: Person) => void;
  approveRegistration: (id: string) => void;
  rejectRegistration: (id: string) => void;
  updateRegistrationStatus: (id: string, status: 'Approved' | 'Waitlist' | 'Rejected' | 'Submitted') => void;
  createRegistration: (reg: any) => Registration;
  createEvent: (event: Omit<EventItem, 'id' | 'registered_count' | 'waitlist_count'>) => void;
  registerForEvent: (eventId: string, personId?: string, orgId?: string) => { success: boolean; isWaitlist: boolean; message: string };
  checkInAttendee: (attendeeId: string, attended: boolean) => void;
  updatePlan: (plan: MembershipPlan) => void;
  approveIntroduction: (id: string) => void;
  declineIntroduction: (id: string) => void;
  updateIntroductionStatus: (id: string, status: 'Requested' | 'Approved' | 'Declined' | 'Completed' | 'Made') => void;
  createIntroduction: (intro: Omit<Introduction, 'id' | 'created_at' | 'status' | 'staff_owner'>) => void;
  updateReferralStage: (id: string, stage: Referral['stage']) => void;
  createReferral: (ref: Omit<Referral, 'id' | 'created_at' | 'commission_amount'>) => void;
  submitBlog: (blog: Omit<Blog, 'id' | 'views' | 'submitted_at'>) => void;
  approveBlog: (id: string) => void;
  rejectBlog: (id: string) => void;
  updateBlogStatus: (id: string, status: BlogStatus) => void;
  createBlog: (blog: any) => Blog;
  useNewsletterCredit: (creditId?: string) => void;
  toggleDocumentStatus: (docId: string) => void;
  sendCampaign: (id: string) => void;
  sendTestCampaign: (id: string, testEmail?: string) => void;
  createCampaign: (camp: Omit<Campaign, 'id' | 'sent' | 'opens' | 'clicks' | 'status'>) => void;
  toggleAutomation: (id: string) => void;
  completeTask: (id: string) => void;
  createTask: (task: Omit<WorkflowTask, 'id' | 'breached'>) => void;
  markOrderComplimentary: (id: string) => void;
  refundOrder: (id: string) => void;
  inviteTeamMember: (orgId: string, person: Omit<Person, 'id' | 'organisation_id' | 'consent_date'>) => void;
  removeTeamMember: (personId: string) => void;
  registerMissionDelegate: (missionId: string, personId: string, orgId: string, notes: string) => void;
  toggleUserMfa: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  resetAllData: () => void;
  exportSheetCSV: (sheetName: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEY = 'nph_yaba_data_store_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('usr_001'); // Nina Admin default

  const [organisations, setOrganisations] = useState<Organisation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_organisations`);
    return saved ? JSON.parse(saved) : SEED_ORGANISATIONS;
  });

  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_people`);
    return saved ? JSON.parse(saved) : SEED_PEOPLE;
  });

  const [locations, setLocations] = useState<LocationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_locations`);
    return saved ? JSON.parse(saved) : SEED_LOCATIONS;
  });

  const [memberships, setMemberships] = useState<Membership[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_memberships`);
    return saved ? JSON.parse(saved) : SEED_MEMBERSHIPS;
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : SEED_PLANS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_registrations`);
    return saved ? JSON.parse(saved) : SEED_REGISTRATIONS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : SEED_EVENTS;
  });

  const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_eventAttendees`);
    return saved ? JSON.parse(saved) : SEED_EVENT_ATTENDEES;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
    return saved ? JSON.parse(saved) : SEED_MISSIONS;
  });

  const [delegates, setDelegates] = useState<Delegate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_delegates`);
    return saved ? JSON.parse(saved) : SEED_DELEGATES;
  });

  const [webinars, setWebinars] = useState<Webinar[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_webinars`);
    return saved ? JSON.parse(saved) : SEED_WEBINARS;
  });

  const [webinarAttendees, setWebinarAttendees] = useState<WebinarAttendee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_webinarAttendees`);
    return saved ? JSON.parse(saved) : SEED_WEBINAR_ATTENDEES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [orderLines, setOrderLines] = useState<OrderLine[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orderLines`);
    return saved ? JSON.parse(saved) : SEED_ORDER_LINES;
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_blogs`);
    return saved ? JSON.parse(saved) : SEED_BLOGS;
  });

  const [newsletterFeatures, setNewsletterFeatures] = useState<NewsletterFeature[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_newsletterFeatures`);
    return saved ? JSON.parse(saved) : SEED_NEWSLETTER_FEATURES;
  });

  const [introductions, setIntroductions] = useState<Introduction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_introductions`);
    return saved ? JSON.parse(saved) : SEED_INTRODUCTIONS;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_referrals`);
    return saved ? JSON.parse(saved) : SEED_REFERRALS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : SEED_CAMPAIGNS;
  });

  const [automations, setAutomations] = useState<AutomationJourney[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_automations`);
    return saved ? JSON.parse(saved) : SEED_AUTOMATIONS;
  });

  const [tasks, setTasks] = useState<WorkflowTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
  });

  const [tradeDocuments, setTradeDocuments] = useState<TradeDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tradeDocuments`);
    return saved ? JSON.parse(saved) : SEED_TRADE_DOCUMENTS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'GBP' | 'INR'>('GBP');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_organisations`, JSON.stringify(organisations));
    localStorage.setItem(`${STORAGE_KEY}_people`, JSON.stringify(people));
    localStorage.setItem(`${STORAGE_KEY}_locations`, JSON.stringify(locations));
    localStorage.setItem(`${STORAGE_KEY}_memberships`, JSON.stringify(memberships));
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
    localStorage.setItem(`${STORAGE_KEY}_registrations`, JSON.stringify(registrations));
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
    localStorage.setItem(`${STORAGE_KEY}_eventAttendees`, JSON.stringify(eventAttendees));
    localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
    localStorage.setItem(`${STORAGE_KEY}_delegates`, JSON.stringify(delegates));
    localStorage.setItem(`${STORAGE_KEY}_webinars`, JSON.stringify(webinars));
    localStorage.setItem(`${STORAGE_KEY}_webinarAttendees`, JSON.stringify(webinarAttendees));
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY}_orderLines`, JSON.stringify(orderLines));
    localStorage.setItem(`${STORAGE_KEY}_blogs`, JSON.stringify(blogs));
    localStorage.setItem(`${STORAGE_KEY}_newsletterFeatures`, JSON.stringify(newsletterFeatures));
    localStorage.setItem(`${STORAGE_KEY}_tradeDocuments`, JSON.stringify(tradeDocuments));
    localStorage.setItem(`${STORAGE_KEY}_introductions`, JSON.stringify(introductions));
    localStorage.setItem(`${STORAGE_KEY}_referrals`, JSON.stringify(referrals));
    localStorage.setItem(`${STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
    localStorage.setItem(`${STORAGE_KEY}_automations`, JSON.stringify(automations));
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
  }, [
    users, organisations, people, locations, memberships, plans,
    registrations, events, eventAttendees, missions, delegates,
    webinars, webinarAttendees, products, orders, orderLines,
    blogs, newsletterFeatures, tradeDocuments, introductions, referrals, campaigns,
    automations, tasks, auditLogs
  ]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;

  const setCurrentUserByEmail = (email: string) => {
    const found = users.find(u => u.email === email);
    if (found) {
      setCurrentUserId(found.id);
      addAuditLog('USER_SWITCH_ROLE', 'Users', found.id, `Switched active demo user to ${found.email} (${found.role})`);
    }
  };

  const can = (capability: Capability) => {
    return hasPermission(currentRole, capability);
  };

  const formatCurrency = (amountGbp: number, amountInr?: number) => {
    if (currency === 'INR') {
      const inrVal = amountInr !== undefined ? amountInr : Math.round(amountGbp * 105);
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inrVal);
    }
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amountGbp);
  };

  const addAuditLog = (action: string, record_type: string, record_id: string, details?: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      at: new Date().toISOString(),
      user_email: currentUser.email,
      action,
      record_type,
      record_id,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Cart operations
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev => prev.map(i => (i.id === itemId ? { ...i, quantity: qty } : i)));
    }
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (gateway: 'Stripe' | 'Razorpay' | 'Manual') => {
    const totalGbp = cart.reduce((sum, item) => sum + item.unit_price_gbp * item.quantity, 0);
    const totalInr = cart.reduce((sum, item) => sum + item.unit_price_inr * item.quantity, 0);
    const total = currency === 'GBP' ? totalGbp : totalInr;
    
    const newOrderId = `ord_${Date.now().toString().slice(-4)}`;
    const invoiceNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const userPerson = people.find(p => p.email === currentUser.email) || people[0];
    const userOrg = organisations.find(o => o.id === currentUser.organisation_id) || organisations[0];

    const newOrder: Order = {
      id: newOrderId,
      buyer_person_id: userPerson.id,
      buyer_name: `${userPerson.first_name} ${userPerson.last_name}`,
      organisation_id: userOrg.id,
      organisation_name: userOrg.name,
      items_summary: cart.map(c => `${c.title} (x${c.quantity})`).join(', '),
      currency,
      total,
      status: 'Paid',
      gateway,
      created_at: new Date().toISOString(),
      invoice_number: invoiceNum,
    };

    const newLines: OrderLine[] = cart.map((c, idx) => ({
      id: `ol_${Date.now()}_${idx}`,
      order_id: newOrderId,
      product_id: c.id,
      product_name: c.title,
      qty: c.quantity,
      unit_price: currency === 'GBP' ? c.unit_price_gbp : c.unit_price_inr,
      currency,
    }));

    setOrders(prev => [newOrder, ...prev]);
    setOrderLines(prev => [...prev, ...newLines]);
    addAuditLog('CHECKOUT_COMPLETED', 'Orders', newOrderId, `Processed ${currency} ${total} checkout for ${cart.length} item(s) via ${gateway}`);
    clearCart();
    return newOrder;
  };

  // Membership & Org actions
  const updateMembershipStatus = (orgId: string, status: 'Active' | 'Grace' | 'Suspended' | 'Expired') => {
    setMemberships(prev =>
      prev.map(m => (m.organisation_id === orgId ? { ...m, status } : m))
    );
    setOrganisations(prev =>
      prev.map(o => (o.id === orgId ? { ...o, status } : o))
    );
    addAuditLog('UPDATE_MEMBERSHIP_STATUS', 'Memberships', orgId, `Updated status to ${status}`);

    if (status === 'Grace') {
      createTask({
        type: 'Failed payment',
        related_id: orgId,
        title: `Collect overdue payment: ${organisations.find(o => o.id === orgId)?.name || 'Organisation'}`,
        assignee_role: 'Finance',
        due_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        status: 'Pending',
        sla_hours: 48,
      });
    }
  };

  const updateOrganisation = (org: Organisation) => {
    setOrganisations(prev => prev.map(o => (o.id === org.id ? org : o)));
    addAuditLog('UPDATE_ORGANISATION', 'Organisations', org.id, `Updated record for ${org.name}`);
  };

  const updatePerson = (person: Person) => {
    setPeople(prev => prev.map(p => (p.id === person.id ? person : p)));
    addAuditLog('UPDATE_PERSON', 'People', person.id, `Updated profile for ${person.first_name} ${person.last_name}`);
  };

  const approveRegistration = (id: string) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    setRegistrations(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              decided_at: new Date().toISOString(),
              decided_by: currentUser.email,
            }
          : r
      )
    );

    if (reg.type === 'Membership') {
      const applicant = people.find(p => p.id === reg.applicant_person_id);
      if (applicant) {
        setOrganisations(prev =>
          prev.map(o => (o.id === applicant.organisation_id ? { ...o, status: 'Active' } : o))
        );
      }
    }

    addAuditLog('APPROVE_REGISTRATION', 'Registrations', id, `Approved ${reg.type} registration for ${reg.applicant_name}`);
  };

  const rejectRegistration = (id: string) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    setRegistrations(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              decided_at: new Date().toISOString(),
              decided_by: currentUser.email,
            }
          : r
      )
    );
    addAuditLog('REJECT_REGISTRATION', 'Registrations', id, `Rejected ${reg.type} registration for ${reg.applicant_name}`);
  };

  const updateRegistrationStatus = (id: string, status: 'Approved' | 'Waitlist' | 'Rejected' | 'Submitted') => {
    if (status === 'Approved') {
      approveRegistration(id);
    } else if (status === 'Rejected') {
      rejectRegistration(id);
    } else {
      setRegistrations(prev =>
        prev.map(r =>
          r.id === id
            ? {
                ...r,
                status,
                decided_at: new Date().toISOString(),
                decided_by: currentUser.email,
              }
            : r
        )
      );
      addAuditLog('UPDATE_REGISTRATION_STATUS', 'Registrations', id, `Updated status to ${status}`);
    }
  };

  const createRegistration = (regData: any): Registration => {
    const newId = `reg_${Date.now().toString().slice(-4)}`;
    const newReg: Registration = {
      id: newId,
      type: regData.type || 'Event',
      related_id: regData.item_id || regData.related_id || 'item_unknown',
      related_title: regData.item_title || regData.related_title,
      applicant_person_id: regData.person_id || regData.applicant_person_id || 'per_007',
      applicant_name: regData.person_name || regData.applicant_name || currentUser.full_name,
      applicant_org: regData.organisation_name || regData.applicant_org || 'SteelPeak Ltd',
      status: 'Submitted',
      submitted_at: new Date().toISOString(),
      notes: regData.notes,
    };
    setRegistrations(prev => [newReg, ...prev]);
    addAuditLog('CREATE_REGISTRATION', 'Registrations', newId, `Submitted registration for ${newReg.related_title || newReg.type}`);
    return newReg;
  };

  const createEvent = (eventData: Omit<EventItem, 'id' | 'registered_count' | 'waitlist_count'>) => {
    const newId = `evt_${Date.now().toString().slice(-4)}`;
    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      registered_count: 0,
      waitlist_count: 0,
    };
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('CREATE_EVENT', 'Events', newId, `Created new event: ${newEvent.title}`);
  };

  const registerForEvent = (eventId: string, personId?: string, orgId?: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, isWaitlist: false, message: 'Event not found' };

    const pId = personId || (people.find(p => p.email === currentUser.email)?.id || 'per_007');
    const targetPerson = people.find(p => p.id === pId);
    const oId = orgId || targetPerson?.organisation_id || currentUser.organisation_id;
    const targetOrg = organisations.find(o => o.id === oId);

    const isFull = targetEvent.registered_count >= targetEvent.capacity;
    const attendeeStatus = isFull ? 'Waitlist' : 'Approved';

    const newAttendee: EventAttendee = {
      id: `att_${Date.now()}`,
      event_id: eventId,
      person_id: pId,
      person_name: targetPerson ? `${targetPerson.first_name} ${targetPerson.last_name}` : currentUser.full_name,
      person_email: targetPerson?.email || currentUser.email,
      organisation_id: oId,
      organisation_name: targetOrg?.name || 'Organisation',
      status: attendeeStatus,
      paid: !targetEvent.is_paid,
      registered_at: new Date().toISOString(),
    };

    setEventAttendees(prev => [newAttendee, ...prev]);

    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              registered_count: isFull ? e.registered_count : e.registered_count + 1,
              waitlist_count: isFull ? e.waitlist_count + 1 : e.waitlist_count,
            }
          : e
      )
    );

    addAuditLog('EVENT_REGISTRATION', 'EventAttendees', newAttendee.id, `${newAttendee.person_name} registered for ${targetEvent.title} (${attendeeStatus})`);

    return {
      success: true,
      isWaitlist: isFull,
      message: isFull
        ? `Event is at capacity (${targetEvent.capacity}/${targetEvent.capacity}). You have been placed on the VIP Waitlist.`
        : `Registration confirmed for ${targetEvent.title}!`,
    };
  };

  const checkInAttendee = (attendeeId: string, attended: boolean) => {
    setEventAttendees(prev =>
      prev.map(a => (a.id === attendeeId ? { ...a, status: attended ? 'Attended' : 'Registered' } : a))
    );
  };

  const updatePlan = (plan: MembershipPlan) => {
    setPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
    addAuditLog('UPDATE_MEMBERSHIP_PLAN', 'MembershipPlans', plan.id, `Updated plan ${plan.name} (£${plan.price_gbp} / ₹${plan.price_inr})`);
  };

  const updateIntroductionStatus = (id: string, status: 'Requested' | 'Approved' | 'Declined' | 'Completed' | 'Made') => {
    setIntroductions(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              status: status === 'Completed' ? 'Made' : status,
              staff_owner: currentUser.email,
            }
          : i
      )
    );
    addAuditLog('UPDATE_INTRO_STATUS', 'Introductions', id, `Updated matchmaking intro status to ${status}`);
  };

  const approveIntroduction = (id: string) => {
    setIntroductions(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: 'Approved', staff_owner: currentUser.email } : i
      )
    );
    addAuditLog('APPROVE_INTRODUCTION', 'Introductions', id, 'Approved matchmaking introduction request.');
  };

  const declineIntroduction = (id: string) => {
    setIntroductions(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: 'Declined', staff_owner: currentUser.email } : i
      )
    );
    addAuditLog('DECLINE_INTRODUCTION', 'Introductions', id, 'Declined bilateral introduction.');
  };

  const createIntroduction = (introData: Omit<Introduction, 'id' | 'created_at' | 'status' | 'staff_owner'>) => {
    const newId = `intro_${Date.now()}`;
    const newIntro: Introduction = {
      ...introData,
      id: newId,
      status: 'Requested',
      staff_owner: 'raj.membership@nph-demo.org',
      created_at: new Date().toISOString(),
    };
    setIntroductions(prev => [newIntro, ...prev]);
    addAuditLog('REQUEST_INTRODUCTION', 'Introductions', newId, `Introduction requested to ${introData.to_org_or_person}`);

    createTask({
      type: 'Approve intro',
      related_id: newId,
      title: `Review Matchmaking Intro: ${introData.from_person_name} → ${introData.to_org_or_person}`,
      assignee_role: 'Membership Manager',
      due_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      status: 'Pending',
      sla_hours: 24,
    });
  };

  const updateReferralStage = (id: string, stage: Referral['stage']) => {
    setReferrals(prev =>
      prev.map(r => (r.id === id ? { ...r, stage } : r))
    );
    addAuditLog('UPDATE_REFERRAL_STAGE', 'Referrals', id, `Moved referral stage to ${stage}`);
  };

  const createReferral = (refData: Omit<Referral, 'id' | 'created_at' | 'commission_amount'>) => {
    const newId = `ref_${Date.now()}`;
    const commAmount = (refData.value_gbp * refData.commission_percent) / 100;
    const newRef: Referral = {
      ...refData,
      id: newId,
      commission_amount: commAmount,
      created_at: new Date().toISOString(),
    };
    setReferrals(prev => [newRef, ...prev]);
    addAuditLog('CREATE_REFERRAL', 'Referrals', newId, `Created referral deal: ${refData.deal_title} (£${refData.value_gbp})`);
  };

  const submitBlog = (blogData: Omit<Blog, 'id' | 'views' | 'submitted_at'>) => {
    const newId = `blg_${Date.now()}`;
    const newBlog: Blog = {
      ...blogData,
      id: newId,
      views: 0,
      submitted_at: new Date().toISOString(),
    };
    setBlogs(prev => [newBlog, ...prev]);
    addAuditLog('SUBMIT_BLOG', 'Blogs', newId, `Submitted blog: ${blogData.title}`);

    createTask({
      type: 'Approve blog',
      related_id: newId,
      title: `Editorial Review: "${blogData.title}" by ${blogData.author_name}`,
      assignee_role: 'Marketing Manager',
      due_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      status: 'Pending',
      sla_hours: 12,
    });
  };

  const createBlog = (blogData: any): Blog => {
    const newId = `blg_${Date.now().toString().slice(-4)}`;
    const newBlog: Blog = {
      id: newId,
      organisation_id: blogData.organisation_id || currentUser.organisation_id || 'org_steelpeak',
      organisation_name: blogData.organisation_name || 'SteelPeak Ltd',
      author_name: blogData.author_name || currentUser.full_name,
      title: blogData.title,
      summary: blogData.content || blogData.summary || '',
      status: blogData.status || 'Submitted',
      package: blogData.package || 'Standard Member',
      views: blogData.views || blogData.views_count || 0,
      paid: false,
      submitted_at: new Date().toISOString(),
    };
    setBlogs(prev => [newBlog, ...prev]);
    addAuditLog('SUBMIT_BLOG', 'Blogs', newId, `Submitted article: ${newBlog.title}`);
    return newBlog;
  };

  const approveBlog = (id: string) => {
    setBlogs(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Published' } : b))
    );
    addAuditLog('APPROVE_BLOG', 'Blogs', id, 'Approved and published thought leadership blog.');
  };

  const rejectBlog = (id: string) => {
    setBlogs(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Rejected' } : b))
    );
    addAuditLog('REJECT_BLOG', 'Blogs', id, 'Rejected blog submission.');
  };

  const updateBlogStatus = (id: string, status: BlogStatus) => {
    if (status === 'Approved' || status === 'Published') {
      approveBlog(id);
    } else if (status === 'Rejected') {
      rejectBlog(id);
    } else {
      setBlogs(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
      addAuditLog('UPDATE_BLOG_STATUS', 'Blogs', id, `Updated blog status to ${status}`);
    }
  };

  const useNewsletterCredit = (creditId?: string) => {
    setNewsletterFeatures(prev =>
      prev.map(f => {
        if (!creditId || f.id === creditId) {
          return {
            ...f,
            credits_used: f.credits_used + 1,
            last_submission_status: 'Pending Review',
            last_used_date: new Date().toISOString().split('T')[0],
          };
        }
        return f;
      })
    );
    addAuditLog('USE_NEWSLETTER_CREDIT', 'NewsletterFeatures', creditId || 'all', 'Used 1 newsletter spotlight credit');
  };

  const toggleDocumentStatus = (docId: string) => {
    setTradeDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          const nextUploaded = !doc.uploaded;
          return {
            ...doc,
            uploaded: nextUploaded,
            file_name: nextUploaded ? `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf` : undefined,
            uploaded_at: nextUploaded ? new Date().toISOString() : undefined,
          };
        }
        return doc;
      })
    );
    addAuditLog('DOC_STATUS_TOGGLE', 'TradeDocument', docId, 'Updated trade compliance document upload status');
  };

  const sendCampaign = (id: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Sent',
              sent: 1850,
              opens: 820,
              clicks: 345,
            }
          : c
      )
    );
    addAuditLog('DISPATCH_CAMPAIGN', 'Campaigns', id, 'Dispatched email broadcast campaign.');
  };

  const sendTestCampaign = (id: string, testEmail?: string) => {
    sendCampaign(id);
  };

  const createCampaign = (campData: Omit<Campaign, 'id' | 'sent' | 'opens' | 'clicks' | 'status'>) => {
    const newId = `cmp_${Date.now()}`;
    const newCamp: Campaign = {
      ...campData,
      id: newId,
      status: 'Scheduled',
      sent: 0,
      opens: 0,
      clicks: 0,
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('CREATE_CAMPAIGN', 'Campaigns', newId, `Scheduled campaign: ${newCamp.name}`);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
    addAuditLog('TOGGLE_AUTOMATION', 'Automations', id, 'Toggled automation journey state.');
  };

  const completeTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'Completed' } : t))
    );
    addAuditLog('COMPLETE_TASK', 'WorkflowTasks', id, 'Marked workflow SLA task completed.');
  };

  const createTask = (taskData: Omit<WorkflowTask, 'id' | 'breached'>) => {
    const newId = `tsk_${Date.now()}`;
    const newTask: WorkflowTask = {
      ...taskData,
      id: newId,
      breached: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const markOrderComplimentary = (id: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'Complimentary' } : o))
    );
    addAuditLog('MARK_ORDER_COMPLIMENTARY', 'Orders', id, 'Marked invoice as complimentary sponsor pass.');
  };

  const refundOrder = (id: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'Refunded' } : o))
    );
    addAuditLog('REFUND_ORDER', 'Orders', id, 'Executed mock refund for order.');
  };

  const inviteTeamMember = (orgId: string, personData: Omit<Person, 'id' | 'organisation_id' | 'consent_date'>) => {
    const newId = `per_${Date.now()}`;
    const newPerson: Person = {
      ...personData,
      id: newId,
      organisation_id: orgId,
      consent_date: new Date().toISOString(),
    };
    setPeople(prev => [...prev, newPerson]);

    // Update seat used count in membership
    setMemberships(prev =>
      prev.map(m => (m.organisation_id === orgId ? { ...m, seats_used: (m.seats_used || 0) + 1 } : m))
    );

    addAuditLog('INVITE_TEAM_MEMBER', 'People', newId, `Added team member ${newPerson.first_name} ${newPerson.last_name}`);
  };

  const removeTeamMember = (personId: string) => {
    const p = people.find(person => person.id === personId);
    if (!p) return;
    setPeople(prev => prev.filter(person => person.id !== personId));
    setMemberships(prev =>
      prev.map(m =>
        m.organisation_id === p.organisation_id
          ? { ...m, seats_used: Math.max(0, (m.seats_used || 1) - 1) }
          : m
      )
    );
    addAuditLog('REMOVE_TEAM_MEMBER', 'People', personId, `Removed team seat for ${p.first_name} ${p.last_name}`);
  };

  const registerMissionDelegate = (missionId: string, personId: string, orgId: string, notes: string) => {
    const targetMission = missions.find(m => m.id === missionId);
    const targetPerson = people.find(p => p.id === personId);
    const targetOrg = organisations.find(o => o.id === orgId);

    const newDel: Delegate = {
      id: `del_${Date.now()}`,
      mission_id: missionId,
      person_id: personId,
      person_name: targetPerson ? `${targetPerson.first_name} ${targetPerson.last_name}` : 'Delegate',
      person_email: targetPerson?.email,
      organisation_id: orgId,
      organisation_name: targetOrg?.name,
      reg_status: 'Confirmed',
      payment_status: 'Deposit Paid',
      travel_notes: notes,
      sector: targetOrg?.sector || 'Trade',
      export_interests: targetPerson?.export_interests.join(', ') || 'Bilateral Trade',
      attendance: 'Confirmed',
      passport_verified: true,
      visa_issued: false,
    };

    setDelegates(prev => [newDel, ...prev]);
    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, delegates_count: (m.delegates_count || 0) + 1 } : m))
    );
    addAuditLog('MISSION_DELEGATE_REGISTERED', 'Delegates', newDel.id, `Registered ${newDel.person_name} for ${targetMission?.title}`);
  };

  const toggleUserMfa = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, mfa_enabled: !u.mfa_enabled } : u))
    );
    addAuditLog('TOGGLE_MFA', 'Users', userId, 'Toggled user MFA security status.');
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addAuditLog('UPDATE_USER_ROLE', 'Users', userId, `Updated role to ${newRole}`);
  };

  const newsletterCredits: NewsletterCreditItem[] = newsletterFeatures.map(f => ({
    ...f,
    credits_remaining: Math.max(0, f.credits_bought - f.credits_used),
  }));

  const resetAllData = () => {
    localStorage.clear();
    setUsers(SEED_USERS);
    setOrganisations(SEED_ORGANISATIONS);
    setPeople(SEED_PEOPLE);
    setLocations(SEED_LOCATIONS);
    setMemberships(SEED_MEMBERSHIPS);
    setPlans(SEED_PLANS);
    setRegistrations(SEED_REGISTRATIONS);
    setEvents(SEED_EVENTS);
    setEventAttendees(SEED_EVENT_ATTENDEES);
    setMissions(SEED_MISSIONS);
    setDelegates(SEED_DELEGATES);
    setWebinars(SEED_WEBINARS);
    setWebinarAttendees(SEED_WEBINAR_ATTENDEES);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setOrderLines(SEED_ORDER_LINES);
    setBlogs(SEED_BLOGS);
    setNewsletterFeatures(SEED_NEWSLETTER_FEATURES);
    setTradeDocuments(SEED_TRADE_DOCUMENTS);
    setIntroductions(SEED_INTRODUCTIONS);
    setReferrals(SEED_REFERRALS);
    setCampaigns(SEED_CAMPAIGNS);
    setAutomations(SEED_AUTOMATIONS);
    setTasks(SEED_TASKS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setCart([]);
    addAuditLog('DATABASE_RESET', 'System', 'ALL', 'Reset all 24 sheets to fresh seed state.');
  };

  const exportSheetCSV = (sheetName: string) => {
    let rows: any[] = [];
    switch (sheetName) {
      case 'Users': rows = users; break;
      case 'Organisations': rows = organisations; break;
      case 'People': rows = people; break;
      case 'Memberships': rows = memberships; break;
      case 'MembershipPlans': rows = plans; break;
      case 'Events': rows = events; break;
      case 'EventAttendees': rows = eventAttendees; break;
      case 'Missions': rows = missions; break;
      case 'Delegates': rows = delegates; break;
      case 'Webinars': rows = webinars; break;
      case 'Products': rows = products; break;
      case 'Orders': rows = orders; break;
      case 'Blogs': rows = blogs; break;
      case 'NewsletterCredits': rows = newsletterCredits; break;
      case 'TradeDocuments': rows = tradeDocuments; break;
      case 'Introductions': rows = introductions; break;
      case 'Referrals': rows = referrals; break;
      case 'Campaigns': rows = campaigns; break;
      case 'WorkflowTasks': rows = tasks; break;
      case 'AuditLog': rows = auditLogs; break;
      default: rows = organisations;
    }

    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rows.map(row =>
          headers
            .map(h => {
              const val = row[h];
              if (Array.isArray(val)) return `"${val.join('; ')}"`;
              if (typeof val === 'string' && (val.includes(',') || val.includes('\n') || val.includes('"'))) {
                return `"${val.replace(/"/g, '""')}"`;
              }
              return val ?? '';
            })
            .join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NPH_YABA_${sheetName}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentUserByEmail,
        can,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        currency,
        setCurrency,
        formatCurrency,
        users,
        organisations,
        people,
        locations,
        memberships,
        plans,
        registrations,
        events,
        eventAttendees,
        missions,
        delegates,
        webinars,
        webinarAttendees,
        products,
        orders,
        orderLines,
        blogs,
        newsletterFeatures,
        newsletterCredits,
        tradeDocuments,
        introductions,
        referrals,
        campaigns,
        automations,
        tasks,
        auditLogs,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        updateCartQuantity: updateCartQty,
        clearCart,
        checkoutCart,
        checkout: checkoutCart,
        addAuditLog,
        updateMembershipStatus,
        updateOrganisation,
        updatePerson,
        approveRegistration,
        rejectRegistration,
        updateRegistrationStatus,
        createRegistration,
        createEvent,
        registerForEvent,
        checkInAttendee,
        updatePlan,
        approveIntroduction,
        declineIntroduction,
        updateIntroductionStatus,
        createIntroduction,
        updateReferralStage,
        createReferral,
        submitBlog,
        approveBlog,
        rejectBlog,
        updateBlogStatus,
        createBlog,
        useNewsletterCredit,
        toggleDocumentStatus,
        sendCampaign,
        sendTestCampaign,
        createCampaign,
        toggleAutomation,
        completeTask,
        createTask,
        markOrderComplimentary,
        refundOrder,
        inviteTeamMember,
        removeTeamMember,
        registerMissionDelegate,
        toggleUserMfa,
        updateUserRole,
        resetAllData,
        exportSheetCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
