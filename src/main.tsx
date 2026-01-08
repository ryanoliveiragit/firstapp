import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

// Teste de diagnóstico do backend (apenas em desenvolvimento ou quando necessário)
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_BACKEND_TEST === 'true') {
  import('./utils/testBackend').then(({ testBackendConnection }) => {
    // Aguarda um pouco para garantir que o app carregou
    setTimeout(() => {
      console.log('🧪 Executando teste de diagnóstico do backend...');
      testBackendConnection();
    }, 1000);
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
