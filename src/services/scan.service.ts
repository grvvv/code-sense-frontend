import { BaseApiClient } from "@/lib/api";
import type { CreateScanDetails, ScanDetails, ScanListResponse } from "@/types/scan";

class ScanService extends BaseApiClient {
  async getScanById(scanId: string): Promise<ScanDetails> {
    return this.get<ScanDetails>(`api/scans/${scanId}`);
  }

  async startScan(data: CreateScanDetails): Promise<ScanDetails> {
    const formData = new FormData();
    formData.append("scan_name", data.scan_name);
    formData.append("project_id", data.project_id);
    if (data.zip_file) {
      formData.append("zip_file", data.zip_file);
    }

    return this.post<ScanDetails>("api/scans/create/", formData);
  }


  async getScanByProject(projectId: string, params?: { page?: number; limit?: number; search?: string }): Promise<ScanListResponse> {
    return this.get<any>(`api/scans/project/${projectId}/`, params);
  }

  async deleteScan(scanId: string): Promise<void> {
    return this.delete<void>(`api/scans/delete/${scanId}/`);
  }

  async downloadCsv(scanId: string): Promise<any> {
    return this.axiosInstance.get<any>(`api/findings/scan/csv/${scanId}/`, {
      responseType: "blob"
    });
  }
}

export const scanService = new ScanService();