"""
main.py — PP Tracker API (FastAPI)
"""

import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.db import init_db, get_connection
from backend.modules.m2_eleve import (
    get_tous_les_eleves, get_eleve, calculer_score,
    ajouter_contact, ajouter_absence,
)
from backend.modules.m3_dashboard import get_dashboard
from backend.modules.m7_conseil import init_synthese_pp, get_conseil, upsert_synthese
from backend.modules.m8b_synthese import generer_appreciation, lister_modeles
from backend.modules.m8a_ocr import ocr_bulletin, ocr_bulletin_pdf
from backend.modules.m4_familles import get_tous_contacts, supprimer_contact
from backend.modules.m9_profil import (
    get_profil_complet, upsert_certification, upsert_parcours,
    ajouter_document, modifier_document, supprimer_document
)
from backend.modules.m6_rapport import get_rapport_hebdo
from backend.modules.m10_plan import lister_plans, get_plan, creer_plan, sauver_plan, supprimer_plan
from backend.modules.m11_orientation import (
    get_orientation, upsert_orientation, lister_orientations,
    lister_stages, ajouter_stage, supprimer_stage,
)
from backend.acquisition.track_a import fetch as track_a_fetch
from backend.normalizer import importer
from backend import scheduler as sched

app = FastAPI(title="PP Tracker API", version="0.8.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sync_status = {"running": False, "last_result": None}


@app.on_event("startup")
async def startup():
    init_db()
    conn = get_connection()
    init_synthese_pp(conn)
    conn.close()
    sched.demarrer()


@app.on_event("shutdown")
async def shutdown():
    sched.arreter()


# ── Santé ─────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.8.0"}


# ── M2 — Élèves ───────────────────────────────────────────────────────────────

@app.get("/eleves")
def liste_eleves():
    return get_tous_les_eleves()


@app.get("/eleves/{eleve_id}")
def fiche_eleve(eleve_id: int):
    eleve = get_eleve(eleve_id)
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return eleve


@app.get("/eleves/{eleve_id}/score")
def score_eleve(eleve_id: int):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return calculer_score(eleve_id)


class ContactIn(BaseModel):
    date_contact: str
    type_contact: str
    contenu: str


@app.post("/eleves/{eleve_id}/contacts", status_code=201)
def post_contact(eleve_id: int, body: ContactIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    new_id = ajouter_contact(eleve_id, body.date_contact, body.type_contact, body.contenu)
    return {"id": new_id, "message": "Contact ajouté"}


class AbsenceIn(BaseModel):
    date_debut: str
    justifiee: bool = False
    motif: str | None = None


@app.post("/eleves/{eleve_id}/absences", status_code=201)
def post_absence(eleve_id: int, body: AbsenceIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    new_id = ajouter_absence(eleve_id, body.date_debut, body.justifiee, body.motif)
    return {"id": new_id, "message": "Absence ajoutée"}


# ── M9 — Profil & Parcours ───────────────────────────────────────────────────

@app.get("/eleves/{eleve_id}/profil")
def profil_eleve(eleve_id: int):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return get_profil_complet(eleve_id)


class CertifIn(BaseModel):
    type: str
    statut: str
    date_obtention: str | None = None
    notes: str | None = None

@app.post("/eleves/{eleve_id}/certifications", status_code=200)
def post_certification(eleve_id: int, body: CertifIn):
    upsert_certification(eleve_id, body.type, body.statut, body.date_obtention, body.notes)
    return {"message": "Certification mise à jour"}


class ParcoursIn(BaseModel):
    type: str
    participation: str = ""
    valide: bool = False
    annee_scolaire: str = "2025-2026"

@app.post("/eleves/{eleve_id}/parcours", status_code=200)
def post_parcours(eleve_id: int, body: ParcoursIn):
    upsert_parcours(eleve_id, body.type, body.participation, body.valide, body.annee_scolaire)
    return {"message": "Parcours mis à jour"}


class DocumentIn(BaseModel):
    type_document: str
    titre: str
    date_document: str | None = None
    preconisations: str | None = None
    chemin_fichier: str | None = None

@app.post("/eleves/{eleve_id}/documents", status_code=201)
def post_document(eleve_id: int, body: DocumentIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    new_id = ajouter_document(eleve_id, body.type_document, body.titre,
                               body.date_document, body.preconisations, body.chemin_fichier)
    return {"id": new_id, "message": "Document ajouté"}


class DocumentUpdateIn(BaseModel):
    preconisations: str | None = None
    titre: str | None = None

@app.patch("/documents/{doc_id}", status_code=200)
def patch_document(doc_id: int, body: DocumentUpdateIn):
    ok = modifier_document(doc_id, body.preconisations, body.titre)
    if not ok:
        raise HTTPException(status_code=404, detail="Document introuvable")
    return {"message": "Document modifié"}

@app.delete("/documents/{doc_id}", status_code=200)
def delete_document(doc_id: int):
    ok = supprimer_document(doc_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Document introuvable")
    return {"message": "Document supprimé"}


# ── M4 — Journal familles ────────────────────────────────────────────────────

@app.get("/contacts")
def tous_contacts(type_contact: str = None):
    return get_tous_contacts(type_contact)


@app.delete("/contacts/{contact_id}", status_code=200)
def delete_contact(contact_id: int):
    ok = supprimer_contact(contact_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Contact introuvable")
    return {"message": "Contact supprimé"}


# ── M3 — Dashboard ────────────────────────────────────────────────────────────

@app.get("/dashboard")
def dashboard():
    return get_dashboard()


# ── M7 — Conseil de classe ────────────────────────────────────────────────────

@app.get("/conseil/{periode}")
def conseil(periode: str):
    return get_conseil(periode)


class SyntheseIn(BaseModel):
    periode: str
    appreciation_pp: str = ""
    mention: str = ""


@app.post("/eleves/{eleve_id}/synthese-pp", status_code=200)
def post_synthese(eleve_id: int, body: SyntheseIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    upsert_synthese(eleve_id, body.periode, body.appreciation_pp, body.mention)
    return {"message": "Synthèse enregistrée"}


# ── M8b — Génération Ollama ──────────────────────────────────────────────────

@app.get("/ollama/modeles")
def ollama_modeles():
    try:
        return {"modeles": lister_modeles()}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


class GenererSyntheseIn(BaseModel):
    periode: str
    modele: str = "deepseek-r1:latest"


@app.post("/eleves/{eleve_id}/generer-synthese")
def generer_synthese(eleve_id: int, body: GenererSyntheseIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    try:
        texte = generer_appreciation(eleve_id, body.periode, body.modele)
        return {"appreciation": texte}
    except (ValueError, RuntimeError) as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── M8a — OCR bulletins (Qwen2.5VL) ─────────────────────────────────────────

@app.post("/bulletins/ocr")
async def bulletin_ocr(fichier: UploadFile = File(...)):
    """
    Accepte une image (PNG/JPG) ou un PDF de bulletin scanné.
    Retourne les données structurées extraites par Qwen2.5VL.
    """
    contenu = await fichier.read()
    content_type = fichier.content_type or ""

    try:
        if "pdf" in content_type:
            resultat = ocr_bulletin_pdf(contenu)
        elif content_type in ("image/jpeg", "image/png", "image/webp"):
            resultat = ocr_bulletin(contenu, content_type)
        else:
            raise HTTPException(
                status_code=415,
                detail="Format non supporté. Utilisez PNG, JPG ou PDF."
            )
        return resultat
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── M1 — Synchronisation manuelle ────────────────────────────────────────────

def _run_sync(periode: str):
    import asyncio
    sync_status["running"] = True
    try:
        data   = track_a_fetch(periode)
        result = importer(data)
        sync_status["last_result"] = {**result, "status": "ok"}
    except Exception as e:
        sync_status["last_result"] = {"status": "error", "message": str(e)}
    finally:
        sync_status["running"] = False


@app.post("/sync")
def sync(background_tasks: BackgroundTasks, periode: str = "T1"):
    if sync_status["running"]:
        return {"message": "Synchronisation déjà en cours"}
    background_tasks.add_task(_run_sync, periode)
    return {"message": f"Synchronisation lancée pour la période {periode}"}


@app.get("/sync/status")
def sync_status_endpoint():
    return sync_status


# ── Scheduler ─────────────────────────────────────────────────────────────────

@app.get("/scheduler/status")
def scheduler_status():
    return sched.get_status()


# ── Plan de classe (M10) ──────────────────────────────────────────────────────

@app.get("/plan-classe")
def api_lister_plans():
    return lister_plans()

@app.get("/plan-classe/{plan_id}")
def api_get_plan(plan_id: int):
    p = get_plan(plan_id)
    if not p:
        raise HTTPException(status_code=404, detail="Plan introuvable")
    return p

class PlanCreateBody(BaseModel):
    nom: str = "Plan 1"
    nb_lignes: int = 5
    nb_colonnes: int = 6

@app.post("/plan-classe")
def api_creer_plan(body: PlanCreateBody):
    return creer_plan(body.nom, body.nb_lignes, body.nb_colonnes)

class PlanSaveBody(BaseModel):
    nom: str
    nb_lignes: int
    nb_colonnes: int
    grille: dict

@app.put("/plan-classe/{plan_id}")
def api_sauver_plan(plan_id: int, body: PlanSaveBody):
    if not get_plan(plan_id):
        raise HTTPException(status_code=404, detail="Plan introuvable")
    return sauver_plan(plan_id, body.nom, body.nb_lignes, body.nb_colonnes, body.grille)

@app.delete("/plan-classe/{plan_id}")
def api_supprimer_plan(plan_id: int):
    if not get_plan(plan_id):
        raise HTTPException(status_code=404, detail="Plan introuvable")
    supprimer_plan(plan_id)
    return {"ok": True}


# ── Orientation (M11) ────────────────────────────────────────────────────────

@app.get("/orientation")
def api_lister_orientations():
    return lister_orientations()


@app.get("/eleves/{eleve_id}/orientation")
def api_get_orientation(eleve_id: int):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return get_orientation(eleve_id)


class OrientationIn(BaseModel):
    date_entretien: str | None = None
    voie_envisagee: str | None = None
    specialites: list = []
    projet_pro: str | None = None
    notes_pp: str | None = None


@app.post("/eleves/{eleve_id}/orientation", status_code=200)
def api_upsert_orientation(eleve_id: int, body: OrientationIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return upsert_orientation(
        eleve_id,
        body.date_entretien,
        body.voie_envisagee,
        body.specialites,
        body.projet_pro,
        body.notes_pp,
    )


@app.get("/eleves/{eleve_id}/stages")
def api_lister_stages(eleve_id: int):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    return lister_stages(eleve_id)


class StageIn(BaseModel):
    date_debut: str | None = None
    date_fin: str | None = None
    entreprise: str | None = None
    secteur: str | None = None
    bilan: str | None = None


@app.post("/eleves/{eleve_id}/stages", status_code=201)
def api_ajouter_stage(eleve_id: int, body: StageIn):
    if not get_eleve(eleve_id):
        raise HTTPException(status_code=404, detail="Élève introuvable")
    new_id = ajouter_stage(
        eleve_id, body.date_debut, body.date_fin,
        body.entreprise, body.secteur, body.bilan,
    )
    return {"id": new_id, "message": "Stage ajouté"}


@app.delete("/stages/{stage_id}", status_code=200)
def api_supprimer_stage(stage_id: int):
    ok = supprimer_stage(stage_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Stage introuvable")
    return {"message": "Stage supprimé"}


# ── Rapport hebdomadaire (M6) ─────────────────────────────────────────────────

@app.get("/rapport/hebdo")
def rapport_hebdo():
    return get_rapport_hebdo()


# ── Settings (M12) ────────────────────────────────────────────────────────────

ENV_PATH = Path(__file__).parent.parent / ".env"

def _lire_env() -> dict:
    """Lit le fichier .env et retourne un dict clé→valeur."""
    valeurs = {}
    if ENV_PATH.exists():
        for ligne in ENV_PATH.read_text(encoding="utf-8").splitlines():
            ligne = ligne.strip()
            if ligne and not ligne.startswith("#") and "=" in ligne:
                cle, _, val = ligne.partition("=")
                valeurs[cle.strip()] = val.strip()
    return valeurs

def _ecrire_cle_env(cle: str, valeur: str):
    """Met à jour (ou ajoute) une clé dans le fichier .env sans toucher aux autres."""
    lignes = ENV_PATH.read_text(encoding="utf-8").splitlines() if ENV_PATH.exists() else []
    nouvelle_ligne = f"{cle}={valeur}"
    trouve = False
    for i, ligne in enumerate(lignes):
        if ligne.strip().startswith(f"{cle}="):
            lignes[i] = nouvelle_ligne
            trouve = True
            break
    if not trouve:
        lignes.append(nouvelle_ligne)
    ENV_PATH.write_text("\n".join(lignes) + "\n", encoding="utf-8")

class SettingsBody(BaseModel):
    backup_path: str = ""
    backup_interval_hours: int = 24
    sync_interval_hours: int = 6

@app.get("/settings")
def get_settings():
    env = _lire_env()
    return {
        "backup_path":           env.get("BACKUP_PATH", ""),
        "backup_interval_hours": int(env.get("BACKUP_INTERVAL_HOURS", "24")),
        "sync_interval_hours":   int(env.get("SYNC_INTERVAL_HOURS", "6")),
        "db_path":               env.get("DB_PATH", "data/pptracker.db"),
    }

@app.post("/settings")
def post_settings(body: SettingsBody):
    _ecrire_cle_env("BACKUP_PATH",           body.backup_path)
    _ecrire_cle_env("BACKUP_INTERVAL_HOURS", str(body.backup_interval_hours))
    _ecrire_cle_env("SYNC_INTERVAL_HOURS",   str(body.sync_interval_hours))
    # Redémarre le job backup avec le nouveau chemin/intervalle
    sched.reconfigurer_backup(body.backup_path, body.backup_interval_hours)
    return {"ok": True, "message": "Paramètres sauvegardés. Redémarrez l'application pour que toutes les modifications prennent effet."}

@app.post("/backup/now")
async def backup_maintenant():
    """Déclenche une sauvegarde immédiate."""
    try:
        await sched.tache_backup_avec_config(
            _lire_env().get("BACKUP_PATH", ""),
            _lire_env().get("DB_PATH", "data/pptracker.db"),
        )
        return {"ok": True, "message": "Sauvegarde effectuée."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
