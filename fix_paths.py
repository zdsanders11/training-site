import glob
import os

path = r"\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite\pages\*.html"
files = glob.glob(path)

count = 0
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    # Replace map.html paths
    content = content.replace('href="map.html', 'href="../map.html')
    content = content.replace('href="/map.html', 'href="../map.html')
    # Replace images
    content = content.replace('src="/images/', 'src="../images/')
    # Replace expo/lobby paths
    content = content.replace('href="/expo.html', 'href="../expo.html')
    content = content.replace('href="/lobby.html', 'href="../lobby.html')
    content = content.replace('href="expo.html', 'href="../expo.html')
    content = content.replace('href="lobby.html', 'href="../lobby.html')

    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1

print(f"Success! Updated {count} HTML files in pages/.")
