/**
 * Utilitário de teste para diagnosticar problemas de backend no build
 * 
 * Use este arquivo para testar se as requisições estão funcionando
 */

import { universalFetch } from './tauriFetch';

/**
 * Testa a conexão com o backend
 */
export async function testBackendConnection() {
  console.log('🧪 [testBackend] Iniciando teste de conexão...');
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3000';
  console.log('🧪 [testBackend] Backend URL:', backendUrl);
  console.log('🧪 [testBackend] VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('🧪 [testBackend] Modo:', import.meta.env.MODE);
  console.log('🧪 [testBackend] DEV:', import.meta.env.DEV);
  console.log('🧪 [testBackend] PROD:', import.meta.env.PROD);
  
  const testUrl = `${backendUrl}/api/auth/validate`;
  console.log('🧪 [testBackend] Testando URL:', testUrl);
  
  try {
    console.log('🧪 [testBackend] Fazendo requisição...');
    const startTime = Date.now();
    
    const response = await universalFetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'TEST-KEY-123456' }),
    });
    
    const elapsed = Date.now() - startTime;
    console.log('🧪 [testBackend] Resposta recebida em', elapsed, 'ms');
    console.log('🧪 [testBackend] Status:', response.status, response.statusText);
    console.log('🧪 [testBackend] OK:', response.ok);
    console.log('🧪 [testBackend] Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('🧪 [testBackend] Body:', text);
    
    if (response.ok) {
      console.log('✅ [testBackend] SUCESSO! Backend está funcionando!');
    } else {
      console.warn('⚠️ [testBackend] Resposta não OK:', response.status);
    }
    
    return { success: response.ok, status: response.status, body: text };
  } catch (error) {

    
    return { success: false };
  }
}
