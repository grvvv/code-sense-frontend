// src/routes/_authenticated/users/newuser.tsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/atomic/card';

export const Route = createFileRoute('/_authenticated/users/newuser')({
  component: RouteComponent,
});

interface FormData {
  company: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'Admin' | 'User' | '';
}

function RouteComponent() {
  const [form, setForm] = useState<FormData>({
    company: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

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
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (!form.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) newErrors.role = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', form);
      alert('User created successfully!');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New User</h2>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
                errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
                errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter password"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
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
              className={`w-full p-3 border rounded ${
                errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded shadow"
            >
              Create User
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
