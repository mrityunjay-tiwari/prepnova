export type InterviewSegment = {
  question: string;
  answer: string;
};

export type MidFeedback = {
  short_feedback: string;
  score: number;
};

export type PostureStats = {
  min: number;
  max: number;
  avg: number;
};

export type FinalizeInterviewRequest = {
  callId: string;
  userId: string;
  role: string;
  postureStats: PostureStats;
  reason?:
    | "call_left"
    | "tab_closed"
    | "page_hidden"
    | "offline_timeout"
    | "route_change";
};
