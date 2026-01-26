import { useState } from 'react';
import { useStore, useUserPointer, useUsersPointer } from './store';

export function UserForm() {
  const [selectedId, setSelectedId] = useState<string>('');

  // Use zeiger pointer to only get id and name for the select options
  const usersForSelect = useUsersPointer(['id', 'name']);

  // Use zeiger pointer to get only the selected user's editable fields
  const selectedUser = useUserPointer(selectedId, [
    'name',
    'email',
    'role',
    'department',
  ]);

  const updateUser = useStore((state) => state.updateUser);

  const handleChange = (
    field: 'name' | 'email' | 'role' | 'department',
    value: string
  ) => {
    if (selectedId) {
      updateUser(selectedId, { [field]: value });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>

      <div className="space-y-4">
        {/* User Select */}
        <div>
          <label
            htmlFor="user-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select User
          </label>
          <select
            id="user-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a user --</option>
            {usersForSelect.map((user: { id: string; name: string }) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={selectedUser.name}
                onKeyUp={(e) => handleChange('name', e.currentTarget.value)}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={selectedUser.email}
                onKeyUp={(e) => handleChange('email', e.currentTarget.value)}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                value={selectedUser.role}
                onKeyUp={(e) => handleChange('role', e.currentTarget.value)}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Department Field */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                value={selectedUser.department}
                onKeyUp={(e) =>
                  handleChange('department', e.currentTarget.value)
                }
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
