if ((Test-Path -Path env:moss_personal_website_deploy_path) -eq $false) {
    Write-Host "Environment variable 'moss_personal_website_deploy_path' doesn't exist"

    return
}

if ((Test-Path -Path ".\\www") -eq $false) {
    Write-Host "Source directory doesn't exists. Build project first."

    return
}

$deployDir = (Get-Childitem env:moss_personal_website_deploy_path).Value

if ((Test-Path -Path $deployDir) -eq $false) {
    Write-Host "$deployDir doesn't exist"
}

Write-Host "Deleting files in $deployDir"
Get-ChildItem $deployDir | Remove-Item -Recurse -Force

Write-Host "Copying files to $deployDir"
Get-ChildItem ".\www" | Copy-Item -Destination $deployDir -recurse -Force
