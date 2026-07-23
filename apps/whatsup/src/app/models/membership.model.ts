export type Membership = {
  groupId: string;
  contactId: string;   // liever ID dan email, zie hieronder
  email: string;
  status: 'pending' | 'accepted';
  invitedAt: string;    // Temporal.Instant als string
  acceptedAt?: string;
}