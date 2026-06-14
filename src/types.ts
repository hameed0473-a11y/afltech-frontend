export type UserRole = 'admin' | 'collector';

export interface StaffUser {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  registeredAt: string;
}

export type ContributorType = 'monthly' | 'onetime';

export interface Contributor {
  id: string; // Dynamic unique ID like "CM-1001"
  name: string;
  mobile: string;
  type: ContributorType;
  expectedAmount?: number; // Optional monthly standard amount
  createdAt: string;
}

export type TargetCategory = 'monthly' | 'special' | 'event';

export interface ContributionTarget {
  id: string; // e.g. "target-monthly-2026-06", "target-birthday-2026"
  name: string; // e.g. "Monthly Contributions - June 2026", "Subhash Birthday Party"
  category: TargetCategory;
  targetAmount: number; // Set by admin
  dueDate?: string;
  status: 'active' | 'completed';
}

export interface Contribution {
  id: string; // e.g. "REC-8902"
  contributorId: string;
  contributorName: string;
  contributorMobile: string;
  contributorType: ContributorType;
  targetId: string;
  targetName: string;
  amountPaid: number;
  datePaid: string;
  collectedByUserId: string;
  collectedByUserName: string;
  receiptUrl: string; // Mock or actual url
}

// For event/special contributions where users promise/willing to pledge initially
export interface Pledge {
  id: string;
  targetId: string;
  targetName: string;
  name: string;
  mobile: string;
  promisedAmount: number;
  amountPaid: number;
  status: 'pending' | 'partially_paid' | 'fully_paid';
  createdAt: string;
}

export interface OTPRequest {
  mobile: string;
  code: string;
  step: 'request' | 'verify';
}
