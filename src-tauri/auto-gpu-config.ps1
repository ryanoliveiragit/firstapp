# This script configures the GPU preference for the packaged application on Windows.
# It mirrors the setup expected by the Tauri bundler when GPU tuning is enabled.
# By default it targets `firstapp.exe` that sits next to this script, but you can
# override the target executable or preference via parameters.
#
# Examples:
#   powershell.exe -ExecutionPolicy Bypass -File .\\auto-gpu-config.ps1
#   powershell.exe -ExecutionPolicy Bypass -File .\\auto-gpu-config.ps1 -ExecutablePath \"C:\\Path\\to\\firstapp.exe\" -Preference high-performance
#
# Preference values map to:
#   - system: let Windows decide
#   - power-saving: prefer the integrated GPU
#   - high-performance: prefer the discrete GPU

param(
  [Parameter(Mandatory = $false)]
  [string]$ExecutablePath,
  [Parameter(Mandatory = $false)]
  [ValidateSet("system", "power-saving", "high-performance")]
  [string]$Preference = "high-performance"
)

$registryPath = "HKCU:\\Software\\Microsoft\\DirectX\\UserGpuPreferences"

# If no path is provided, assume the built binary lives next to this script.
if ([string]::IsNullOrWhiteSpace($ExecutablePath)) {
  $ExecutablePath = Join-Path -Path (Split-Path -Parent $PSCommandPath) -ChildPath "firstapp.exe"
}

if (-not (Test-Path $ExecutablePath)) {
  Write-Error "Executable '$ExecutablePath' was not found. Provide a valid path with -ExecutablePath."
  exit 1
}

if (-not (Test-Path $registryPath)) {
  New-Item -Path $registryPath -Force | Out-Null
}

$resolvedPath = (Resolve-Path $ExecutablePath).ProviderPath
$preferenceCode = switch ($Preference) {
  "power-saving"    { 1 }
  "high-performance" { 2 }
  default           { 0 }
}
$entryValue = "GpuPreference=$preferenceCode;"

New-ItemProperty -Path $registryPath -Name $resolvedPath -Value $entryValue -PropertyType String -Force | Out-Null

Write-Output "Configured GPU preference '$Preference' for $resolvedPath."
