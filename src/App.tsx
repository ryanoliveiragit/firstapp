import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import KeyInput from "./components/KeyInput";
import Dashboard from "./components/Dashboard";

function App() {
  const { user, licenseKey, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen grid-background relative overflow-hidden">
        <div className="scan-line" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-background to-background" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-pulse-glow">
            <div className="w-12 h-12 bg-primary/20 rounded-xl" />
          </div>
          <div className="text-2xl font-semibold text-glow">Loading...</div>
        </div>
      </div>
    );
  }

  // Flow: No user -> Login -> KeyInput (required) -> Dashboard
  if (!user) {
    return <Login />;
  }

  if (!licenseKey) {
    return <KeyInput />;
  }

  return <Dashboard />;
}

export default App;
