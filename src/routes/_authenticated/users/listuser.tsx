import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/atomic/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/users/listuser')({
  component: RouteComponent,
});

interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'User';
}

// Dummy user data (you can replace this with data from your backend)
const dummyUsers: User[] = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : 'User',
}));

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = Math.ceil(dummyUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = dummyUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
      <Card className='py-0 overflow-hidden'>
        <div className="p-6" style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8" style={{ color: '#2d2d2d' }}>User List</h2>
          
          <div className="bg-white shadow-md overflow-hidden" style={{ border: '1px solid #e5e5e5' }}>
            <table className="w-full text-left border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b">Sr No.</th>
                  <th className="px-4 py-3 border-b">Username</th>
                  <th className="px-4 py-3 border-b">Email</th>
                  <th className="px-4 py-3 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{indexOfFirstUser + idx + 1}</td>
                    <td className="px-4 py-3 border-b">{user.username}</td>
                    <td className="px-4 py-3 border-b">{user.email}</td>
                    <td className="px-4 py-3 border-b">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info and Controls */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, dummyUsers.length)} of {dummyUsers.length} users
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              style={{ 
                borderColor: '#e5e5e5',
                color: '#2d2d2d',
                backgroundColor: '#ffffff'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
            <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
              </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-red-700 text-white'
                      : 'text-gray-800 bg-white hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              style={{ 
                backgroundColor: '#bf0000',
                color: '#ffffff',
                border: '1px solid #bf0000'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = '#a00000';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = '#bf0000';
                }
              }}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
  );
}
