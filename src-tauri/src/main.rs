// Impede janela de console extra no Windows em release, NÃO REMOVA!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, Components, Disks};
use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Emitter, Manager}; // Manager é necessário para webview_windows()
use std::thread;
use std::time::Duration;

#[derive(Serialize)]
struct DiskInfo {
    name: String,
    total_space: u64,
    available_space: u64,
    used_space: u64,
    usage_percentage: f32,
}

#[derive(Serialize)]
struct SystemStats {
    cpu_usage: f32,
    cpu_temp: Option<f32>,
    memory_usage: f32,
    memory_total: u64,
    memory_used: u64,
    disks: Vec<DiskInfo>,
    os_name: String,
    os_version: String,
    kernel_version: String,
}

#[tauri::command]
fn get_system_stats() -> SystemStats {
    let mut sys = System::new_all();
    sys.refresh_all();

    // Aguarda um tempo mínimo para o cálculo do uso de CPU
    thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    let memory_usage = (memory_used as f32 / memory_total as f32) * 100.0;

    // Tenta pegar temperatura de CPU (se existir)
    let components = Components::new_with_refreshed_list();
    let cpu_temp = components
        .iter()
        .find(|c| c.label().to_lowercase().contains("cpu"))
        .map(|c| c.temperature());

    let disks = Disks::new_with_refreshed_list();
    let disk_info: Vec<DiskInfo> = disks
        .iter()
        .map(|disk| {
            let total = disk.total_space();
            let available = disk.available_space();
            let used = total - available;
            let percent = if total > 0 {
                (used as f32 / total as f32) * 100.0
            } else {
                0.0
            };

            DiskInfo {
                name: disk.name().to_string_lossy().to_string(),
                total_space: total,
                available_space: available,
                used_space: used,
                usage_percentage: percent,
            }
        })
        .collect();

    let os_name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let os_version = System::os_version().unwrap_or_else(|| "Unknown".to_string());
    let kernel_version = System::kernel_version().unwrap_or_else(|| "Unknown".to_string());

    SystemStats {
        cpu_usage,
        cpu_temp,
        memory_usage,
        memory_total,
        memory_used,
        disks: disk_info,
        os_name,
        os_version,
        kernel_version,
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct OAuthCallbackData {
    code: Option<String>,
    error: Option<String>,
}

#[tauri::command]
async fn start_oauth_listener(app: AppHandle) -> Result<String, String> {
    println!("Iniciando OAuth listener...");
    
    let server = match tiny_http::Server::http("127.0.0.1:3000") {
        Ok(s) => {
            println!("Servidor HTTP criado com sucesso na porta 3000");
            s
        }
        Err(e) => {
            eprintln!("Erro ao criar servidor HTTP: {}", e);
            return Err(format!("Não foi possível iniciar o servidor: {}", e));
        }
    };

    println!("OAuth listener iniciado em http://127.0.0.1:3000");
    
    // Aguarda um pouco para garantir que o servidor está pronto
    thread::sleep(Duration::from_millis(100));

    // Thread para tratar a callback OAuth
    let app_handle = app.clone();
    thread::spawn(move || {
        // Escuta por requisições (loop infinito)
        for request in server.incoming_requests() {
            let url_path = request.url();
            println!("Requisição recebida: {}", url_path);
            
            // Ignora requisições que não são para /callback
            if !url_path.starts_with("/callback") {
                println!("Ignorando requisição para: {}", url_path);
                let response = tiny_http::Response::from_string("Not Found")
                    .with_status_code(404);
                let _ = request.respond(response);
                continue;
            }
            
            let url_string = format!("http://127.0.0.1:3000{}", url_path);

            if let Ok(parsed_url) = url::Url::parse(&url_string) {
                println!("URL parseada com sucesso: {}", parsed_url);
                
                let mut callback_data = OAuthCallbackData {
                    code: None,
                    error: None,
                };

                for (key, value) in parsed_url.query_pairs() {
                    println!("Query param: {} = {}", key, value);
                    match key.as_ref() {
                        "code" => {
                            callback_data.code = Some(value.to_string());
                            println!("Código OAuth capturado: {}", value);
                        }
                        "error" => {
                            callback_data.error = Some(value.to_string());
                            eprintln!("Erro OAuth: {}", value);
                        }
                        _ => {}
                    }
                }

                // Resposta mínima - apenas fecha a janela
                let response_html = r#"<!DOCTYPE html><html><head><title></title><script>window.close();</script></head><body></body></html>"#;
                let response = tiny_http::Response::from_string(response_html)
                    .with_header(
                        tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..]).unwrap()
                    );
                let _ = request.respond(response);

                // Dispara evento para o frontend com dados do callback
                // No Tauri 2.0, usa Manager trait para acessar webview_windows e Emitter para emitir
                println!("Tentando emitir evento oauth-callback...");
                let mut emitted = false;
                for (_, window) in app_handle.webview_windows() {
                    match window.emit("oauth-callback", callback_data.clone()) {
                        Ok(_) => {
                            println!("Evento oauth-callback emitido com sucesso!");
                            emitted = true;
                        }
                        Err(e) => {
                            eprintln!("Erro ao emitir evento: {:?}", e);
                        }
                    }
                }
                
                if !emitted {
                    eprintln!("Nenhuma janela encontrada para emitir o evento");
                }

            } else {
                eprintln!("Erro ao fazer parse da URL: {}", url_string);
                let response = tiny_http::Response::from_string("Bad Request")
                    .with_status_code(400);
                let _ = request.respond(response);
            }
        }
    });

    Ok("OAuth listener iniciado".to_string())
}

#[tauri::command]
fn open_discord_oauth(client_id: String, redirect_uri: Option<String>) -> Result<(), String> {
    // IMPORTANTE: Este redirect_uri DEVE ser exatamente igual ao configurado no Discord Developer Portal
    let redirect_uri = redirect_uri.unwrap_or_else(|| "http://127.0.0.1:3000/callback".to_string());
    let auth_url = format!(
        "https://discord.com/api/oauth2/authorize?client_id={}&redirect_uri={}&response_type=code&scope=identify%20email",
        client_id,
        urlencoding::encode(&redirect_uri)
    );
    
    println!("Redirect URI configurado: {}", redirect_uri);

    println!("Tentando abrir URL: {}", auth_url);

    // Abre URL no navegador padrão
    match open::that(&auth_url) {
        Ok(_) => {
            println!("Navegador aberto com sucesso");
            Ok(())
        }
        Err(e) => {
            eprintln!("Erro ao abrir navegador: {}", e);
            Err(format!("Falha ao abrir o navegador: {}", e))
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            // Abre DevTools automaticamente apenas em modo debug
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                    println!("🔧 DevTools aberto automaticamente (modo debug)");
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            start_oauth_listener,
            open_discord_oauth
        ])
        .run(tauri::generate_context!())
        .expect("erro ao rodar aplicação tauri");
}