import re
import os

def extract_shaders(file_path, output_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find string literals (simple approximation)
    # Looking for backtick strings (often used for shaders) or quotes
    # This is a heuristic.
    
    # Pattern for backticks which often hold multiline shaders in modern JS
    backtick_pattern = re.compile(r'`([^`]*)`')
    
    # Pattern for quote strings
    quote_pattern = re.compile(r'"([^"]*)"')
    
    matches = []
    
    # Check backticks first (most likely for full shaders)
    for match in backtick_pattern.findall(content):
        if "void main" in match or "gl_Position" in match or "varying vec" in match:
            matches.append(match)

    # Check quotes (minified often converts to quotes)
    # We look for \n or \t escaped in minified strings if they were shaders
    for match in quote_pattern.findall(content):
        # Unescape common shader chars
        s = match.replace('\\n', '\n').replace('\\t', '\t')
        if "void main" in s or "gl_Position" in s or "varying vec" in s:
            matches.append(s)

    with open(output_path, 'w', encoding='utf-8') as f:
        for i, shader in enumerate(matches):
            f.write(f"// --- SHADER {i} ---\\n")
            f.write(shader)
            f.write("\\n\\n")

    print(f"Extracted {len(matches)} potential shaders to {output_path}")

# Run for Samsy
extract_shaders(
    'research/awesome-sites/Pack06/metaverse/samsy.ninja/assets/js/main-BAxw1krX.js',
    'research/samsy_shaders.glsl'
)

# Run for Bruno
extract_shaders(
    'research/awesome-sites/Pack01/portfolio/bruno-simon.com/bundle.4134f01dbc2a56cff378.js',
    'research/bruno_shaders.glsl'
)
