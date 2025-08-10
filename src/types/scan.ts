export interface ScanDetails {
  id: string;
  project_id: string;
  scan_name: string;
  status: string;
  findings: number;
  total_files: number;
  files_scanned: number;
  created_at: string;
  end_time: string | null;
  triggered_by: string
}

export interface CreateScanDetails {
  project_id: string;
  scan_name: string;
  zip_file: File | null;
  zip_error?: string;
}

export interface UpdateProjectDetails {
  name?: string;
  preset?: string;
  description?: string;
}

export interface ScanListResponse {
  scans: ScanDetails[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
}