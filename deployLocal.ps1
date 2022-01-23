if ((Test-Path -Path env:personal_website_deploy_dir) -eq $false) {
    Write-Host "Environment variable personal_website_deploy_dir doesn't exist"

    return
}

if ((Test-Path -Path ".\\www") -eq $false) {
    Write-Host "Source directory doesn't exists. Build project first."

    return
}

$deployDir = (Get-Childitem env:personal_website_deploy_dir).Value

if ((Test-Path -Path $deployDir) -eq $false) {
    Write-Host "$deployDir doesn't exist"
}

Write-Host "Deleting files in $deployDir"
Get-ChildItem $deployDir | Remove-Item -Recurse -Force

Write-Host "Copying files to $deployDir"
Get-ChildItem ".\www" | Copy-Item -Destination $deployDir -recurse -Force
