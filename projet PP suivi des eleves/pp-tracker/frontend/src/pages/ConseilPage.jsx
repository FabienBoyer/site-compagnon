import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:8000'

const MENTIONS = [
  '', 'Félicitations', 'Compliments', 'Encouragements',
  'Mise en garde', 'Avertissement de travail', 'Avertissement de conduite'
]

const NIVEAU_COLOR = { ok: '#16a34a', attention: '#d97706', alerte: '#dc2626' }
const NIVEAU_BG    = { ok: '#dcfce7', attention: '#fef9c3', alerte: '#fee2e2' }
const BADGE_DISP   = { PAP: 'badge-pap', PPS: 'badge-pps', PPRE: 'badge-ppre', ESS: 'badge-ess' }

export default function ConseilPage() {
  const [periode, setPeriode]     = useState('T1')
  const [eleves, setEleves]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState({})     // { [id]: bool }
  const [saved, setSaved]         = useState({})     // { [id]: bool }
  const [generating, setGenerating] = useState({})  // { [id]: bool }
  const [modeles, setModeles]     = useState([])
  const [modeleChoisi, setModeleChoisi] = useState('deepseek-r1:latest')
  const navigate = useNavigate()

  // Charger les modèles Ollama disponibles au montage
  useEffect(() => {
    fetch(`${API}/ollama/modeles`)
      .then(r => r.json())
      .then(data => {
        if (data.modeles && data.modeles.length > 0) {
          setModeles(data.modeles)
          setModeleChoisi(data.modeles[0])
        }
      })
      .catch(() => {}) // Ollama peut ne pas être démarré
  }, [])

  const charger = useCallback(() => {
    setLoading(true)
    fetch(`${API}/conseil/${periode}`)
      .then(r => r.json())
      .then(data => { setEleves(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [periode])

  useEffect(() => { charger() }, [charger])

  function updateLocal(id, field, value) {
    setEleves(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  async function generer(eleve) {
    setGenerating(g => ({ ...g, [eleve.id]: true }))
    try {
      const r = await fetch(`${API}/eleves/${eleve.id}/generer-synthese`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periode, modele: modeleChoisi }),
      })
      if (!r.ok) {
        const err = await r.json()
        alert(`Erreur Ollama : ${err.detail}`)
        return
      }
      const data = await r.json()
      updateLocal(eleve.id, 'appreciation_pp', data.appreciation)
    } finally {
      setGenerating(g => ({ ...g, [eleve.id]: false }))
    }
  }

  async function sauvegarder(eleve) {
    setSaving(s => ({ ...s, [eleve.id]: true }))
    await fetch(`${API}/eleves/${eleve.id}/synthese-pp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        periode,
        appreciation_pp: eleve.appreciation_pp,
        mention: eleve.mention,
      }),
    })
    setSaving(s => ({ ...s, [eleve.id]: false }))
    setSaved(s => ({ ...s, [eleve.id]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [eleve.id]: false })), 2000)
  }

  return (
    <>
      {/* En-tête */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, border: 'none', padding: 0, color: '#1e3a5f', fontSize: '1.1rem' }}>
            Préparation conseil de classe
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 4 }}>
            {eleves.length} élèves · Période sélectionnée : <strong>{periode}</strong>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sélecteur modèle Ollama */}
          {modeles.length > 0 && (
            <select
              value={modeleChoisi}
              onChange={e => setModeleChoisi(e.target.value)}
              title="Modèle Ollama utilisé pour la génération"
              style={{
                padding: '5px 10px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: '0.8rem', color: '#6366f1',
                fontWeight: 600, outline: 'none', background: '#f5f3ff',
              }}
            >
              {modeles.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
          {/* Sélecteur période */}
          {['T1', 'T2', 'T3'].map(p => (
            <button key={p} onClick={() => setPeriode(p)} style={{
              padding: '6px 18px', border: 'none', borderRadius: 8, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.9rem',
              background: periode === p ? '#1e3a5f' : '#f1f5f9',
              color: periode === p ? 'white' : '#374151',
              transition: 'all 0.15s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {eleves.map(e => (
            <EleveCard
              key={e.id}
              eleve={e}
              saving={saving[e.id]}
              saved={saved[e.id]}
              generating={generating[e.id]}
              ollamaDisponible={modeles.length > 0}
              onUpdate={(field, val) => updateLocal(e.id, field, val)}
              onSave={() => sauvegarder(e)}
              onGenerate={() => generer(e)}
              onNavigate={() => navigate(`/eleve/${e.id}`)}
            />
          ))}
        </div>
      )}
    </>
  )
}

function EleveCard({ eleve, saving, saved, generating, ollamaDisponible, onUpdate, onSave, onGenerate, onNavigate }) {
  const couleur = NIVEAU_COLOR[eleve.niveau] || '#6b7280'
  const bg      = NIVEAU_BG[eleve.niveau]    || '#f9fafb'

  return (
    <div className="card" style={{ marginBottom: 0, borderLeft: `4px solid ${couleur}` }}>
      {/* Ligne 1 : identité + stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>

        {/* Nom cliquable */}
        <div style={{ minWidth: 160, cursor: 'pointer' }} onClick={onNavigate}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e3a5f' }}>
            {eleve.prenom} {eleve.nom}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>→ voir la fiche</div>
        </div>

        {/* Moyenne période */}
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a5f' }}>
            {eleve.moyenne !== null ? `${eleve.moyenne}` : '—'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>moy. /20</div>
        </div>

        {/* Absences */}
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: eleve.nb_non_just > 0 ? '#dc2626' : '#374151' }}>
            {eleve.nb_absences}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
            abs. {eleve.nb_non_just > 0 ? `(${eleve.nb_non_just} NJ)` : ''}
          </div>
        </div>

        {/* Score */}
        <div style={{
          padding: '3px 12px', borderRadius: 20, background: bg,
          color: couleur, fontWeight: 700, fontSize: '0.8rem'
        }}>
          Score {eleve.score}
        </div>

        {/* Dispositifs */}
        {eleve.dispositifs.map(d => (
          <span key={d} className={`badge ${BADGE_DISP[d] || 'badge-ok'}`}>{d}</span>
        ))}
      </div>

      {/* Ligne 2 : saisie PP */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Appréciation PP + bouton Générer */}
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <textarea
            rows={2}
            placeholder={generating ? '✨ Génération en cours…' : 'Appréciation du professeur principal…'}
            value={eleve.appreciation_pp}
            onChange={e => onUpdate('appreciation_pp', e.target.value)}
            disabled={generating}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '8px 10px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: '0.85rem', resize: 'vertical',
              outline: 'none', fontFamily: 'inherit',
              opacity: generating ? 0.6 : 1,
            }}
          />
          {ollamaDisponible && (
            <button
              onClick={onGenerate}
              disabled={generating}
              title="Générer une appréciation via Ollama"
              style={{
                position: 'absolute', top: 6, right: 8,
                padding: '2px 10px', border: 'none', borderRadius: 6,
                cursor: generating ? 'default' : 'pointer',
                fontWeight: 600, fontSize: '0.75rem',
                background: generating ? '#e0e7ff' : '#6366f1',
                color: generating ? '#6366f1' : 'white',
                transition: 'all 0.2s',
              }}
            >
              {generating ? '⏳' : '✨ Générer'}
            </button>
          )}
        </div>

        {/* Mention */}
        <select
          value={eleve.mention}
          onChange={e => onUpdate('mention', e.target.value)}
          style={{
            padding: '8px 10px', border: '1px solid #e2e8f0',
            borderRadius: 8, fontSize: '0.85rem', outline: 'none',
            color: eleve.mention ? '#1e3a5f' : '#9ca3af',
            minWidth: 180,
          }}
        >
          {MENTIONS.map(m => (
            <option key={m} value={m}>{m || 'Aucune mention'}</option>
          ))}
        </select>

        {/* Bouton enregistrer */}
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '8px 16px', border: 'none', borderRadius: 8,
            cursor: saving ? 'default' : 'pointer',
            fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap',
            background: saved ? '#16a34a' : '#1e3a5f',
            color: 'white', transition: 'background 0.3s',
          }}
        >
          {saving ? '…' : saved ? '✓ Enregistré' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
