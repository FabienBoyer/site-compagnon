import { useState, useEffect } from 'react'

const API = 'http://localhost:8000'

const cardStyle = {
  background: 'white',
  borderRadius: 12,
  padding: '24px 28px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  marginBottom: 24,
}

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: '#374151',
  marginBottom: 6,
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: '0.9rem',
  boxSizing: 'border-box',
}

const btnPrimary = {
  padding: '8px 20px',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.88rem',
}

const btnSecondary = {
  padding: '8px 20px',
  background: '#f1f5f9',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.88rem',
}

export default function SettingsPage() {
  const [settings, setSettings]         = useState(null)
  const [backupPath, setBackupPath]      = useState('')
  const [backupInterval, setBackupInterval] = useState(24)
  const [syncInterval, setSyncInterval]  = useState(6)
  const [saving, setSaving]             = useState(false)
  const [backingUp, setBackingUp]       = useState(false)
  const [msg, setMsg]                   = useState(null)  // { type: 'ok'|'err', text }
  const [schedulerStatus, setSchedulerStatus] = useState(null)

  useEffect(() => {
    charger()
    chargerScheduler()
  }, [])

  function charger() {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(d => {
        setSettings(d)
        setBackupPath(d.backup_path || '')
        setBackupInterval(d.backup_interval_hours || 24)
        setSyncInterval(d.sync_interval_hours || 6)
      })
      .catch(() => setMsg({ type: 'err', text: 'Impossible de contacter le backend.' }))
  }

  function chargerScheduler() {
    fetch(`${API}/scheduler/status`)
      .then(r => r.json())
      .then(setSchedulerStatus)
      .catch(() => {})
  }

  async function sauvegarder(e) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backup_path: backupPath,
          backup_interval_hours: backupInterval,
          sync_interval_hours: syncInterval,
        }),
      })
      const d = await r.json()
      if (r.ok) {
        setMsg({ type: 'ok', text: d.message })
        charger()
        chargerScheduler()
      } else {
        setMsg({ type: 'err', text: d.detail || 'Erreur lors de la sauvegarde.' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau.' })
    } finally {
      setSaving(false)
    }
  }

  async function backupMaintenant() {
    if (!backupPath) {
      setMsg({ type: 'err', text: 'Configurez d\'abord un chemin de sauvegarde.' })
      return
    }
    setBackingUp(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/backup/now`, { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        setMsg({ type: 'ok', text: '✓ ' + d.message })
      } else {
        setMsg({ type: 'err', text: d.detail || 'Erreur lors du backup.' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Erreur réseau.' })
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24, color: '#1e293b' }}>
        ⚙️ Paramètres
      </h2>

      {/* Message feedback */}
      {msg && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 8,
          marginBottom: 20,
          background: msg.type === 'ok' ? '#dcfce7' : '#fee2e2',
          color: msg.type === 'ok' ? '#15803d' : '#b91c1c',
          fontSize: '0.88rem',
          fontWeight: 500,
        }}>
          {msg.text}
        </div>
      )}

      {/* Sauvegarde externe */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 4 }}>
          💾 Sauvegarde automatique
        </h3>
        <p style={{ fontSize: '0.83rem', color: '#6b7280', margin: '0 0 20px' }}>
          Copie la base de données chiffrée vers un dossier externe (clé USB, disque réseau…).
          Les 10 dernières sauvegardes sont conservées automatiquement.
        </p>

        <form onSubmit={sauvegarder}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Dossier de sauvegarde</label>
            <input
              type="text"
              value={backupPath}
              onChange={e => setBackupPath(e.target.value)}
              placeholder="Ex : D:\Sauvegarde PP Tracker"
              style={inputStyle}
            />
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>
              Laissez vide pour désactiver la sauvegarde automatique.
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Fréquence de sauvegarde</label>
            <select
              value={backupInterval}
              onChange={e => setBackupInterval(Number(e.target.value))}
              style={{ ...inputStyle, width: 'auto' }}
            >
              <option value={6}>Toutes les 6 heures</option>
              <option value={12}>Toutes les 12 heures</option>
              <option value={24}>Une fois par jour</option>
              <option value={48}>Tous les 2 jours</option>
              <option value={168}>Une fois par semaine</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" style={btnPrimary} disabled={saving}>
              {saving ? 'Enregistrement…' : '💾 Enregistrer'}
            </button>
            <button
              type="button"
              style={btnSecondary}
              onClick={backupMaintenant}
              disabled={backingUp}
            >
              {backingUp ? 'Sauvegarde en cours…' : '▶ Tester maintenant'}
            </button>
          </div>
        </form>
      </div>

      {/* Synchronisation */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 4 }}>
          🔄 Synchronisation Pronote
        </h3>
        <p style={{ fontSize: '0.83rem', color: '#6b7280', margin: '0 0 20px' }}>
          Fréquence de récupération automatique des notes et absences depuis Pronote.
        </p>

        <form onSubmit={sauvegarder}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Intervalle de synchronisation</label>
            <select
              value={syncInterval}
              onChange={e => setSyncInterval(Number(e.target.value))}
              style={{ ...inputStyle, width: 'auto' }}
            >
              <option value={1}>Toutes les heures</option>
              <option value={3}>Toutes les 3 heures</option>
              <option value={6}>Toutes les 6 heures</option>
              <option value={12}>Toutes les 12 heures</option>
              <option value={24}>Une fois par jour</option>
            </select>
          </div>

          <button type="submit" style={btnPrimary} disabled={saving}>
            {saving ? 'Enregistrement…' : '💾 Enregistrer'}
          </button>
        </form>
      </div>

      {/* Statut scheduler */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 12 }}>
          📡 Statut du scheduler
        </h3>
        {schedulerStatus ? (
          <div style={{ fontSize: '0.88rem', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: schedulerStatus.running ? '#22c55e' : '#ef4444',
              }} />
              <strong>{schedulerStatus.running ? 'Actif' : 'Arrêté'}</strong>
            </div>
            {schedulerStatus.running && (
              <>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>
                  Sync toutes les <strong>{schedulerStatus.interval_heures}h</strong>
                </div>
                {schedulerStatus.next_run && (
                  <div style={{ color: '#6b7280' }}>
                    Prochaine sync :{' '}
                    <strong>
                      {new Date(schedulerStatus.next_run).toLocaleString('fr-FR', {
                        weekday: 'short', day: '2-digit', month: '2-digit',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </strong>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Chargement…</div>
        )}

        {settings && (
          <div style={{
            marginTop: 16,
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: 8,
            fontSize: '0.8rem',
            color: '#6b7280',
          }}>
            <div>📂 Base de données : <code>{settings.db_path}</code></div>
            {settings.backup_path
              ? <div style={{ marginTop: 4 }}>💾 Sauvegarde vers : <code>{settings.backup_path}</code></div>
              : <div style={{ marginTop: 4, color: '#f59e0b' }}>⚠ Aucune sauvegarde externe configurée</div>
            }
          </div>
        )}
      </div>

      {/* Note RGPD */}
      <div style={{
        padding: '12px 16px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 8,
        fontSize: '0.8rem',
        color: '#1d4ed8',
      }}>
        🔒 <strong>RGPD</strong> — Toutes les données restent sur votre machine.
        Les sauvegardes contiennent la base chiffrée (AES-128) : seule votre clé locale peut les déchiffrer.
      </div>
    </div>
  )
}
