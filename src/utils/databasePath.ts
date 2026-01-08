/**
 * Utilitário para obter o caminho do banco de dados no Tauri
 * 
 * ❌ ERRADO (Electron): const dbPath = path.join(app.getPath("userData"), "sample.db")
 * ✅ CORRETO (Tauri 2.0): Use appDataDir() da API core
 * 
 * No Tauri 2.0, appDataDir e join estão na API core (@tauri-apps/api/path)
 * Não precisa de plugins adicionais!
 */

import { appDataDir, join } from '@tauri-apps/api/path';

/**
 * Obtém o caminho completo para o arquivo de banco de dados
 * 
 * Equivalente ao Electron:
 * const dbPath = path.join(app.getPath("userData"), "sample.db")
 * 
 * @param dbFileName Nome do arquivo de banco (ex: "sample.db")
 * @returns Caminho completo para o arquivo de banco
 * 
 * @example
 * const dbPath = await getDatabasePath('sample.db');
 * // Windows: C:\Users\{user}\AppData\Roaming\com.firstapp.dev\sample.db
 * // macOS: ~/Library/Application Support/com.firstapp.dev/sample.db
 * // Linux: ~/.local/share/com.firstapp.dev/sample.db
 */
export async function getDatabasePath(dbFileName: string = 'sample.db'): Promise<string> {
  try {
    // Obtém o diretório de dados do app
    // No Windows: C:\Users\{user}\AppData\Roaming\com.firstapp.dev\
    // No macOS: ~/Library/Application Support/com.firstapp.dev/
    // No Linux: ~/.local/share/com.firstapp.dev/
    const dataDir = await appDataDir();
    
    console.log('[getDatabasePath] Diretório de dados do app:', dataDir);
    
    // Junta o diretório com o nome do arquivo
    const dbPath = await join(dataDir, dbFileName);
    
    console.log('[getDatabasePath] Caminho completo do banco:', dbPath);
    
    return dbPath;
  } catch (error) {
    console.error('[getDatabasePath] Erro ao obter caminho do banco:', error);
    throw error;
  }
}

/**
 * Obtém apenas o diretório de dados do app (sem o nome do arquivo)
 * 
 * Equivalente ao Electron: app.getPath("userData")
 */
export async function getAppDataDirectory(): Promise<string> {
  const dataDir = await appDataDir();
  console.log('[getAppDataDirectory] Diretório:', dataDir);
  return dataDir;
}
