# Publish to GitHub + GitHub Pages
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
  Write-Error "GitHub CLI (gh) not found. Install: winget install GitHub.cli"
}

gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Login required. Complete the browser/device flow when prompted."
  gh auth login --hostname github.com --git-protocol https --web
}

$owner = gh api user -q .login
Write-Host "GitHub user: $owner"

$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create 3kv --public --description "Withstand voltage test portal (secondary windings)" --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "Enable GitHub Pages (workflow) if first deploy:"
Write-Host "  https://github.com/$owner/3kv/settings/pages"
Write-Host "  Source: GitHub Actions"
Write-Host ""
Write-Host "Live URL (after workflow finishes):"
Write-Host "  https://$owner.github.io/3kv/"
