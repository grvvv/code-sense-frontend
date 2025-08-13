export interface StatCountDetails {
  users: number,
  projects: number,
  scans: number,
  findings: number
}

type SeverityData = {
  critical: number;
  high: number;
  medium: number;
  low: number;
};

type ScanStatus = {
  complete: number;
  in_progress: number;
  failed: number;
  queued: number;
};

export interface SeverityChartDetails {
  open: SeverityData,
  close: SeverityData
}

export interface SystemStatus {
  counts: ScanStatus,
  total_scans: number
}

export interface DashboardResponse {
  top_counts: StatCountDetails,
  system_status: SystemStatus,
  count_by_severity: SeverityChartDetails
}
