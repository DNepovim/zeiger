import { ThemeProvider } from '@/components/theme-provider';
import { UserForm } from './UserForm';
import { UserList } from '@/components/UsersList/UserList';
import { UserList as UserListZustand } from '@/components/UsersListZustand/UserList';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Zeiger Example App
          </h1>

          <UserForm />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <UserList />
            <UserListZustand />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
