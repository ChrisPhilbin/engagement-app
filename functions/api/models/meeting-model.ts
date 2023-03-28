export interface IMeeting {
  agreedUponActions: agreedUponAction[];
  createdAt: Date;
  hasOutstandingActionItems: boolean;
  meetingDate: Date;
  notes: string;
  userId: string;
  meetingId?: string;
}

interface agreedUponAction {
  isComplete: boolean;
  notes: string;
}
