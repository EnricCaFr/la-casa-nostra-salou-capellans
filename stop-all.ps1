$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Stopping Angular and Spring Boot processes started from this project when possible..."
foreach ($port in 4200, 8080) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -gt 0 } |
    ForEach-Object {
      Write-Host "Stopping process on port $port (PID $_)..."
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
}

Get-CimInstance Win32_Process |
  Where-Object {
    ($_.CommandLine -like "*ng serve*" -or
     $_.CommandLine -like "*npm start*" -or
     $_.CommandLine -like "*spring-boot:run*" -or
     $_.CommandLine -like "*frontend\node_modules\@angular*" -or
     $_.CommandLine -like "*backend*restaurant*")
  } |
  ForEach-Object {
    Write-Host "Stopping PID $($_.ProcessId)..."
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

Write-Host "PostgreSQL local service is left running."
