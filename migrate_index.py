import os
import shutil

target_dir = r"\\ffc.local\DFS\RedirectedFolders\zachs\Desktop\testsite"

index_path = os.path.join(target_dir, 'index.html')
map_path = os.path.join(target_dir, 'map.html')

if os.path.exists(index_path):
    os.remove(index_path)

if os.path.exists(map_path):
    os.rename(map_path, index_path)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        if 'map.html' in content:
            content = content.replace('map.html', 'index.html')
            modified = True
        
        if 'background2.png' in content:
            content = content.replace('background2.png', 'background1.png')
            modified = True
            
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.html') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            process_file(filepath)

print("Migration completed successfully.")
