import os
import re
import json
from collections import defaultdict

print(">>> ARCHITECTURE ANALYZER v2.0 (DEBUG MODE) <<<")

# --- CONFIGURATION ---
SEARCH_ROOT = "research/awesome-sites"
OUTPUT_FILE = "docs/research/matrix/architecture_analysis.json"
REPORT_FILE = "docs/research/matrix/tech-stack-comparison.md"

# --- PATTERNS ---
PATTERNS = {
    "GAME_LOOP": {
        "RAF": r"requestAnimationFrame",
        "Tick": r"tick\s*(",
        "Delta": r"delta",
        "Clock": r"THREE\.Clock",
        "FixedStep": r"fixedStep",
    },
    "PHYSICS": {
        "Cannon": r"cannon",
        "Matter": r"matter",
        "Oimo": r"oimo",
        "Rapier": r"rapier",
        "Ammo": r"ammo",
        "Verlet": r"verlet",
    },
    "CAMERA_RIG": {
        "OrbitControls": r"OrbitControls",
        "FlyControls": r"FlyControls",
        "PointerLock": r"PointerLock",
        "CatmullRom": r"CatmullRomCurve3",
        "Spline": r"Spline",
        "Lerp": r"lerp",
        "Damp": r"damp",
        "LookAt": r"lookAt",
    },
    "STATE_MANAGEMENT": {
        "Redux": r"redux",
        "Zustand": r"zustand",
        "Context": r"createContext",
        "Store": r"store",
        "Signal": r"signal",
        "EventEmitter": r"EventEmitter",
        "PubSub": r"PubSub",
    },
    "RENDER_LOOP": {
        "PostProcessing": r"EffectComposer",
        "FBO": r"WebGLRenderTarget",
        "Instancing": r"InstancedMesh",
        "Worker": r"Worker",
        "Offscreen": r"OffscreenCanvas",
    }
}

# --- ANALYSIS ENGINE ---

def analyze_file(filepath):
    """Scans a single file for all patterns."""
    findings = defaultdict(list)
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
            # Check package.json for explicit dependencies
            if filepath.endswith('package.json'):
                try:
                    data = json.loads(content)
                    deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
                    for dep in deps:
                        findings["DEPENDENCIES"].append(f"{dep}")
                except:
                    pass
                return findings

            # Scan code files
            for category, regex_map in PATTERNS.items():
                for key, pattern in regex_map.items():
                    try:
                        if re.search(pattern, content, re.IGNORECASE):
                            findings[category].append(key)
                    except Exception as e:
                        pass
                        
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    
    return findings

def analyze_project(project_path):
    """Aggregates findings for a specific project folder."""
    project_summary = {
        "name": os.path.basename(project_path),
        "path": project_path,
        "features": defaultdict(set),
        "dependencies": set()
    }
    
    print(f"Analyzing {project_path}...")
    
    for root, dirs, files in os.walk(project_path):
        # Skip node_modules and assets
        if 'node_modules' in root or 'assets' in root:
            continue
            
        for file in files:
            if file.endswith(('.js', '.ts', '.jsx', '.tsx', '.json', '.html')):
                filepath = os.path.join(root, file)
                file_findings = analyze_file(filepath)
                
                for category, hits in file_findings.items():
                    if category == "DEPENDENCIES":
                        project_summary["dependencies"].update(hits)
                    else:
                        # CRITICAL FIX HERE:
                        project_summary["features"][category].update(hits)

    # Convert sets to lists
    project_summary["features"] = {k: list(v) for k, v in project_summary["features"].items()}
    project_summary["dependencies"] = list(project_summary["dependencies"])
    
    return project_summary

def main():
    results = []
    
    if not os.path.exists(SEARCH_ROOT):
        print(f"Search root {SEARCH_ROOT} not found.")
        return

    for pack in os.listdir(SEARCH_ROOT):
        pack_path = os.path.join(SEARCH_ROOT, pack)
        if not os.path.isdir(pack_path): continue
        
        for category in os.listdir(pack_path):
            cat_path = os.path.join(pack_path, category)
            if not os.path.isdir(cat_path) or category.startswith('.'): continue
            
            for project in os.listdir(cat_path):
                proj_path = os.path.join(cat_path, project)
                if os.path.isdir(proj_path):
                    analysis = analyze_project(proj_path)
                    results.append(analysis)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(results, f, indent=2)
        
    print(f"Analysis complete. Raw data saved to {OUTPUT_FILE}")
    generate_markdown_report(results)

def generate_markdown_report(results):
    with open(REPORT_FILE, 'w') as f:
        f.write("# AwesomeSites Architectural Analysis\n\n")
        f.write("| Project | Physics | Camera Logic | Loop/Time | State | Rendering | Dependencies |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
        
        for p in results:
            feats = p['features']
            physics = ", ".join(feats.get('PHYSICS', ['-']))
            camera = ", ".join(feats.get('CAMERA_RIG', ['-']))
            loop = ", ".join(feats.get('GAME_LOOP', ['-']))
            state = ", ".join(feats.get('STATE_MANAGEMENT', ['-']))
            render = ", ".join(feats.get('RENDER_LOOP', ['-']))
            deps = p['dependencies'][:5]
            if len(p['dependencies']) > 5: deps.append("...")
            dep_str = ", ".join(deps)
            
            f.write(f"| **{p['name']}** | {physics} | {camera} | {loop} | {state} | {render} | {dep_str} |\n")
            
    print(f"Markdown report generated at {REPORT_FILE}")

if __name__ == "__main__":
    main()
