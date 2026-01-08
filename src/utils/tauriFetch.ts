/**
 * Wrapper para fetch que usa o plugin HTTP do Tauri em produção
 * Isso resolve problemas de CORS em builds de produção do Tauri
 */

import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// Detecta se está rodando no Tauri
const isTauri = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Múltiplas formas de detectar o Tauri
  const hasTauriInternals = '__TAURI_INTERNALS__' in window;
  const hasTauriInvoke = typeof (window as any).__TAURI_INVOKE__ !== 'undefined';
  const userAgent = navigator.userAgent.toLowerCase();
  const isTauriUA = userAgent.includes('tauri');
  
  const result = hasTauriInternals || hasTauriInvoke || isTauriUA;
  
  console.log('[universalFetch] Detecção Tauri:', {
    hasTauriInternals,
    hasTauriInvoke,
    isTauriUA,
    result,
    userAgent
  });
  
  return result;
};

/**
 * Wrapper universal para fetch que funciona tanto em desenvolvimento quanto em produção
 * Em desenvolvimento: usa fetch nativo do navegador
 * Em produção (Tauri): usa plugin HTTP do Tauri
 * 
 * O plugin HTTP do Tauri retorna uma Response compatível com a API padrão do fetch
 */
export const universalFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  console.log('[universalFetch] Iniciando requisição:', { url, method: options?.method });
  
  // Se não estiver no Tauri, usa fetch nativo
  if (!isTauri()) {
    console.log('[universalFetch] Usando fetch nativo (não está no Tauri)');
    return fetch(url, options);
  }

  console.log('[universalFetch] Detectado Tauri, usando plugin HTTP');
  
  // No Tauri, usa o plugin HTTP
  try {
    const method = options?.method || 'GET';
    const headers: Record<string, string> = {};
    
    // Converte Headers para objeto simples
    if (options?.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    // O body precisa ser convertido para o formato que o Tauri aceita
    // O plugin HTTP do Tauri v2 aceita string ou Uint8Array diretamente
    let tauriBody: string | Uint8Array | undefined = undefined;
    
    if (options?.body) {
      if (typeof options.body === 'string') {
        // String pode ser usada diretamente
        tauriBody = options.body;
      } else if (options.body instanceof FormData) {
        // FormData precisa ser convertido
        // Por enquanto, não suportamos FormData completamente
        console.warn('[universalFetch] FormData pode não ser totalmente suportado');
        tauriBody = undefined;
      } else if (options.body instanceof Blob) {
        // Blob precisa ser convertido para Uint8Array
        const arrayBuffer = await options.body.arrayBuffer();
        tauriBody = new Uint8Array(arrayBuffer);
      } else if (options.body instanceof ArrayBuffer) {
        // ArrayBuffer para Uint8Array
        tauriBody = new Uint8Array(options.body);
      } else if (options.body instanceof Uint8Array) {
        // Já é Uint8Array
        tauriBody = options.body;
      } else {
        // Para objetos, arrays, etc - converter para string JSON
        tauriBody = JSON.stringify(options.body);
      }
    }

    // O fetch do Tauri aceita as mesmas opções que o fetch padrão
    // Mas o body precisa ser do tipo correto
    const tauriOptions: any = {
      method: method as any,
      timeout: 30, // 30 segundos de timeout
    };

    if (Object.keys(headers).length > 0) {
      tauriOptions.headers = headers;
    }

    if (tauriBody !== undefined) {
      tauriOptions.body = tauriBody;
    }

    console.log('[universalFetch] Opções do Tauri:', {
      method: tauriOptions.method,
      hasHeaders: !!tauriOptions.headers,
      hasBody: tauriBody !== undefined,
      bodyType: typeof tauriBody,
      url
    });

    const response = await tauriFetch(url, tauriOptions);

    console.log('[universalFetch] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      hasBody: !!response.body
    });

    // O Response do Tauri é compatível com a API padrão
    return response as Response;
  } catch (error) {
    console.error('[universalFetch] Erro ao usar Tauri HTTP:', error);
    // Fallback para fetch nativo se houver erro
    try {
      return fetch(url, options);
    } catch (fallbackError) {
      console.error('[universalFetch] Erro no fallback também:', fallbackError);
      throw error;
    }
  }
};
