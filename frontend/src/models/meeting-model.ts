export interface Meeting {
  createdAt?: string;
  meetingDate: string;
  meetingId?: string;
  notes: string;
  userId?: string;
  agreedUponActions?: AgreedUponAction[];
  hasOutstandingActionItems?: boolean;
}

export interface AgreedUponAction {
  notes: string;
  isComplete: boolean;
}
