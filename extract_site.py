import os
import json
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = []
    def handle_data(self, d):
        stripped = d.strip()
        if stripped:
            self.text.append(stripped)
    def get_data(self):
        return '\n'.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

base_dir = r"c:\Users\boyoc\Desktop\HUMANISATION CLAUDE\site-compagnon"

html_files = [
    "index.html", "conversations.html", "outils.html", "disciplines.html",
    "formation.html", "ethique.html", "debuter.html", "lexique.html",
    "comparatif-ia.html", "chatbot.html", "a-propos.html", "veille.html"
]

output_file = os.path.join(base_dir, "audit_site_complet.md")

with open(output_file, 'w', encoding='utf-8') as out:
    out.write("# Audit Complet du Site Compagnon\n\n")
    
    out.write("## Pages HTML\n\n")
    for file in html_files:
        filepath = os.path.join(base_dir, file)
        if os.path.exists(filepath):
            out.write(f"### {file}\n\n")
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Split at <main> or <body>
                if '<main' in content:
                    content = content.split('<main', 1)[1]
                    if '</main>' in content:
                        content = content.split('</main>', 1)[0]
                text = strip_tags(content)
                out.write(text + "\n\n")
        else:
            out.write(f"Fichier {file} introuvable.\n\n")

    out.write("\n## Base de données des Prompts (data/prompts.json)\n\n")
    json_path = os.path.join(base_dir, "data", "prompts.json")
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            prompts = json.load(f)
            for p in prompts:
                out.write(f"### {p.get('id', '')} - {p.get('title', '')}\n")
                out.write(f"- **Partie**: {p.get('part', '')}\n")
                out.write(f"- **Chapitre**: {p.get('chapter', '')}\n")
                out.write(f"- **Sujet**: {p.get('subject', '')}\n")
                out.write(f"- **Contenu**: {p.get('content', '')}\n")
                if 'structure' in p:
                    out.write(f"- **Structure**: {json.dumps(p.get('structure', {}), ensure_ascii=False)}\n")
                out.write("\n")

print(f"Audit généré dans {output_file}")
