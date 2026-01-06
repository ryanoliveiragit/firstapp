import { useState, useEffect } from "react";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import KeyInput from "./components/KeyInput";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/admin/AdminPanel";
import { Toaster } from "sonner";

// Mensagens de análise da IA
const getAnalysisMessages = (validationResult: 'success' | 'error' | null) => {
  const baseMessages = [
    { text: 'Analisando sua chave...', delay: 0 },
    { text: 'Verificando acesso...', delay: 800 },
    { text: 'Validando credenciais...', delay: 1600 },
    { text: 'Criando componentes...', delay: 2400 },
    { text: 'Inicializando sistema...', delay: 3200 },
  ];

  // Última mensagem baseada no resultado da API
  if (validationResult === 'success') {
    baseMessages.push({ text: 'Chave validada com sucesso! Acessando sistema...', delay: 4000 });
  } else if (validationResult === 'error') {
    baseMessages.push({ text: 'Chave inválida. Verifique suas credenciais e tente novamente.', delay: 4000 });
  } else {
    baseMessages.push({ text: 'Quase pronto...', delay: 4000 });
  }

  return baseMessages;
};

function App() {
  const { user, licenseKey, isLoading, isValidating, validationResult, backendMessages } = useAuth();
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Verificar se está na rota /admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin/'));
    };

    checkAdminRoute();

    // Listen for route changes
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  // Efeito para atualizar mensagens do backend com animação
  useEffect(() => {
    if (!isValidating) {
      setCurrentMessage('');
      return;
    }

    // Se há mensagens do backend, usar elas com animação
    if (backendMessages.length > 0) {
      // Sempre mostrar a última mensagem
      const lastMessage = backendMessages[backendMessages.length - 1];
      setCurrentMessage(lastMessage);
    } else {
      // Fallback para mensagens padrão se não houver mensagens do backend ainda
      const defaultMessages = getAnalysisMessages(validationResult);
      if (defaultMessages.length > 0) {
        setCurrentMessage(defaultMessages[0].text);
      }
    }
  }, [backendMessages, isValidating, validationResult]);

  // Rota /admin - não precisa de autenticação
  if (isAdminRoute) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <AdminPanel />
      </>
    );
  }

  // Mostrar loading apenas quando está validando a chave
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black relative">
        {/* Container principal com skeleton */}
        <div className="w-full max-w-2xl px-6 mb-12">
          <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-700/50 rounded-2xl p-10 relative backdrop-blur-sm">
            {/* Linhas skeleton animadas */}
            <div className="space-y-5">
              <div className="h-3 bg-zinc-800/30 rounded border border-dashed border-zinc-700/30 skeleton-line" style={{ width: '90%' }} />
              <div className="h-3 bg-zinc-800/30 rounded border border-dashed border-zinc-700/30 skeleton-line" style={{ width: '65%' }} />
              <div className="h-3 bg-zinc-800/30 rounded border border-dashed border-zinc-700/30 skeleton-line" style={{ width: '80%' }} />
              <div className="h-3 bg-zinc-800/30 rounded border border-dashed border-zinc-700/30 skeleton-line" style={{ width: '55%' }} />
            </div>

            {/* Ícone AI no canto inferior esquerdo */}
            <div className="absolute bottom-5 left-5 w-11 h-11 rounded-full bg-zinc-800/40 border border-zinc-700/30 flex items-center justify-center backdrop-blur-sm">
              <svg 
                className="w-5 h-5 text-zinc-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mensagem de status */}
        <div className="text-center">
          <p className="text-white/90 text-lg font-light tracking-wide">
            {currentMessage || 'Building your idea..'}
            <span className="inline-block w-1 h-5 bg-white/50 ml-2 animate-pulse" />
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <Login />
      </>
    );
  }

  if (!licenseKey) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <KeyInput />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Dashboard />
    </>
  );
}

export default App;
