# Root HTML files
$rootFiles = Get-ChildItem -Path "\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite" -Filter "*.html"
$rootCount = 0
foreach ($file in $rootFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        if ($content -notmatch "nav-active.js") {
            if ($content -match "</body>") {
                $content = $content -replace "</body>", "<script src=`"assets/js/nav-active.js`"></script>`n  </body>"
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
                $rootCount++
            }
        }
    } catch {
        Write-Warning "Failed to process $($file.Name): $_"
    }
}

# Subfolder HTML files
$pageFiles = Get-ChildItem -Path "\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite\pages" -Filter "*.html"
$pageCount = 0
foreach ($file in $pageFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        if ($content -notmatch "nav-active.js") {
            if ($content -match "</body>") {
                $content = $content -replace "</body>", "<script src=`"../assets/js/nav-active.js`"></script>`n  </body>"
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
                $pageCount++
            }
        }
    } catch {
        Write-Warning "Failed to process $($file.Name): $_"
    }
}
Write-Host "Success! Injected script into $rootCount root HTML files and $pageCount HTML files in pages/."
