#!/usr/bin/env python3
"""
Module d'envoi d'email pour le récap mensuel
=============================================
Utilise SendGrid pour envoyer le digest par email.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

# Configuration
from config import (
    RECIPIENT_EMAIL, SENDER_EMAIL, SENDGRID_API_KEY,
    EMAIL_SUBJECT_TEMPLATE, EMAIL_INTRO_TEMPLATE, EMAIL_OUTRO_TEMPLATE
)

# SendGrid
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email, To, Content
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False
    print("⚠️ SendGrid non installé. Exécutez: pip install sendgrid")


def get_month_name_fr(month: int) -> str:
    """Retourne le nom du mois en français."""
    months = [
        "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ]
    return months[month]


def markdown_to_html(markdown_text: str) -> str:
    """
    Convertit le Markdown en HTML simple.
    (Version basique, suffisante pour les emails)
    """
    import re
    
    html = markdown_text
    
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Italic
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Code inline
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
    
    # Links
    html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)
    
    # Blockquotes
    html = re.sub(r'^> (.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
    
    # Horizontal rules
    html = re.sub(r'^---+$', r'<hr>', html, flags=re.MULTILINE)
    
    # Line breaks
    html = html.replace('\n\n', '</p><p>')
    html = f'<p>{html}</p>'
    
    # Tables (basique)
    lines = html.split('\n')
    in_table = False
    new_lines = []
    
    for line in lines:
        if '|' in line and not line.strip().startswith('|--'):
            if not in_table:
                new_lines.append('<table border="1" cellpadding="5">')
                in_table = True
            cells = [c.strip() for c in line.split('|')[1:-1]]
            row = '<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>'
            new_lines.append(row)
        elif line.strip().startswith('|--'):
            continue  # Skip separator lines
        else:
            if in_table:
                new_lines.append('</table>')
                in_table = False
            new_lines.append(line)
    
    if in_table:
        new_lines.append('</table>')
    
    html = '\n'.join(new_lines)
    
    return html


def create_html_email(digest_content: str, tool_count: int) -> str:
    """Crée le contenu HTML de l'email."""
    now = datetime.now()
    month = get_month_name_fr(now.month)
    
    html_body = markdown_to_html(digest_content)
    
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
        }}
        h2 {{
            color: #1e40af;
            margin-top: 30px;
        }}
        h3 {{
            color: #3b82f6;
        }}
        blockquote {{
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 10px 20px;
            margin: 20px 0;
        }}
        code {{
            background: #e5e7eb;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
        }}
        a {{
            color: #2563eb;
        }}
        hr {{
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
        }}
        td, th {{
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <div class="container">
        {html_body}
        <div class="footer">
            <p>📧 Ce récap a été généré automatiquement par votre agent de veille IA.</p>
            <p>Pour modifier les critères, éditez <code>config.py</code> dans le repository GitHub.</p>
        </div>
    </div>
</body>
</html>
"""
    return html


def send_email_sendgrid(subject: str, html_content: str, text_content: str) -> bool:
    """Envoie l'email via SendGrid."""
    if not SENDGRID_AVAILABLE:
        print("❌ SendGrid n'est pas installé")
        return False
    
    if not SENDGRID_API_KEY:
        print("❌ SENDGRID_API_KEY non configurée")
        print("   Ajoutez-la comme secret GitHub ou variable d'environnement")
        return False
    
    try:
        message = Mail(
            from_email=Email(SENDER_EMAIL, "Veille Outils IA"),
            to_emails=To(RECIPIENT_EMAIL),
            subject=subject,
            plain_text_content=Content("text/plain", text_content),
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"✅ Email envoyé! Status: {response.status_code}")
        return response.status_code in [200, 201, 202]
        
    except Exception as e:
        print(f"❌ Erreur envoi email: {e}")
        return False


def send_digest(digest_path: str, tool_count: int) -> bool:
    """
    Envoie le digest par email.
    
    Args:
        digest_path: Chemin vers le fichier digest .md
        tool_count: Nombre d'outils dans le digest
    
    Returns:
        True si l'envoi a réussi
    """
    print("\n" + "=" * 50)
    print("📬 Envoi du récapitulatif par email")
    print("=" * 50)
    
    # Lire le contenu du digest
    digest_file = Path(digest_path)
    if not digest_file.exists():
        print(f"❌ Fichier non trouvé: {digest_path}")
        return False
    
    digest_content = digest_file.read_text(encoding="utf-8")
    
    # Préparer l'email
    now = datetime.now()
    month = get_month_name_fr(now.month)
    year = now.year
    
    subject = EMAIL_SUBJECT_TEMPLATE.format(month=month, year=year)
    html_content = create_html_email(digest_content, tool_count)
    text_content = digest_content  # Version plain text
    
    print(f"📧 Destinataire: {RECIPIENT_EMAIL}")
    print(f"📝 Sujet: {subject}")
    print(f"📊 Outils inclus: {tool_count}")
    
    # Envoyer
    success = send_email_sendgrid(subject, html_content, text_content)
    
    if success:
        print("\n🎉 Email envoyé avec succès!")
    else:
        print("\n⚠️ Échec de l'envoi. Vérifiez la configuration SendGrid.")
    
    return success


def main():
    """Point d'entrée pour test standalone."""
    # Trouver le dernier digest
    output_dir = Path("output")
    if not output_dir.exists():
        print("❌ Aucun digest trouvé dans output/")
        return
    
    digests = list(output_dir.glob("digest-*.md"))
    if not digests:
        print("❌ Aucun fichier digest-*.md trouvé")
        return
    
    latest = sorted(digests)[-1]
    print(f"📄 Envoi du digest: {latest}")
    
    send_digest(str(latest), tool_count=0)


if __name__ == "__main__":
    main()
