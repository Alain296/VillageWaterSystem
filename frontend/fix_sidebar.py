import sys

path = r"d:\Desktop\VillageWaterSystem\frontend\src\styles\styles.css"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Sidebar Background
text = text.replace(
    ".sidebar {\n  width: 280px;\n  background: var(--bg-black);\n  border-right: 1px solid var(--border-cyan);",
    ".sidebar {\n  width: 280px;\n  background: #0F172A; /* Modern Dark Slate Sidebar */\n  border-right: none;"
)

# Sidebar Background fallback for different spacing
text = text.replace(
    ".sidebar {\n  width: 280px;\n  background: var(--surface);\n  border-right: 1px solid var(--border);",
    ".sidebar {\n  width: 280px;\n  background: #0F172A; /* Modern Dark Slate Sidebar */\n  border-right: none;"
)

# Let's just use direct substring replacement to make sure we catch it:
text = text.replace("background: var(--bg-black);\n  border-right: 1px solid var(--border-cyan);\n  display: flex;", "background: #0F172A;\n  border-right: none;\n  display: flex;")
text = text.replace("background: var(--surface);\n  border-right: 1px solid var(--border);\n  display: flex;", "background: #0F172A;\n  border-right: none;\n  display: flex;")

text = text.replace(
    ".sidebar-header {\n  padding: var(--spacing-xl);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  border-bottom: 1px solid var(--border);\n}",
    ".sidebar-header {\n  padding: var(--spacing-xl);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}"
)

text = text.replace(
    ".sidebar-title h2 {\n  font-size: 1.25rem;\n  font-weight: 800;\n  color: var(--text-white);\n  line-height: 1.2;\n}",
    ".sidebar-title h2 {\n  font-size: 1.25rem;\n  font-weight: 800;\n  color: #FFFFFF;\n  line-height: 1.2;\n}"
)

text = text.replace(
    ".sidebar-title span {\n  font-size: 0.75rem;\n  color: var(--text-medium);\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}",
    ".sidebar-title span {\n  font-size: 0.75rem;\n  color: #94A3B8;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}"
)

text = text.replace(
    ".nav-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  color: var(--text-light);\n",
    ".nav-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  color: #CBD5E1;\n"
)
text = text.replace(  # Alternative match just in case
    ".nav-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  color: var(--text-primary);\n",
    ".nav-item {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  padding: var(--spacing-md) var(--spacing-lg);\n  color: #CBD5E1;\n"
)

text = text.replace(
    ".nav-item:hover {\n  background: var(--overlay-cyan);\n  color: var(--cyan);\n",
    ".nav-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n  color: #FFFFFF;\n"
)

text = text.replace(
    ".nav-item.active {\n  background: var(--gradient-primary);\n  color: var(--text-white);\n",
    ".nav-item.active {\n  background: var(--gradient-primary);\n  color: #FFFFFF;\n"
)
text = text.replace(
    ".nav-item.active {\n  background: var(--gradient-primary);\n  color: var(--text-heading);\n",
    ".nav-item.active {\n  background: var(--gradient-primary);\n  color: #FFFFFF;\n"
)

text = text.replace(
    ".sidebar-footer {\n  padding: var(--spacing-lg);\n  border-top: 1px solid var(--border);\n}",
    ".sidebar-footer {\n  padding: var(--spacing-lg);\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n}"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("SIDEBAR SCRIPT DONE")
