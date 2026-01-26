import { UserForm } from './UserForm';
import { UserList } from './UserList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Zeiger Example App
        </h1>

        {/* Form at the top */}
        <UserForm />

        {/* User list below to show live updates */}
        <UserList />
      </div>
    </div>
  );
}

export default App;
