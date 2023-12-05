export interface UserSession {
  user: { username: string, userId: string; },
  sessionId: string,
  activePeriodExpiresAt: Date,
  idlePeriodExpiresAt: Date,
  state: string,
  fresh: boolean;
}