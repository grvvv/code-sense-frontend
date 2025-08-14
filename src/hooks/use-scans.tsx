
import { scanService } from '@/services/scan.service';
import type { CreateScanDetails } from '@/types/scan';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useScanDetails(scanId: string) {
  return useQuery({
    queryKey: ['scans', scanId],
    queryFn: () => scanService.getScanById(scanId),
    enabled: !!scanId,
  });
}

export function useScans(projectId: string, params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['scans', 'list', projectId, params],
    queryFn: () => scanService.getScanByProject(projectId, params),
  });
}

export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scanId: string) =>
      scanService.deleteScan(scanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans', 'list'] });
    },
  });
}

export function useCreateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scanData: CreateScanDetails) => scanService.startScan(scanData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['scans', 'list'] });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

