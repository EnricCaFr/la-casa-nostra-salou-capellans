$ErrorActionPreference = "Stop"

Write-Host "Preparing local PostgreSQL database for Restaurante Girasol..."

$psqlCommand = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCommand) {
  $psql = $psqlCommand.Source
} else {
  $candidate = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter psql.exe -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\bin\psql.exe" } |
    Sort-Object FullName -Descending |
    Select-Object -First 1

  if (-not $candidate) {
    throw "psql.exe was not found. Install PostgreSQL or add its bin folder to PATH, for example: C:\Program Files\PostgreSQL\16\bin"
  }

  $psql = $candidate.FullName
  Write-Host "Found psql at: $psql"
}

$adminUser = Read-Host "PostgreSQL admin user [postgres]"
if ([string]::IsNullOrWhiteSpace($adminUser)) {
  $adminUser = "postgres"
}

if ($adminUser -eq "girasol") {
  Write-Warning "Use an existing PostgreSQL admin user here, normally 'postgres'. The 'girasol' user is created by this script."
}

$sql = @"
do
`$`$
begin
   if not exists (select from pg_catalog.pg_roles where rolname = 'girasol') then
      create role girasol login password 'girasol';
   end if;
end
`$`$;

select 'create database girasol owner girasol'
where not exists (select from pg_database where datname = 'girasol')\gexec

grant all privileges on database girasol to girasol;
"@

$tmp = New-TemporaryFile
try {
  Set-Content -LiteralPath $tmp -Value $sql -Encoding ASCII
  & $psql -h localhost -U $adminUser -d postgres -v ON_ERROR_STOP=1 -f $tmp
  if ($LASTEXITCODE -ne 0) {
    throw "psql failed with exit code $LASTEXITCODE. The database was not prepared."
  }
  Write-Host "Done. Database: girasol | User: girasol | Password: girasol | Host: localhost:5432"
} finally {
  Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue
}
