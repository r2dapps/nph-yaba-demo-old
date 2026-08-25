export type UserRole =
  | 'Super Admin'
  | 'Membership Manager'
  | 'Marketing Manager'
  | 'Events Manager'
  | 'Finance'
  | 'Read-only'
  | 'Company Admin'
  | 'Member'
  | 'Member / Delegate';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organisation_id: string;
  status: 'Active' | 'Invited' | 'Suspended';
  mfa_enabled: boolean;
  last_login: string;
  avatar_url?: string;
}

export interface Organisation {
  id: string;
  name: string;
  type: 'Company' | 'Corporate member' | 'Premier partner' | 'Advisory' | 'Other';
  parent_org_id?: string;
  website: string;
  sector: string;
  city: string;
  country: string;
  membership_tier: 'Free' | 'Student' | 'Individual' | 'Corporate' | 'Premier';
  status: 'Active' | 'Grace' | 'Suspended' | 'Expired' | 'Pending';
  staff_notes?: string; // STAFF ONLY
  annual_revenue?: string;
  employee_count?: string;
  trade_corridor?: string;
}

export interface Person {
  id: string;
  organisation_id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  role_at_company: 'Director' | 'Owner' | 'Marketing Manager' | 'Finance' | 'Primary Account Holder' | 'Decision Maker' | 'Other';
  email: string;
  phone: string;
  skills: string[];
  export_interests: string[];
  photo_url?: string;
  bio: string;
  consent_email: boolean;
  consent_date: string;
  is_influencer: boolean;
  is_decision_maker: boolean;
  staff_notes?: string; // STAFF ONLY
}

export interface LocationItem {
  id: string;
  organisation_id: string;
  address: string;
  city: string;
  country: string;
  is_hq: boolean;
}

export interface Membership {
  id: string;
  organisation_id?: string;
  person_id?: string;
  tier: 'Free' | 'Student' | 'Individual' | 'Corporate' | 'Premier';
  billing: 'Monthly' | 'Annual' | 'Complimentary';
  status: 'Active' | 'Grace' | 'Suspended' | 'Expired';
  price_gbp: number;
  price_inr: number;
  renew_on: string;
  stripe_or_razorpay: 'Stripe (Mock)' | 'Razorpay (Mock)' | 'Invoice / BACS';
  seats_used?: number;
  seats_total?: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  billing: 'Monthly' | 'Annual';
  price_gbp: number;
  price_inr: number;
  seats: number;
  benefits_text: string;
  active: boolean;
  popular?: boolean;
}

export interface Registration {
  id: string;
  type: 'Membership' | 'Event' | 'Mission' | 'Webinar';
  related_id: string;
  related_title?: string;
  applicant_person_id: string;
  applicant_name?: string;
  applicant_org?: string;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Waitlist';
  submitted_at: string;
  decided_at?: string;
  decided_by?: string;
  notes?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Roundtable' | 'Conference' | 'Networking';
  is_paid: boolean;
  price_gbp: number;
  price_inr: number;
  capacity: number;
  registered_count: number;
  waitlist_count: number;
  start_at: string;
  city: string;
  venue?: string;
  approval_required: boolean;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Draft';
  description?: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  person_id: string;
  person_name?: string;
  person_email?: string;
  organisation_id: string;
  organisation_name?: string;
  status: 'Registered' | 'Approved' | 'Waitlist' | 'Attended' | 'No-show';
  paid: boolean;
  registered_at: string;
}

export interface Mission {
  id: string;
  country: string;
  title: string;
  start_date: string;
  end_date: string;
  price_gbp: number;
  price_inr: number;
  capacity: number;
  deposit_percent: number;
  status: 'Open' | 'Full' | 'In Progress' | 'Completed';
  itinerary_summary: string;
  cities: string[];
  key_sectors: string[];
  delegates_count?: number;
}

export interface Delegate {
  id: string;
  mission_id: string;
  person_id: string;
  person_name?: string;
  person_email?: string;
  organisation_id: string;
  organisation_name?: string;
  reg_status: 'Submitted' | 'Approved' | 'Waitlist' | 'Confirmed';
  payment_status: 'Deposit Paid' | 'Fully Paid' | 'Unpaid' | 'Complimentary';
  travel_notes: string;
  sector: string;
  export_interests: string;
  attendance: 'Confirmed' | 'Pending' | 'Withdrawn';
  passport_verified: boolean;
  visa_issued: boolean;
}

export interface Webinar {
  id: string;
  title: string;
  start_at: string;
  trainer: string;
  capacity: number;
  registered_count: number;
  join_url: string;
  status: 'Scheduled' | 'Live' | 'Recorded';
  duration_mins: number;
}

export interface WebinarAttendee {
  id: string;
  webinar_id: string;
  person_id: string;
  person_name?: string;
  organisation_name?: string;
  attended: boolean;
  registered_at: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'Blog' | 'Newsletter feature' | 'Roundtable' | 'Mission' | 'Podcast' | 'Bundle';
  price_gbp: number;
  price_inr: number;
  billing: 'One-off' | 'Monthly' | 'Annual';
  capacity: number;
  remaining: number;
  description: string;
  badge?: string;
}

export interface Order {
  id: string;
  buyer_person_id: string;
  buyer_name?: string;
  organisation_id: string;
  organisation_name?: string;
  items_summary: string;
  currency: 'GBP' | 'INR';
  total: number;
  status: 'Paid' | 'Failed' | 'Refunded' | 'Complimentary';
  gateway: 'Stripe' | 'Razorpay' | 'Manual';
  created_at: string;
  invoice_number: string;
}

export interface OrderLine {
  id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  qty: number;
  unit_price: number;
  currency: 'GBP' | 'INR';
}

export interface Blog {
  id: string;
  organisation_id: string;
  organisation_name?: string;
  author_name: string;
  title: string;
  summary: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Published' | 'Rejected';
  package: 'Standard Member' | 'Premier Featured' | 'Paid Sponsor';
  views: number;
  paid: boolean;
  submitted_at: string;
}

export interface NewsletterFeature {
  id: string;
  organisation_id: string;
  organisation_name?: string;
  credits_bought: number;
  credits_used: number;
  last_submission_status: 'None' | 'Pending Review' | 'Scheduled' | 'Published';
  last_used_date?: string;
}

export interface Introduction {
  id: string;
  from_person_id: string;
  from_person_name?: string;
  from_org_name?: string;
  to_org_or_person: string;
  message: string;
  target_sector: string;
  status: 'Requested' | 'Approved' | 'Declined' | 'Made';
  staff_owner: string;
  created_at: string;
  outcome_notes?: string;
}

export interface Referral {
  id: string;
  source: string;
  from_org: string;
  to_org: string;
  deal_title: string;
  stage: 'New' | 'Introduction made' | 'Meeting arranged' | 'Opportunity active' | 'Successful' | 'Closed';
  value_gbp: number;
  commission_percent: number;
  commission_amount: number;
  dispute_notes: string;
  tcs_accepted: boolean;
  created_at: string;
  target_close?: string;
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  scheduled_at: string;
  sent: number;
  opens: number;
  clicks: number;
  subject_line: string;
}

export interface AutomationJourney {
  id: string;
  title: string;
  trigger_event: string;
  active: boolean;
  target_segment: string;
  steps_count: number;
  last_fired?: string;
  description: string;
}

export interface WorkflowTask {
  id: string;
  type: 'Approve member' | 'Approve blog' | 'Approve intro' | 'SLA' | 'Failed payment';
  related_id: string;
  title: string;
  assignee_role: UserRole;
  due_at: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  sla_hours: number;
  breached: boolean;
}

export interface AuditLogItem {
  id: string;
  at: string;
  user_email: string;
  action: string;
  record_type: string;
  record_id: string;
  details?: string;
}

export interface CartItem {
  id: string;
  title: string;
  type: 'Membership' | 'Event' | 'Mission' | 'Product';
  unit_price_gbp: number;
  unit_price_inr: number;
  quantity: number;
  billing_type: 'One-off' | 'Monthly' | 'Annual';
  meta?: Record<string, any>;
}

export type BaseCapability =
  | 'all_staff_dashboards'
  | 'approve_suspend_members'
  | 'edit_plans_pricing'
  | 'organisations_crm'
  | 'create_events_missions'
  | 'register_events'
  | 'approve_introductions'
  | 'campaigns_email'
  | 'refunds_invoices'
  | 'sla_workflow_queue'
  | 'reports_export'
  | 'security_users_roles'
  | 'staff_only_notes';

export type Capability =
  | BaseCapability
  | 'approve_registrations'
  | 'manage_billing_refunds'
  | 'approve_intros_blogs';

export const ROLE_CAPABILITIES: Record<UserRole, Record<BaseCapability, boolean>> = {
  'Super Admin': {
    all_staff_dashboards: true,
    approve_suspend_members: true,
    edit_plans_pricing: true,
    organisations_crm: true,
    create_events_missions: true,
    register_events: true,
    approve_introductions: true,
    campaigns_email: true,
    refunds_invoices: true,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: true,
    staff_only_notes: true,
  },
  'Membership Manager': {
    all_staff_dashboards: true,
    approve_suspend_members: true,
    edit_plans_pricing: true,
    organisations_crm: true,
    create_events_missions: false,
    register_events: true,
    approve_introductions: true,
    campaigns_email: false,
    refunds_invoices: false,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: false,
    staff_only_notes: true,
  },
  'Marketing Manager': {
    all_staff_dashboards: true,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: true, // View
    create_events_missions: false,
    register_events: true,
    approve_introductions: false,
    campaigns_email: true,
    refunds_invoices: false,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: false,
    staff_only_notes: true,
  },
  'Events Manager': {
    all_staff_dashboards: true,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: true, // View
    create_events_missions: true,
    register_events: true,
    approve_introductions: false,
    campaigns_email: false,
    refunds_invoices: false,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: false,
    staff_only_notes: true,
  },
  'Finance': {
    all_staff_dashboards: true,
    approve_suspend_members: false,
    edit_plans_pricing: true, // View
    organisations_crm: true, // View
    create_events_missions: false,
    register_events: true,
    approve_introductions: false,
    campaigns_email: false,
    refunds_invoices: true,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: false,
    staff_only_notes: true,
  },
  'Read-only': {
    all_staff_dashboards: true,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: true, // View
    create_events_missions: false,
    register_events: false,
    approve_introductions: false,
    campaigns_email: false,
    refunds_invoices: false,
    sla_workflow_queue: true,
    reports_export: true,
    security_users_roles: false,
    staff_only_notes: true,
  },
  'Company Admin': {
    all_staff_dashboards: false,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: false, // Own company only
    create_events_missions: false,
    register_events: true, // Own org
    approve_introductions: false, // Request only
    campaigns_email: false,
    refunds_invoices: false, // Own invoices only
    sla_workflow_queue: false,
    reports_export: false,
    security_users_roles: false, // Own staff seats only
    staff_only_notes: false, // FORBIDDEN
  },
  'Member': {
    all_staff_dashboards: false,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: false, // Own profile
    create_events_missions: false,
    register_events: true,
    approve_introductions: false, // Request only
    campaigns_email: false,
    refunds_invoices: false, // Own invoices
    sla_workflow_queue: false,
    reports_export: false,
    security_users_roles: false,
    staff_only_notes: false, // FORBIDDEN
  },
  'Member / Delegate': {
    all_staff_dashboards: false,
    approve_suspend_members: false,
    edit_plans_pricing: false,
    organisations_crm: false,
    create_events_missions: false,
    register_events: true,
    approve_introductions: false,
    campaigns_email: false,
    refunds_invoices: false,
    sla_workflow_queue: false,
    reports_export: false,
    security_users_roles: false,
    staff_only_notes: false,
  },
};

export const hasPermission = (role: UserRole, capability: Capability): boolean => {
  if (capability === 'approve_registrations') {
    return ROLE_CAPABILITIES[role]?.approve_suspend_members ?? false;
  }
  if (capability === 'manage_billing_refunds') {
    return ROLE_CAPABILITIES[role]?.refunds_invoices ?? false;
  }
  if (capability === 'approve_intros_blogs') {
    return (ROLE_CAPABILITIES[role]?.approve_introductions || isStaffRole(role)) && role !== 'Read-only';
  }
  return ROLE_CAPABILITIES[role]?.[capability] ?? false;
};

export const isStaffRole = (role: UserRole): boolean => {
  return [
    'Super Admin',
    'Membership Manager',
    'Marketing Manager',
    'Events Manager',
    'Finance',
    'Read-only',
  ].includes(role);
};

export interface TradeDocument {
  id: string;
  title: string;
  required: boolean;
  uploaded: boolean;
  file_name?: string;
  uploaded_at?: string;
}

export interface NewsletterCreditItem extends NewsletterFeature {
  credits_remaining: number;
}

export type BlogPost = Blog;
export type BlogStatus = 'Draft' | 'Submitted' | 'Approved' | 'Published' | 'Rejected';
export type EmailCampaign = Campaign;
export type TradeMission = Mission;
export type ShopProduct = Product;
export type ReferralDeal = Referral;
export type ReferralStage = 'Lead Identified' | 'Qualified Commercial' | 'Deal Signed' | 'Commission Invoiced' | 'Commission Paid' | 'New' | 'Introduction made' | 'Meeting arranged' | 'Opportunity active' | 'Successful' | 'Closed';

export type SheetTabName =
  | 'Organisations'
  | 'People'
  | 'Locations'
  | 'Memberships'
  | 'MembershipPlans'
  | 'Events'
  | 'TradeMissions'
  | 'Webinars'
  | 'Registrations'
  | 'ShopProducts'
  | 'Orders'
  | 'OrderItems'
  | 'BlogPosts'
  | 'NewsletterCredits'
  | 'Introductions'
  | 'Referrals'
  | 'Campaigns'
  | 'Automations'
  | 'WorkflowTasks'
  | 'TradeDocuments'
  | 'AuditLog'
  | 'AppUsers';

