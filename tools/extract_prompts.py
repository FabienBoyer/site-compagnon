import re
import os
import json

# Base directory for the project
BASE_DIR = r"c:\Users\boyoc\Desktop\HUMANISATION CLAUDE"
SITE_DATA_DIR = os.path.join(BASE_DIR, "site-compagnon", "data")

def clean_latex(text):
    """
    Cleans LaTeX commands from the text to make it suitable for JSON/HTML.
    """
    if not text:
        return ""
    
    # Replace footnotes with parenthetical text
    text = re.sub(r'\\footnote\{([^}]+)\}', r' (\1)', text)
    
    # Replace common LaTeX formatting
    text = re.sub(r'\\textbf\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\textit\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\emph\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\texttt\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\textsuperscript\{([^}]+)\}', r'\1', text)
    
    # Replace special characters
    text = text.replace(r'\%', '%')
    text = text.replace(r'\&', '&')
    text = text.replace(r'\$', '$')
    text = text.replace(r'\_', '_')
    text = text.replace(r'«', '"')
    text = text.replace(r'»', '"')
    text = text.replace(r'\,', '') # Thin space
    text = text.replace(r'\\', '') # Backslashes if any left
    
    # Remove itemize/enumerate environments but keep content
    text = re.sub(r'\\begin\{itemize\}', '', text)
    text = re.sub(r'\\end\{itemize\}', '', text)
    text = re.sub(r'\\begin\{enumerate\}', '', text)
    text = re.sub(r'\\end\{enumerate\}', '', text)
    text = re.sub(r'\\item\s*', '- ', text)
    
    # Handling user input lines in prompts (often indicated by [ ])
    text = re.sub(r'\\\[([^\]]+)\\\]', r'[\1]', text)
    
    # Remove excess whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def parse_main_file(main_file_path):
    """
    Parses main.tex to find the order of included files and structure.
    Returns a list of tuples (part_name, file_path)
    """
    includes = []
    current_part = "Introduction"
    
    with open(main_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        # Check for Part
        part_match = re.match(r'\\part\*?\{([^}]+)\}', line)
        if part_match:
            current_part = part_match.group(1)
            continue
            
        # Check for Input/Include
        input_match = re.match(r'\\input\{([^}]+)\}', line)
        if input_match:
            rel_path = input_match.group(1)
            if not rel_path.endswith('.tex'):
                rel_path += '.tex'
            full_path = os.path.join(BASE_DIR, rel_path)
            includes.append((current_part, full_path))
            
    return includes

def extract_prompts_from_file(file_path, part_name):
    """
    Extracts promptbox environments from a single file.
    """
    prompts = []
    if not os.path.exists(file_path):
        print(f"Warning: File not found: {file_path}")
        return prompts
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find chapter title if exists
    chapter_match = re.search(r'\\chapter\*?\{([^}]+)\}', content)
    chapter_title = chapter_match.group(1) if chapter_match else "Général"
    
    # Split content by promptbox to easier find preceding subsection
    # But a regex approach iterating through the file is safer to keep order and context
    
    # We will iterate through lines to track current subsection
    lines = content.split('\n')
    current_subsection = "Général"
    
    # buffer for prompt content
    in_prompt = False
    prompt_buffer = []
    prompt_title = ""
    
    # This loop is a simple state machine parser
    for line in lines:
        stripped = line.strip()
        
        # Track subsection
        sub_match = re.match(r'\\subsection\*?\{([^}]+)\}', stripped)
        if sub_match:
            current_subsection = clean_latex(sub_match.group(1))
            
        # Start of promptbox
        # Pattern: \begin{promptbox}[Title]
        start_match = re.match(r'\\begin\{promptbox\}\[([^\]]+)\]', stripped)
        if start_match:
            in_prompt = True
            prompt_title = clean_latex(start_match.group(1))
            prompt_buffer = []
            continue
            
        # End of promptbox
        if stripped == r'\end{promptbox}':
            if in_prompt:
                in_prompt = False
                raw_content = '\n'.join(prompt_buffer)
                clean_content = clean_latex(raw_content)
                
                # If we are in the "Annexes" part, the chapter is "Mémento des prompts"
                # and the meaningful category is the subsection.
                # If we are in the main book, the chapter is the main category, and subsection might be less relevant for "Subject"
                # But let's use Subsection as Subject if available and not 'Général'
                
                subject = current_subsection if current_subsection != "Général" else "Général"
                
                prompts.append({
                    "id": "", # Will be set later
                    "part": part_name,
                    "chapter": clean_latex(chapter_title),
                    "title": prompt_title,
                    "content": clean_content,
                    "subject": subject
                })
            continue
            
        if in_prompt:
            prompt_buffer.append(line)
            
    return prompts

def parse_crofi(text):
    """
    Parses the C.R.O.F.I structure from the prompt text.
    Returns a dictionary with specific fields if found, else returns metadata indicating unstructured.
    """
    structure = {
        "context": "", # C
        "role": "",    # R
        "task": "",    # O (Objectif) -> Task
        "format": "",  # F
        "input": ""    # I
    }
    
    # Regex structure to capture content between keywords
    # We look for "Key :" pattern.
    # Note: spacing and capitalization might vary slightly after cleaning.
    
    # helper to extract part
    def get_part(key, next_keys, source):
        pattern = r'{}\s*:(.*?)(?=$|{})'.format(key, '|'.join(map(re.escape, next_keys)))
        match = re.search(pattern, source, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else ""

    # Check if this looks like a structured prompt
    if "Contexte :" in text or "Rôle :" in text:
        structure["context"] = get_part("Contexte", ["Rôle", "Objectif", "Format", "Input"], text)
        structure["role"] = get_part("Rôle", ["Objectif", "Format", "Input", "Contexte"], text)
        structure["task"] = get_part("Objectif", ["Format", "Input", "Contexte", "Rôle"], text)
        structure["format"] = get_part("Format", ["Input", "Contexte", "Rôle", "Objectif"], text)
        structure["input"] = get_part("Input", ["Contexte", "Rôle", "Objectif", "Format"], text)
        
        # If extraction failed (e.g. valid structure not found), fall back
        if not any(structure.values()):
            return None
            
        return structure
    
    return None

def main():
    print("Starting prompt extraction...")
    print(f"Base Directory: {BASE_DIR}")
    
    main_tex = os.path.join(BASE_DIR, "main.tex")
    file_list = parse_main_file(main_tex)
    
    all_prompts = []
    
    for part, file_path in file_list:
        file_prompts = extract_prompts_from_file(file_path, part)
        all_prompts.extend(file_prompts)
        
    print(f"Extracted {len(all_prompts)} prompts.")
    
    # Post-processing to assign unique IDs and parse CROFI
    for i, p in enumerate(all_prompts):
        p['id'] = f"p{i+1:03d}"
        
        # Try to parse structure
        crofi = parse_crofi(p['content'])
        if crofi:
            p['structure'] = crofi
            # We keep the full content as 'raw_content' or just 'content' for copy-paste simplicity
            # But maybe we want to reconstruct a clean version for copy-paste?
            # For now, let's keep 'content' as the master string for copying.
    
    # Ensure data directory exists
    if not os.path.exists(SITE_DATA_DIR):
        os.makedirs(SITE_DATA_DIR)
        
    output_file = os.path.join(SITE_DATA_DIR, "prompts.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_prompts, f, indent=2, ensure_ascii=False)
        
    print(f"Saved prompts to {output_file}")

if __name__ == "__main__":
    main()
