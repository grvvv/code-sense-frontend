import { createFileRoute } from '@tanstack/react-router';
import { GenericTable, type TableColumn } from '@/components/molecule/generic-table';
import { useUsers } from '@/hooks/use-user';
import { Button } from '@/components/atomic/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types/auth';
import { RoleBadge } from '@/components/atomic/enum-badge';

export const Route = createFileRoute('/_authenticated/users/list')({
  component: RouteComponent,
});


function RouteComponent() {
  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // For server-side pagination
  const { data: usersResponse, isLoading, error } = useUsers({
    page: currentPage,
    limit: usersPerPage,
  });

  const users = usersResponse?.users || [];
  const totalUsers = usersResponse?.pagination.total || 0;

  // Define table columns
  const userColumns: TableColumn<User>[] = [
    {
      key: 'srNo',
      header: 'Sr No.',
      render: (_, index: number) => index + 1,
      width: '80px'
    },
    {
      key: 'name',
      header: 'Username',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <RoleBadge role={user.role}/>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleView(user);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      width: '150px'
    }
  ];

  const handleView = (user: User) => {
    console.log('View user:', user);
  };

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    console.log('Delete user:', user);
  };

  const handleRowClick = (user: User) => {
    console.log('Row clicked:', user);
  };

  return (
    <GenericTable
      data={users}
      columns={userColumns}
      title="User List"
      loading={isLoading}
      error={error?.message}
      pagination={{
        enabled: true,
        pageSize: usersPerPage,
        showInfo: true,
        showPageNumbers: true
      }}
      totalItems={totalUsers}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      emptyMessage="No users found"
      onRowClick={handleRowClick}
      rowClassName={() => 
        `hover:bg-gray-50`
      }
    />
  );
}