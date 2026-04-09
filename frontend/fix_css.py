import sys

path = r"d:\Desktop\VillageWaterSystem\frontend\src\styles\styles.css"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update :root variables entirely
start = text.find(':root {')
end = text.find('  /* Shadows */')
old_root = text[start:end]

new_root = """:root {
  /* Primary Professional Colors - Royal Blue & Indigo */
  --cyan: #2563EB;
  --purple: #1E40AF;
  --gradient-primary: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  
  /* Light Backgrounds */
  --bg-black: #FFFFFF;
  --bg-dark: #F8FAFC;
  --bg-card: #FFFFFF;
  --bg-card-hover: #F1F5F9;
  
  /* Text Colors */
  --text-white: #0F172A; /* Inverted for light theme */
  --text-light: #64748B;
  --text-medium: #475569;
  --text-heading: #0F172A;
  
  /* Borders & Overlays */
  --border-cyan: rgba(37, 99, 235, 0.2);
  --border-purple: rgba(30, 64, 175, 0.2);
  --overlay-cyan: rgba(37, 99, 235, 0.05);
  --overlay-purple: rgba(30, 64, 175, 0.05);
  
  /* Legacy Support */
  --primary: #2563EB;
  --primary-dark: #1E40AF;
  --primary-light: #60A5FA;
  
  /* Secondary Colors */
  --secondary: #4F46E5;
  --secondary-dark: #3730A3;
  --secondary-light: #818CF8;
  
  /* Accent Colors */
  --accent: #2563EB;
  --accent-dark: #1E40AF;
  --accent-light: #60A5FA;
  
  /* Status Colors */
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --info: #3B82F6;
  
  /* Neutral Colors */
  --background: #EBEDF3;
  --surface: #FFFFFF;
  --surface-dark: #F8FAFC;
  --border: #E2E8F0;
  --text-primary: #1E293B;
  --text-secondary: #475569;
  
"""
text = text.replace(old_root, new_root)

# 2. Targeted Substitutions
replaces = [
    ("background-color: #0F172A;", "background-color: var(--background);"),
    ("color: #D1D5DB;", "color: var(--text-primary);"),
    ("color: #9CA3AF;", "color: var(--text-secondary);"),
    ("background: #1F2937;", "background: var(--surface);"),
    ("background: #000000;", "background: var(--surface);"),
    ("background: rgba(15, 23, 42, 0.8);", "background: rgba(255, 255, 255, 0.95);"),
    ("border: 1px solid rgba(6, 182, 212, 0.2);", "border: 1px solid var(--border);"),
    ("border: 2px solid rgba(6, 182, 212, 0.3);", "border: 1px solid var(--border);"),
    ("border-bottom: 1px solid rgba(6, 182, 212, 0.2);", "border-bottom: 1px solid var(--border);"),
    ("background: #374151;", "background: var(--surface);"),
    ("color: #FFFFFF;", "color: var(--text-heading);"),
    ("background: linear-gradient(135deg, #06B6D4 0%, #9333EA 100%);", "background: var(--gradient-primary);")
]

for old, new in replaces:
    text = text.replace(old, new)

# 3. Explicit UI components that need dark text due to moving to light mode
text = text.replace(".navbar-brand {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  color: white;", ".navbar-brand {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  color: var(--text-heading);")
text = text.replace(".navbar-user {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  color: white;", ".navbar-user {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  color: var(--text-heading);")
text = text.replace(".navbar-link {\n  color: #D1D5DB;", ".navbar-link {\n  color: var(--text-primary);")
text = text.replace(".navbar-link.active {\n  background: rgba(255, 255, 255, 0.2);\n  color: white;", ".navbar-link.active {\n  background: var(--overlay-cyan);\n  color: var(--primary);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS")
