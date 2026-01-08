// Utilitário para testar conexão com o backend
export async function testBackendConnection(backendUrl: string): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  const testUrl = `${backendUrl}/api/auth/validate-stream`;
  
  console.log('[testConnection] Testando conexão com:', testUrl);
  console.log('[testConnection] fetch disponível:', typeof fetch !== 'undefined');
  console.log('[testConnection] window disponível:', typeof window !== 'undefined');
  
  try {
    // Teste simples de conexão
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'TEST' }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('[testConnection] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    return {
      success: true,
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  } catch (error: any) {
    console.error('[testConnection] Erro na conexão:', error);
    
    return {
      success: false,
      error: error?.message || 'Erro desconhecido',
      details: {
        name: error?.name,
        stack: error?.stack,
      },
    };
  }
}
