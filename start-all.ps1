$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logs = Join-Path $root "logs"
New-Item -ItemType Directory -Force -Path $logs | Out-Null

function Stop-PortProcess {
  param([int]$Port)
  Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -gt 0 } |
    ForEach-Object {
      Write-Host "Stopping process on port $Port (PID $_)..."
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
}

function Wait-Http {
  param(
    [string]$Url,
    [string]$Name,
    [string]$LogFile
  )

  for ($i = 1; $i -le 45; $i++) {
    try {
      Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
      Write-Host "$Name ready: $Url"
      return
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  Write-Host "$Name did not start. Last log lines:"
  if (Test-Path $LogFile) {
    Get-Content -LiteralPath $LogFile -Tail 80
  }
  throw "$Name failed to start. Check $LogFile"
}

function Wait-Tcp {
  param(
    [int]$Port,
    [string]$Name,
    [string]$LogFile
  )

  for ($i = 1; $i -le 45; $i++) {
    $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
      Write-Host "$Name ready: http://localhost:$Port"
      return
    }
    Start-Sleep -Seconds 2
  }

  Write-Host "$Name did not start. Last log lines:"
  if (Test-Path $LogFile) {
    Get-Content -LiteralPath $LogFile -Tail 80
  }
  throw "$Name failed to start. Check $LogFile"
}

Write-Host "Checking local PostgreSQL..."
$pgService = Get-Service | Where-Object { $_.Name -like "postgresql*" -or $_.DisplayName -like "postgresql*" } | Select-Object -First 1
if ($pgService -and $pgService.Status -ne "Running") {
  Write-Host "Starting PostgreSQL Windows service: $($pgService.Name)"
  Start-Service $pgService.Name
}
Write-Host "PostgreSQL should be available on localhost:5432 with database/user girasol."

Stop-PortProcess -Port 4200
Stop-PortProcess -Port 8080

$backendLog = Join-Path $logs "backend.log"
$frontendLog = Join-Path $logs "frontend.log"
Remove-Item -LiteralPath $backendLog,$frontendLog -ErrorAction SilentlyContinue

Write-Host "Starting Spring Boot backend on http://localhost:8080 ..."
$backendCommand = "`$env:PATH='$env:SystemRoot\System32\WindowsPowerShell\v1.0;'+`$env:PATH; .\mvnw.cmd spring-boot:run *> '$backendLog'"
Start-Process -FilePath "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
  -WindowStyle Hidden `
  -WorkingDirectory "$root\backend" `
  -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand

Write-Host "Installing frontend dependencies if needed..."
if (-not (Test-Path "$root\frontend\node_modules")) {
  Push-Location "$root\frontend"
  npm install
  Pop-Location
}

Write-Host "Starting Angular frontend on http://localhost:4200 ..."
$frontendCommand = "npm start -- --host 127.0.0.1 --port 4200 *> '$frontendLog'"
Start-Process -FilePath "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
  -WindowStyle Hidden `
  -WorkingDirectory "$root\frontend" `
  -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $frontendCommand

Wait-Http -Url "http://localhost:8080/actuator/health" -Name "Backend" -LogFile $backendLog
Wait-Tcp -Port 4200 -Name "Frontend" -LogFile $frontendLog

Write-Host "Done."
Write-Host "Frontend: http://localhost:4200"
Write-Host "Backend: http://localhost:8080"
Write-Host "Swagger: http://localhost:8080/swagger-ui.html"
Write-Host "Logs: $logs"
