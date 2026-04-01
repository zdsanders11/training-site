$folder = "\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite"
$pages = Get-ChildItem -Path "$folder\pages" -Filter "*.html" | Select-Object -ExpandProperty FullName
$filesToFix = @($pages)
$filesToFix += "$folder\expo.html"
$filesToFix += "$folder\lobby.html"

$count = 0
foreach ($filePath in $filesToFix) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $modified = $false
        
        # Decide the script path based on if the file is nested in /pages/
        if ($filePath -like "*\pages\*") {
            $scriptPath = "../assets/js/search.js"
        }
        else {
            $scriptPath = "assets/js/search.js"
        }
        
        # Inject the Search Bar container HTML right after <nav class="nav">
        if ($content -notmatch "search-container") {
            $searchHtml = "`n      <div class=`"search-container`">`n        <input type=`"text`" id=`"searchInput`" class=`"search-input`" placeholder=`"Search`" autocomplete=`"off`">`n        <div id=`"searchResults`" class=`"search-results`"></div>`n      </div>"
            $content = $content -replace '(<nav class="nav">)', "`$1$searchHtml"
            $modified = $true
        }
        
        # Inject the search.js script at the very bottom right before </body>
        if ($content -notmatch "search\.js") {
            $content = $content -replace '(</body>)', "<script src=`"$scriptPath`"></script>`n  `$1"
            $modified = $true
        }
        
        # Write back changes
        if ($modified) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
            $count++
        }
    }
}

Write-Host "---------------------------------------------------"
Write-Host "Success! Injected search bar into $count HTML files."
Write-Host "---------------------------------------------------"
Read-Host "Press Enter to exit..."
