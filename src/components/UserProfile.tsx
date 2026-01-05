import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Key, CheckCircle2 } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Máscara a chave para exibição
  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <Card className="flex flex-col items-center justify-center min-h-screen">
      <div className="rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* Status do Sistema */}
        <div className="flex items-center justify-between p-3 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Sistema Online
              </span>
              <span className="text-xs text-green-600 dark:text-green-500">
                Todos os serviços operacionais
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              v1.5.0
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Synapse
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Key className="w-16 h-16 text-indigo-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Usuário Autenticado
          </h1>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chave de Licença</p>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">
              {maskKey(user.licenseKey)}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">
              {user.id}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Licença Válida</span>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Sair
          </button>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
