export interface IMeeting {
  id?: string;
  agreedUponActions: agreedUponAction[];
  createdAt: Date | string;
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
