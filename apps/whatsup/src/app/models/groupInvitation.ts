export type GroupInvitation = {
  id: undefined | string;
  acceptedAt: string;
  createdAt: string;
  fromUserId: string;
  groupId: string;
  status: 'accepted' | 'declined' | 'pending';
  toUserId: string;
}