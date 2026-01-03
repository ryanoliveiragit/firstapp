// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, Components, Disks};
use serde::Serialize;
use std::sync::Arc;
use tauri::Manager;
use std::path::PathBuf;
use std::fs;

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

    // Aguardar um pouco para calcular o uso da CPU
    std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    let memory_usage = (memory_used as f32 / memory_total as f32) * 100.0;

    // Temperatura da CPU (se disponível)
    let components = Components::new_with_refreshed_list();
    let cpu_temp = components
        .iter()
        .find(|component| component.label().to_lowercase().contains("cpu"))
        .map(|component| component.temperature());

    // Informações dos discos
    let disks = Disks::new_with_refreshed_list();
    let disk_info: Vec<DiskInfo> = disks
        .iter()
        .map(|disk| {
            let total = disk.total_space();
            let available = disk.available_space();
            let used = total - available;
            let usage_percentage = if total > 0 {
                (used as f32 / total as f32) * 100.0
            } else {
                0.0
            };

            DiskInfo {
                name: disk.name().to_string_lossy().to_string(),
                total_space: total,
                available_space: available,
                used_space: used,
                usage_percentage,
            }
        })
        .collect();

    // Informações do sistema operacional
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

// Inicia servidor HTTP local para callbacks do Discord OAuth e serve a aplicação
fn start_oauth_server(app_handle: tauri::AppHandle) {
    std::thread::spawn(move || {
        let server = tiny_http::Server::http("127.0.0.1:1420").unwrap();
        println!("OAuth server and app running on http://127.0.0.1:1420");

        // Obtém o caminho dos recursos usando o Tauri
        let get_resource_path = |relative_path: &str| -> Option<PathBuf> {
            // Tenta via Tauri resource path (produção)
            if let Ok(resource_path) = app_handle.path().resource_dir() {
                let full_path = resource_path.join(relative_path);
                println!("Trying Tauri resource path: {:?}", full_path);
                if full_path.exists() {
                    println!("✓ Found via Tauri resource: {:?}", full_path);
                    return Some(full_path);
                }
            }

            // Fallback para caminho relativo (desenvolvimento)
            let local_path = PathBuf::from(relative_path);
            println!("Trying local path: {:?}", local_path);
            if local_path.exists() {
                println!("✓ Found via local path: {:?}", local_path);
                return Some(local_path);
            }

            // Fallback para caminho relativo à raiz do projeto
            let project_path = PathBuf::from("..").join(relative_path);
            println!("Trying project path: {:?}", project_path);
            if project_path.exists() {
                println!("✓ Found via project path: {:?}", project_path);
                return Some(project_path);
            }

            println!("✗ File not found: {}", relative_path);
            None
        };

        for request in server.incoming_requests() {
            let url = request.url().to_string();
            println!("\n📥 Request: {}", url);

            // Determina qual tipo de resposta enviar
            enum ResponseType {
                Callback,
                File(Vec<u8>, &'static str),
                Index(Vec<u8>),
                NotFound,
            }

            let response_type = if url.starts_with("/callback") {
                ResponseType::Callback
            } else {
                // Para qualquer outra rota, retorna uma mensagem informativa
                // A aplicação principal roda no Tauri, não aqui!
                ResponseType::NotFound
            };

            // Cria e envia a resposta baseado no tipo
            let response = match response_type {
                ResponseType::Callback => {
                    let html = r#"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Autenticação Discord</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 1rem;
                            backdrop-filter: blur(10px);
                        }
                        .spinner {
                            border: 3px solid rgba(255, 255, 255, 0.3);
                            border-radius: 50%;
                            border-top: 3px solid white;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 1rem;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="spinner"></div>
                        <h2>Autenticação bem-sucedida!</h2>
                        <p>Redirecionando...</p>
                    </div>
                    <script>
                        // Extrai o hash da URL (contém o access_token)
                        const hash = window.location.hash;

                        // Salva o token no localStorage para a aplicação Tauri acessar
                        if (hash) {
                            const params = new URLSearchParams(hash.substring(1));
                            const accessToken = params.get('access_token');
                            if (accessToken) {
                                localStorage.setItem('discord_callback_token', accessToken);
                            }
                        }

                        // Tenta abrir a aplicação Tauri
                        setTimeout(() => {
                            // Tenta fechar esta janela (callback)
                            window.close();

                            // Se não fechar, redireciona para localhost que vai abrir a app
                            setTimeout(() => {
                                window.location.href = 'http://localhost:1420/';
                            }, 500);
                        }, 1000);
                    </script>
                </body>
                </html>
                "#;
                    tiny_http::Response::from_string(html)
                        .with_header(
                            tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..]).unwrap()
                        )
                },
                ResponseType::File(content, content_type) => {
                    tiny_http::Response::from_data(content)
                        .with_header(
                            tiny_http::Header::from_bytes(&b"Content-Type"[..], content_type.as_bytes()).unwrap()
                        )
                },
                ResponseType::Index(content) => {
                    tiny_http::Response::from_data(content)
                        .with_header(
                            tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..]).unwrap()
                        )
                },
                ResponseType::NotFound => {
                    let html = r#"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>OAuth Callback Server</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background: #1a1a1a;
                            color: #fff;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✅ OAuth Callback Server Running</h1>
                        <p>This server is running to handle Discord OAuth callbacks.</p>
                        <p>Please use the Tauri application window instead.</p>
                    </div>
                </body>
                </html>
                "#;
                    tiny_http::Response::from_string(html)
                        .with_header(
                            tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..]).unwrap()
                        )
                },
            };

            let _ = request.respond(response);
        }
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_system_stats])
        .setup(|app| {
            // Inicia o servidor OAuth apenas em produção
            #[cfg(not(debug_assertions))]
            start_oauth_server(app.handle().clone());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
