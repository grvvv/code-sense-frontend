import { BaseApiClient } from "@/lib/api";
import type { RegisterCredentials } from "@/types/auth";
import type { UpdateUserData, UserListResponse, UserProfile } from "@/types/user";

class UserService extends BaseApiClient {
  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.get<UserProfile>(`api/auth/users/${userId}`);
  }

  async createProfile(data: RegisterCredentials): Promise<UserProfile> {
    return this.post<UserProfile>(`api/auth/register/`, data);
  }

  async updateProfile(userId: string, data: UpdateUserData): Promise<UserProfile> {
    return this.patch<UserProfile>(`api/auth/users/${userId}`, data);
  }

  async getUsersList(params?: { page?: number; limit?: number; search?: string }): Promise<UserListResponse> {
    return this.get<any>('api/auth/users', params);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.delete<void>(`api/auth/users/${userId}`);
  }
}

export const userService = new UserService();