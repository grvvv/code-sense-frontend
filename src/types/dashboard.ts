export interface StatCountDetails {
  users: number,
  projects: number,
  scans: number,
  findings: number
}

interface SystemStatus {
  active_percentage: number,
  remaining_percentage: number
}
export interface DashboardResponse {
  top_counts: StatCountDetails;
  system_status: SystemStatus;
  findings_trend: object[]
}
