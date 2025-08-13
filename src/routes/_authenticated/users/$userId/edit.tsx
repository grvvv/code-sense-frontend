import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle } from '@/components/atomic/card';
import { useUpdateProfile, useUserProfile } from '@/hooks/use-user';
import { Button } from '@/components/atomic/button';
import { Input } from '@/components/atomic/input';
import { DotsLoader } from '@/components/atomic/loader';

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  component: RouteComponent,
});

interface FormData {
  company: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: 'admin' | 'manager' | 'user' | '';
}

function RouteComponent() {
  const navigate = useNavigate();
  const updateUserMutation = useUpdateProfile();

  const { userId } = useParams({ from: '/_authenticated/users/$userId/edit' });
  const { data: user, isLoading, error } = useUserProfile(userId)

  const [form, setForm] = useState<FormData>({
    company: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (user) {
      setForm({
        company: user.company || '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on input change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.name.trim()) newErrors.name = 'Username is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.role) newErrors.role = "";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const userData = {
        company: form.company,
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        role: form.role as 'admin'| 'manager' | 'user',
      };

      await updateUserMutation.mutateAsync({userId, data: userData});
      
      // Reset form
      setForm({
        company: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
      
      // Navigate back to users list or show success message
      navigate({ to: '/users/list' });
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error - you might want to show a toast notification
    }
  };

  const handleCancel = () => {
    navigate({ to: '/users/list' });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <DotsLoader />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl text-red-600'>Error</CardTitle>
          </CardHeader>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {error ? 'Failed to load project details.' : 'Project not found.'}
            </p>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Back to Projects
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate({ to: '/users/list' })}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Users List
            </Button>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              name="company"
              value={form.company}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`${
                errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`${
                errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter password (min 6 characters)"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={updateUserMutation.isPending}
              className={`w-full border rounded p-3 ${errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
          </div>

          {/* Error Message */}
          {updateUserMutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error creating user: {updateUserMutation.error.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded shadow transition-colors"
            >
              {updateUserMutation.isPending ? 'Creating User...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: '/users/list' })}
              disabled={updateUserMutation.isPending}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}