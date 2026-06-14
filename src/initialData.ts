import { Contributor, ContributionTarget, Contribution, Pledge, StaffUser } from './types';

export const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-admin-1',
    name: 'Aravind Swamy',
    mobile: '9876543210',
    role: 'admin',
    registeredAt: '2026-05-01'
  },
  {
    id: 'staff-user-2',
    name: 'Karthik Raja',
    mobile: '9123456789',
    role: 'collector',
    registeredAt: '2026-05-15'
  }
];

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: 'CONTR-1001',
    name: 'Rajesh Kumar',
    mobile: '9876500111',
    type: 'monthly',
    expectedAmount: 500,
    createdAt: '2026-01-10'
  },
  {
    id: 'CONTR-1002',
    name: 'Anita Sharma',
    mobile: '9812300222',
    type: 'monthly',
    expectedAmount: 500,
    createdAt: '2026-01-12'
  },
  {
    id: 'CONTR-1003',
    name: 'Vijay Singh',
    mobile: '9944300333',
    type: 'monthly',
    expectedAmount: 1000,
    createdAt: '2026-02-01'
  },
  {
    id: 'CONTR-1004',
    name: 'Suresh Patel',
    mobile: '9765400444',
    type: 'monthly',
    expectedAmount: 500,
    createdAt: '2026-02-15'
  },
  {
    id: 'CONTR-1005',
    name: 'Amit Patel',
    mobile: '9567800555',
    type: 'monthly',
    expectedAmount: 600,
    createdAt: '2026-03-01'
  },
  {
    id: 'CONTR-1006',
    name: 'Meera Deshmukh',
    mobile: '9456700666',
    type: 'onetime',
    createdAt: '2026-05-20'
  },
  {
    id: 'CONTR-1007',
    name: 'John Fernandes',
    mobile: '9123400777',
    type: 'onetime',
    createdAt: '2026-06-01'
  }
];

export const INITIAL_TARGETS: ContributionTarget[] = [
  {
    id: 'target-monthly-june-2026',
    name: 'Monthly Collection - June 2026',
    category: 'monthly',
    targetAmount: 5000,
    dueDate: '2026-06-30',
    status: 'active'
  },
  {
    id: 'target-monthly-may-2026',
    name: 'Monthly Collection - May 2026',
    category: 'monthly',
    targetAmount: 5000,
    dueDate: '2026-05-31',
    status: 'completed'
  },
  {
    id: 'target-birthday-party',
    name: 'Rohan Birthday Event',
    category: 'event',
    targetAmount: 4000,
    dueDate: '2026-06-15',
    status: 'active'
  },
  {
    id: 'target-charity-shelter',
    name: 'Charity Shelter Construction',
    category: 'special',
    targetAmount: 20000,
    dueDate: '2026-08-15',
    status: 'active'
  }
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  // May payments
  {
    id: 'REC-2001',
    contributorId: 'CONTR-1001',
    contributorName: 'Rajesh Kumar',
    contributorMobile: '9876500111',
    contributorType: 'monthly',
    targetId: 'target-monthly-may-2026',
    targetName: 'Monthly Collection - May 2026',
    amountPaid: 500,
    datePaid: '2026-05-02T10:30:00Z',
    collectedByUserId: 'staff-user-2',
    collectedByUserName: 'Karthik Raja',
    receiptUrl: 'https://cm-receipts.net/rec-2001'
  },
  {
    id: 'REC-2002',
    contributorId: 'CONTR-1002',
    contributorName: 'Anita Sharma',
    contributorMobile: '9812300222',
    contributorType: 'monthly',
    targetId: 'target-monthly-may-2026',
    targetName: 'Monthly Collection - May 2026',
    amountPaid: 500,
    datePaid: '2026-05-04T14:15:00Z',
    collectedByUserId: 'staff-admin-1',
    collectedByUserName: 'Aravind Swamy',
    receiptUrl: 'https://cm-receipts.net/rec-2002'
  },
  {
    id: 'REC-2003',
    contributorId: 'CONTR-1003',
    contributorName: 'Vijay Singh',
    contributorMobile: '9944300333',
    contributorType: 'monthly',
    targetId: 'target-monthly-may-2026',
    targetName: 'Monthly Collection - May 2026',
    amountPaid: 1000,
    datePaid: '2026-05-05T09:00:00Z',
    collectedByUserId: 'staff-user-2',
    collectedByUserName: 'Karthik Raja',
    receiptUrl: 'https://cm-receipts.net/rec-2003'
  },
  // June payments
  {
    id: 'REC-2004',
    contributorId: 'CONTR-1001',
    contributorName: 'Rajesh Kumar',
    contributorMobile: '9876500111',
    contributorType: 'monthly',
    targetId: 'target-monthly-june-2026',
    targetName: 'Monthly Collection - June 2026',
    amountPaid: 500,
    datePaid: '2026-06-02T11:45:00Z',
    collectedByUserId: 'staff-user-2',
    collectedByUserName: 'Karthik Raja',
    receiptUrl: 'https://cm-receipts.net/rec-2004'
  },
  {
    id: 'REC-2005',
    contributorId: 'CONTR-1003',
    contributorName: 'Vijay Singh',
    contributorMobile: '9944300333',
    contributorType: 'monthly',
    targetId: 'target-monthly-june-2026',
    targetName: 'Monthly Collection - June 2026',
    amountPaid: 1000,
    datePaid: '2026-06-03T16:20:00Z',
    collectedByUserId: 'staff-admin-1',
    collectedByUserName: 'Aravind Swamy',
    receiptUrl: 'https://cm-receipts.net/rec-2005'
  },
  // One-time special payment
  {
    id: 'REC-2006',
    contributorId: 'CONTR-1006',
    contributorName: 'Meera Deshmukh',
    contributorMobile: '9456700666',
    contributorType: 'onetime',
    targetId: 'target-charity-shelter',
    targetName: 'Charity Shelter Construction',
    amountPaid: 5000,
    datePaid: '2026-05-25T13:00:00Z',
    collectedByUserId: 'staff-user-2',
    collectedByUserName: 'Karthik Raja',
    receiptUrl: 'https://cm-receipts.net/rec-2006'
  }
];

export const INITIAL_PLEDGES: Pledge[] = [
  {
    id: 'PLD-3001',
    targetId: 'target-birthday-party',
    targetName: 'Rohan Birthday Event',
    name: 'Suresh Patel',
    mobile: '9765400444',
    promisedAmount: 1000,
    amountPaid: 0,
    status: 'pending',
    createdAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'PLD-3002',
    targetId: 'target-birthday-party',
    targetName: 'Rohan Birthday Event',
    name: 'Priya Sen',
    mobile: '9888123456',
    promisedAmount: 1000,
    amountPaid: 1000,
    status: 'fully_paid',
    createdAt: '2026-06-02T10:00:00Z'
  },
  {
    id: 'PLD-3003',
    targetId: 'target-charity-shelter',
    targetName: 'Charity Shelter Construction',
    name: 'Vikram Mehta',
    mobile: '9111222333',
    promisedAmount: 10000,
    amountPaid: 3000,
    status: 'partially_paid',
    createdAt: '2026-06-03T09:15:00Z'
  }
];
