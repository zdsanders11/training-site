$files = Get-ChildItem -Path "\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite\pages" -Filter "*.html"

$count = 0
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $original = $content
        
        $content = $content.Replace('href="map.html', 'href="../map.html')
        $content = $content.Replace('href="/map.html', 'href="../map.html')
        $content = $content.Replace('src="/images/', 'src="../images/')
        $content = $content.Replace('href="/expo.html', 'href="../expo.html')
        $content = $content.replace('href="/lobby.html', 'href="../lobby.html')
        $content = $content.Replace('href="expo.html', 'href="../expo.html')
        $content = $content.Replace('href="lobby.html', 'href="../lobby.html')
        
        if ($content -ne $original) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
            $count++
        }
    } catch {
        Write-Warning "Failed to process $($file.Name): $_"
    }
}

Write-Host "Success! Updated $count HTML files in pages/."
