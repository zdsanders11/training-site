$files = Get-ChildItem -Path "\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite\pages" -Filter "*.html"

$count = 0
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $original = $content
        
        if ($content -notmatch 'class="header-divider"') {
            $content = $content.Replace('<header class="site-header">', "<div class=`"header-divider`"> </div>`n    <header class=`"site-header`">")
            
            if ($content -ne $original) {
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
                $count++
            }
        }
    } catch {
        Write-Warning "Failed to process $($file.Name): $_"
    }
}

Write-Host "Success! Added header-divider to $count HTML files in pages/."
