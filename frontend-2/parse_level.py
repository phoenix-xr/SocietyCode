import re

with open('src/Game.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('const LevelConfig = {')
end_idx = code.find('};', start_idx) + 1
config_str = code[start_idx:end_idx]

import ast
# We can find all {"type": "block", ... "y": ...} with regex
items = re.findall(r'\{\s*"type"\s*:\s*"(?:block|hardblock)"[^}]*"y"\s*:\s*(\d+)[^}]*\}', config_str)
print("Block Ys:", set(items))

# Let's find ALL types and their Ys
all_items = re.findall(r'\{\s*"type"\s*:\s*"([^"]+)"[^}]*"y"\s*:\s*(\d+)[^}]*\}', config_str)
types_ys = set(all_items)
print("All items Ys:", types_ys)
