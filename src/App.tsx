import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-2xl font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="container">
      {user ? <UserProfile /> : <Login />}
    </main>
  );
}

export default App;
