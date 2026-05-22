"""
scheduler.py — Synchronisation automatique via APScheduler

Configure SYNC_INTERVAL_HOURS dans .env pour régler la fréquence.
Par défaut : toutes les 6 heures.
Les résultats sont loggés dans logs/sync.log.
"""

import os
import shutil
import logging
from pathlib import Path
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from dotenv import load_dotenv

from backend.acquisition.track_a import fetch as track_a_fetch
from backend.normalizer import importer

load_dotenv()

SYNC_INTERVAL_HOURS   = int(os.getenv("SYNC_INTERVAL_HOURS", "6"))
SYNC_PERIODE          = os.getenv("SYNC_PERIODE", "T1")
BACKUP_PATH           = os.getenv("BACKUP_PATH", "")           # ex: D:\Sauvegarde PP Tracker
BACKUP_INTERVAL_HOURS = int(os.getenv("BACKUP_INTERVAL_HOURS", "24"))
DB_PATH               = Path(os.getenv("DB_PATH", "data/pptracker.db"))

# ── Logging ───────────────────────────────────────────────────────────────────
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / "sync.log", encoding="utf-8"),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger("pp_tracker.scheduler")

# ── Scheduler ─────────────────────────────────────────────────────────────────
scheduler = AsyncIOScheduler()


async def tache_sync():
    """Tâche planifiée : fetch → normalise → log."""
    log.info(f"[Scheduler] Démarrage sync automatique — période {SYNC_PERIODE}")
    try:
        data   = track_a_fetch(SYNC_PERIODE)
        result = importer(data)
        log.info(
            f"[Scheduler] Sync OK — "
            f"{result['eleves_sync']} élèves, "
            f"{result['notes_new']} nouvelles notes, "
            f"{result['absences_new']} nouvelles absences "
            f"(source: {result['source']})"
        )
        return result
    except Exception as e:
        log.error(f"[Scheduler] Erreur sync : {e}")
        return {"status": "error", "message": str(e)}


async def tache_backup():
    """Copie la base SQLite chiffrée vers le dossier de sauvegarde externe."""
    if not BACKUP_PATH:
        return  # Pas configuré → on ignore silencieusement

    dest_dir = Path(BACKUP_PATH)
    try:
        dest_dir.mkdir(parents=True, exist_ok=True)
        horodatage = datetime.now().strftime("%Y%m%d_%H%M")
        dest_file  = dest_dir / f"pptracker_{horodatage}.db"
        shutil.copy2(DB_PATH, dest_file)

        # Garder seulement les 10 dernières sauvegardes
        sauvegardes = sorted(dest_dir.glob("pptracker_*.db"))
        for old in sauvegardes[:-10]:
            old.unlink()

        log.info(f"[Backup] Sauvegarde créée : {dest_file.name}")
    except Exception as e:
        log.error(f"[Backup] Erreur sauvegarde : {e}")


def demarrer():
    """Démarre le scheduler au startup de FastAPI."""
    scheduler.add_job(
        tache_sync,
        trigger=IntervalTrigger(hours=SYNC_INTERVAL_HOURS),
        id="sync_pronote",
        name="Sync Pronote / Simulation",
        replace_existing=True,
        next_run_time=datetime.now(),
    )

    if BACKUP_PATH:
        scheduler.add_job(
            tache_backup,
            trigger=IntervalTrigger(hours=BACKUP_INTERVAL_HOURS),
            id="backup_externe",
            name="Sauvegarde externe SQLite",
            replace_existing=True,
            next_run_time=datetime.now(),  # première sauvegarde immédiate
        )
        log.info(f"[Scheduler] Backup activé → {BACKUP_PATH} toutes les {BACKUP_INTERVAL_HOURS}h")

    scheduler.start()
    log.info(f"[Scheduler] Démarré — sync toutes les {SYNC_INTERVAL_HOURS}h")


def arreter():
    """Arrête le scheduler proprement au shutdown."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        log.info("[Scheduler] Arrêté.")


def get_status() -> dict:
    """Retourne l'état du scheduler et la prochaine exécution."""
    if not scheduler.running:
        return {"running": False, "next_run": None}
    job = scheduler.get_job("sync_pronote")
    return {
        "running":         True,
        "interval_heures": SYNC_INTERVAL_HOURS,
        "next_run":        job.next_run_time.isoformat() if job and job.next_run_time else None,
    }


def reconfigurer_backup(backup_path: str, interval_hours: int):
    """Replanifie (ou supprime) le job backup sans redémarrer le scheduler."""
    global BACKUP_PATH, BACKUP_INTERVAL_HOURS
    BACKUP_PATH = backup_path
    BACKUP_INTERVAL_HOURS = interval_hours

    # Supprime l'ancien job s'il existe
    if scheduler.get_job("backup_externe"):
        scheduler.remove_job("backup_externe")

    if backup_path and scheduler.running:
        scheduler.add_job(
            tache_backup,
            trigger=IntervalTrigger(hours=interval_hours),
            id="backup_externe",
            name="Sauvegarde externe SQLite",
            replace_existing=True,
        )
        log.info(f"[Backup] Reconfiguré → {backup_path} toutes les {interval_hours}h")
    elif not backup_path:
        log.info("[Backup] Désactivé (chemin vide).")


async def tache_backup_avec_config(backup_path: str, db_path: str):
    """Version paramétrée de tache_backup — utilisée pour le backup manuel."""
    if not backup_path:
        raise ValueError("Aucun chemin de sauvegarde configuré.")

    dest_dir = Path(backup_path)
    db = Path(db_path)
    dest_dir.mkdir(parents=True, exist_ok=True)
    horodatage = datetime.now().strftime("%Y%m%d_%H%M")
    dest_file  = dest_dir / f"pptracker_{horodatage}.db"
    shutil.copy2(db, dest_file)

    # Garder seulement les 10 dernières sauvegardes
    sauvegardes = sorted(dest_dir.glob("pptracker_*.db"))
    for old in sauvegardes[:-10]:
        old.unlink()

    log.info(f"[Backup] Sauvegarde manuelle créée : {dest_file.name}")
