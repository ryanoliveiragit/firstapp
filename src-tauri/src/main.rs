// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{System, Components, Disks};
use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};
use tauri::Manager;

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

#[derive(Debug, Serialize, Deserialize, Clone)]
struct OAuthCallbackData {
    code: Option<String>,
    error: Option<String>,
}

#[tauri::command]
async fn start_oauth_listener(app: tauri::AppHandle) -> Result<String, String> {
    let server = tiny_http::Server::http("127.0.0.1:3000")
        .map_err(|e| format!("Failed to start server: {}", e))?;

    println!("OAuth listener started on http://127.0.0.1:3000");

    // Spawn a thread to handle the callback
    std::thread::spawn(move || {
        if let Ok(request) = server.recv() {
            let url_string = format!("http://127.0.0.1:3000{}", request.url());

            if let Ok(parsed_url) = url::Url::parse(&url_string) {
                let mut callback_data = OAuthCallbackData {
                    code: None,
                    error: None,
                };

                // Extract query parameters
                for (key, value) in parsed_url.query_pairs() {
                    match key.as_ref() {
                        "code" => callback_data.code = Some(value.to_string()),
                        "error" => callback_data.error = Some(value.to_string()),
                        _ => {}
                    }
                }

                // Send success response to browser
                let response_html = r#"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Autenticação Concluída</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            }
                            .container {
                                text-align: center;
                                background: white;
                                padding: 3rem;
                                border-radius: 1rem;
                                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                            }
                            h1 { color: #667eea; margin-bottom: 1rem; }
                            p { color: #666; }
                            .success { color: #10b981; font-size: 3rem; margin-bottom: 1rem; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="success">✓</div>
                            <h1>Autenticação Concluída!</h1>
                            <p>Você pode fechar esta janela e retornar ao aplicativo.</p>
                        </div>
                    </body>
                    </html>
                "#;

                let response = tiny_http::Response::from_string(response_html)
                    .with_header(
                        tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"text/html; charset=utf-8"[..]).unwrap()
                    );
                let _ = request.respond(response);

                // Emit event to frontend with the callback data
                let _ = app.emit("oauth-callback", callback_data);
            }
        }
    });

    Ok("OAuth listener started".to_string())
}

#[tauri::command]
fn open_github_oauth(client_id: String) -> Result<(), String> {
    let auth_url = format!(
        "https://github.com/login/oauth/authorize?client_id={}&redirect_uri=http://127.0.0.1:3000/callback&scope=user:email",
        client_id
    );

    // Open the URL in the default browser
    if let Err(e) = open::that(&auth_url) {
        return Err(format!("Failed to open browser: {}", e));
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            start_oauth_listener,
            open_github_oauth
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}