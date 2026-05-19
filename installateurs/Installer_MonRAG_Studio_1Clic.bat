@echo off
chcp 65001 >nul
title Mon RAG Studio 1-Clic - Les outils pour enseigner avec l'IA
color 0B

:menu
cls
echo ===============================================================================
echo            📚 MON RAG STUDIO 1-CLIC - COMPAGNON DE L'ENSEIGNANT 📚
echo ===============================================================================
echo  Ce script vous aide à installer votre propre système de Recherche Documentaire
echo  Augmentée (RAG) locale. Vos cours et fichiers ne quittent jamais votre machine !
echo ===============================================================================
echo.
echo  [1] 🔍 Vérifier les prérequis (Python et Ollama)
echo  [2] 📁 Préparer le dossier de documents (mes_documents)
echo  [3] 🤖 Télécharger un modèle d'IA souverain (Mistral ou Gemma)
echo  [4] ⚡ Installer le RAG local et ses dépendances Python
echo  [5] 🚀 Lancer votre Assistant IA local sur vos documents
echo  [6] ❓ Qu'est-ce que le RAG ? (Explications pédagogiques)
echo  [7] ❌ Quitter l'installateur
echo.
echo ===============================================================================
set /p choix="👉 Choisissez une option (1-7) : "

if "%choix%"=="1" goto prerequis
if "%choix%"=="2" goto dossier
if "%choix%"=="3" goto modele
if "%choix%"=="4" goto install_rag
if "%choix%"=="5" goto run_rag
if "%choix%"=="6" goto explication
if "%choix%"=="7" goto quitter
goto menu

:prerequis
cls
echo ===============================================================================
echo                     🔍 VÉRIFICATION DES PRÉREQUIS
echo ===============================================================================
echo.
echo 1. Analyse de Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set pyver=%%i
    echo  [OK] Python est installé (Version %pyver%^)
) else (
    echo  [ERREUR] Python n'est pas détecté.
    echo  Veuillez télécharger et installer Python 3.10+ depuis https://www.python.org/downloads/
    echo  IMPORTANT : Cochez bien la case "Add Python to PATH" lors de l'installation !
)
echo.
echo 2. Analyse d'Ollama (moteur d'IA locale)...
ollama --version >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Ollama est installé et prêt à l'emploi.
) else (
    echo  [ATTENTION] Ollama n'est pas détecté ou n'est pas démarré.
    echo  Veuillez télécharger et lancer Ollama depuis https://ollama.com/
)
echo.
echo ===============================================================================
pause
goto menu

:dossier
cls
echo ===============================================================================
echo                  📁 CRÉATION DU DOSSIER DE DOCUMENTS
echo ===============================================================================
echo.
if not exist "mes_documents" (
    mkdir "mes_documents"
    echo  [OK] Le dossier "mes_documents" a été créé avec succès à la racine.
    echo  Déposez vos fichiers PDF, TXT ou Word (.docx) dans ce dossier !
) else (
    echo  [INFO] Le dossier "mes_documents" existe déjà.
    echo  Contenu actuel :
    dir "mes_documents" /b
)
echo.
echo ===============================================================================
pause
goto menu

:modele
cls
echo ===============================================================================
echo                🤖 TÉLÉCHARGEMENT D'UN MODÈLE SOUVERAIN
echo ===============================================================================
echo.
echo  Pour faire tourner une IA sur votre machine, vous devez télécharger un modèle.
echo  Voici les choix recommandés pour les ordinateurs d'enseignants :
echo.
echo  [1] Mistral 7B (Modèle français de référence - Requiert 8 Go de RAM)
echo  [2] Gemma 2 2B (Modèle ultra-léger de Google - Recommandé pour PC standards)
echo  [3] Phi-3 (Modèle ultra-performant de Microsoft - Très rapide)
echo  [4] Retour au menu principal
echo.
set /p choice_model="👉 Sélectionnez votre modèle : "

if "%choice_model%"=="1" (
    echo  Téléchargement de Mistral 7B... (environ 4.1 Go)
    ollama pull mistral
)
if "%choice_model%"=="2" (
    echo  Téléchargement de Gemma 2 2B... (environ 1.6 Go)
    ollama pull gemma2:2b
)
if "%choice_model%"=="3" (
    echo  Téléchargement de Phi-3... (environ 2.2 Go)
    ollama pull phi3
)
if "%choice_model%"=="4" goto menu
echo.
echo ===============================================================================
pause
goto menu

:install_rag
cls
echo ===============================================================================
echo                ⚡ INSTALLATION DU MOTEUR RAG ET DES DÉPENDANCES
echo ===============================================================================
echo.
echo  Installation des librairies Python requises (Langchain, Chromadb, Ollama)...
python -m pip install --upgrade pip
pip install langchain langchain-community chromadb ollama pypdf tiktoken
echo.
echo  Création du script RAG autonome...
(
echo # -*- coding: utf-8 -*-
echo import os
echo import sys
echo import glob
echo from langchain_community.document_loaders import PyPDFLoader
echo from langchain_text_splitters import RecursiveCharacterTextSplitter
echo from langchain_community.vectorstores import Chroma
echo from langchain_community.embeddings import OllamaEmbeddings
echo from langchain_community.llms import Ollama
echo.
echo sys.stdout.reconfigure(encoding='utf-8', errors='replace')
echo.
echo doc_dir = "mes_documents"
echo if not os.path.exists(doc_dir):
echo     os.makedirs(doc_dir)
echo.
echo print("🔄 Chargement de vos documents...")
echo files = glob.glob(os.path.join(doc_dir, "*.pdf"))
echo if not files:
echo     print("⚠️ Aucun fichier PDF trouvé dans 'mes_documents'. Veuillez y déposer des PDF.")
echo     sys.exit(0)
echo.
echo documents = []
echo for f in files:
echo     print(f" - Chargement de {os.path.basename(f)}")
echo     loader = PyPDFLoader(f)
echo     documents.extend(loader.load())
echo.
echo text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
echo chunks = text_splitter.split_documents(documents)
echo print(f"✅ {len(chunks)} fragments créés.")
echo.
echo print("🧠 Création de la base de vecteurs locale (ChromaDB)...")
echo # Choix automatique du modèle démarré sur ollama
echo embeddings = OllamaEmbeddings(model="gemma2:2b")
echo try:
echo     vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="./db_rag")
echo     print("✅ Indexation terminée. Base locale sauvegardée dans './db_rag'.")
echo except Exception as e:
echo     print(f"❌ Erreur lors de l'indexation : {e}")
echo     print("Vérifiez qu'Ollama est bien démarré en arrière-plan !")
echo     sys.exit(1)
echo.
echo retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
echo llm = Ollama(model="gemma2:2b")
echo.
echo print("\n==================================================")
echo "👋 Assistant RAG Local prêt ! Tapez 'exit' pour quitter."
echo "=================================================="
echo.
echo while True:
echo     query = input("\n📝 Votre question : ")
echo     if query.lower() == 'exit':
echo         break
echo     if not query.strip():
echo         continue
echo.
echo     print("🔍 Recherche des passages pertinents...")
echo     docs = retriever.get_relevant_documents(query)
echo     context = "\n\n".join([d.page_content for d in docs])
echo.
echo     prompt = f"Rôle: Tu es un assistant pédagogique. Réponds à la question suivante en utilisant exclusivement le contexte fourni. Si la réponse n'est pas dans le contexte, dis poliment que tu ne sais pas.\n\nContexte:\n{context}\n\nQuestion: {query}\n\nRéponse:"
echo.
echo     print("🤖 Analyse en cours...")
echo     try:
echo         response = llm.invoke(prompt)
echo         print("\n🤖 Réponse de l'IA :\n" + response)
echo     except Exception as e:
echo         print(f"❌ Erreur d'appel Ollama : {e}")
) > "rag_app.py"

echo  [OK] Le script "rag_app.py" a été généré avec succès !
echo ===============================================================================
pause
goto menu

:run_rag
cls
echo ===============================================================================
echo                🚀 LANCEMENT DE L'ASSISTANT RAG LOCAL
echo ===============================================================================
echo.
if not exist "rag_app.py" (
    echo  [ERREUR] Vous devez d'abord installer le RAG (Option 4) !
    pause
    goto menu
)
echo  Démarrage de l'assistant...
echo  (Assurez-vous d'avoir déposé des PDF dans 'mes_documents' et démarré Ollama)
echo.
python rag_app.py
echo.
echo ===============================================================================
pause
goto menu

:explication
cls
echo ===============================================================================
echo                  ❓ QU'EST-CE QUE LE RAG EN PÉDAGOGIE ?
echo ===============================================================================
echo.
echo  Le RAG (Retrieval-Augmented Generation) est une technique qui consiste à :
echo.
echo  1. Découper vos documents complexes (ex: programmes scolaires, fiches de cours,
echo     dossiers d'élèves anonymisés) en petits morceaux (fragments).
echo  2. Convertir ces fragments en valeurs mathématiques (les vecteurs) stockés dans
echo     une base locale sécurisée.
echo  3. Lorsque vous posez une question, le système retrouve instantanément les 3 ou 4
echo     morceaux les plus pertinents par rapport à votre question.
echo  4. Ces morceaux pertinents sont transmis à l'IA locale (Mistral, Gemma) comme un
echo     aide-mémoire, lui permettant de rédiger une réponse 100% exacte, sans jamais
echo     inventer (halluciner) de fausses informations.
echo.
echo  🚀 C'est l'outil ultime pour corriger des copies, concevoir des cours, ou
echo  analyser des circulaires réglementaires de manière 100% souveraine et RGPD.
echo ===============================================================================
pause
goto menu

:quitter
cls
echo ===============================================================================
echo     Merci d'utiliser le Site Compagnon "Les outils pour enseigner avec l'IA" !
echo ===============================================================================
echo.
pause
exit
