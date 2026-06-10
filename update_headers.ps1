Write-Host "Updating root HTML files..."
$rootFiles = Get-ChildItem -Path . -Filter *.html
foreach ($file in $rootFiles) {
    if ($file.Name -eq "map.html" -or $file.Name -eq "training.html") { continue }
    $content = Get-Content $file.FullName -Raw
    if ($content -match '<header class="site-header">') {
        $newContent = $content -replace '(?s)<header class="site-header">.*?</header>', "<script src=`"assets/js/header.js`"></script>`r`n    <script>renderHeader('');</script>"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "  Updated $($file.Name)"
    }
}

Write-Host "Updating sub-page HTML files..."
$pageFiles = Get-ChildItem -Path .\pages -Filter *.html
foreach ($file in $pageFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match '<header class="site-header">') {
        $newContent = $content -replace '(?s)<header class="site-header">.*?</header>', "<script src=`"../assets/js/header.js`"></script>`r`n    <script>renderHeader('../');</script>"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "  Updated pages\$($file.Name)"
    }
}

Write-Host "Done!"
