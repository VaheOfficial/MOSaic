Param(
  [switch]$Detach
)

$composeFiles = "-f docker-compose.yml -f docker-compose.dev.yml"
$command = "docker compose $composeFiles up --build"
if ($Detach) {
  $command += " -d"
}

Write-Host "Running: $command"
Invoke-Expression $command

