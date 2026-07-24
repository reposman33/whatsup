export type GroupInvitation = {
  id?: '';
  acceptedAt: string;
  createdAt: string;
  fromUserId: string;
  groupId: string;
  status: 'accepted' | 'declined' | 'pending';
  toUserId: string;
}