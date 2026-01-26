import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsersStore, useUserPointer, useUsersPointer } from './usersStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
});

type UserFormData = z.infer<typeof userFormSchema>;

export function UserForm() {
  const [selectedId, setSelectedId] = useState<string>('1');

  const usersForSelect = useUsersPointer(['id', 'firstName', 'surname']);

  const selectedUser = useUserPointer(selectedId, [
    'firstName',
    'surname',
    'email',
    'role',
    'department',
  ]);

  const updateUser = useUsersStore((state) => state.updateUser);

  const isUpdatingFromStore = useRef(false);

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      role: '',
      department: '',
    },
  });

  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    isUpdatingFromStore.current = true;
    reset({
      firstName: selectedUser.firstName,
      surname: selectedUser.surname,
      email: selectedUser.email,
      role: selectedUser.role,
      department: selectedUser.department,
    });
    setTimeout(() => {
      isUpdatingFromStore.current = false;
    }, 0);
  }, [selectedUser, reset]);

  const watchedFields = watch();

  useEffect(() => {
    if (selectedId && selectedUser && !isUpdatingFromStore.current) {
      const hasChanges =
        watchedFields.firstName !== selectedUser.firstName ||
        watchedFields.surname !== selectedUser.surname ||
        watchedFields.email !== selectedUser.email ||
        watchedFields.role !== selectedUser.role ||
        watchedFields.department !== selectedUser.department;

      if (!hasChanges) {
        return;
      }

      updateUser(selectedId, {
        firstName: watchedFields.firstName,
        surname: watchedFields.surname,
        email: watchedFields.email,
        role: watchedFields.role,
        department: watchedFields.department,
      });
    }
  }, [
    watchedFields.firstName,
    watchedFields.surname,
    watchedFields.email,
    watchedFields.role,
    watchedFields.department,
    selectedId,
    selectedUser,
    updateUser,
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Edit User
      </h2>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-select">Select User</Label>
          <Select
            id="user-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Select a user --</option>
            {usersForSelect.map(
              (user: { id: string; firstName: string; surname: string }) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.surname}
                </option>
              )
            )}
          </Select>
        </div>

        {selectedUser && (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" {...register('surname')} />
              {errors.surname && (
                <p className="text-sm text-destructive">
                  {errors.surname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input type="text" id="role" {...register('role')} />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input type="text" id="department" {...register('department')} />
              {errors.department && (
                <p className="text-sm text-destructive">
                  {errors.department.message}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
