$ErrorActionPreference = "Stop"

# Get the project root from current working directory (set by npm)
$projectRoot = Get-Location

# Construct the vite path
$nodeModulesBin = Join-Path $projectRoot "node_modules"
$nodeModulesBin = Join-Path $nodeModulesBin ".bin"
$vitePath = Join-Path $nodeModulesBin "vite.cmd"

if (-not (Test-Path $vitePath)) {
    Write-Error "Vite not found. Please run npm install first."
    Write-Error "Looking for: $vitePath"
    exit 1
}

# Get all arguments passed to this script
$scriptArgs = $args

if ($scriptArgs.Count -eq 0) {
    & $vitePath
} else {
    & $vitePath @scriptArgs
}

