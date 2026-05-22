/**
 * OrientationPage.jsx — M11 Orientation scolaire
 *
 * Vue liste : tous les élèves avec leur statut d'orientation (voie, spécialités, entretien, stages).
 * Clic sur un élève → panneau latéral droit avec la fiche complète éditable.
 */

import { useEffect, useState } from 'react'

const API = 'http://localhost:8000'

const VOIES = [
  { value: 'générale',        label: '📚 Voie générale' },
  { value: 'technologique',   label: '🔧 Voie technologique' },
  { value: 'professionnelle', label: '🏭 Voie professionnelle' },
  { value: 'indéfini',        label: '❓ Non défini' },
]

const SPECIALITES_LYCEE = [
  'Mathématiques', 'NSI', 'Physique-Chimie', 'SVT',
  'SES', 'Histoire-Géographie-Géopolitique', 'Humanités-Littérature-Philosophie',
  'LLCER', 'AMC', 'Arts', 'EPS', 'STMG', 'STI2D', 'ST2S', 'STL', 'STD2A',
]

const VOIE_COLORS = {
  générale:        { bg: '#dbeafe', color: '#1d4ed8' },
  technologique:   { bg: '#fef9c3', color: '#a16207' },
  professionnelle: { bg: '#dcfce7', color: '#15803d' },
  indéfini:        { bg: '#f3f4f6', color: '#6b7280' },
}

function Badge({ voie }) {
  if (!voie) return <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
  const c = VOIE_COLORS[voie] || { bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      background: c.bg, color: c.color,
      borderRadius: 99, padding: '2px 10px',
      fontSize: '0.78rem', fontWeight: 600,
    }}>
      {voie}
    </span>
  )
}

function SpecTag({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#eff6ff', color: '#1d4ed8',
      borderRadius: 6, padding: '2px 8px',
      fontSize: '0.8rem', fontWeight: 500,
    }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#93c5fd', fontWeight: 700, padding: 0, lineHeight: 1,
        }}>×</button>
      )}
    </span>
  )
}

export default function OrientationPage() {
  const [eleves, setEleves] = useState([])
  const [selected, setSelected] = useState(null)   // { eleve_id, nom, prenom, ... }
  const [fiche, setFiche] = useState(null)          // orientation data
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // ── Formulaire orientation ────────────────────────────────────────────────
  const [form, setForm] = useState({
    date_entretien: '',
    voie_envisagee: '',
    specialites: [],
    projet_pro: '',
    notes_pp: '',
  })

  // ── Formulaire stage ──────────────────────────────────────────────────────
  const [stageForm, setStageForm] = useState({
    date_debut: '', date_fin: '', entreprise: '', secteur: '', bilan: '',
  })
  const [ajoutStage, setAjoutStage] = useState(false)

  // ── Filtre ────────────────────────────────────────────────────────────────
  const [filtre, setFiltre] = useState('')
  const [filtreVoie, setFiltreVoie] = useState('')

  useEffect(() => {
    fetch(`${API}/orientation`)
      .then(r => r.json())
      .then(data => { setEleves(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const chargerFiche = async (eleve) => {
    setSelected(eleve)
    setSaved(false)
    setAjoutStage(false)
    const [o, s] = await Promise.all([
      fetch(`${API}/eleves/${eleve.eleve_id}/orientation`).then(r => r.json()),
      fetch(`${API}/eleves/${eleve.eleve_id}/stages`).then(r => r.json()),
    ])
    setFiche(o)
    setStages(s)
    setForm({
      date_entretien: o.date_entretien || '',
      voie_envisagee: o.voie_envisagee || '',
      specialites:    o.specialites || [],
      projet_pro:     o.projet_pro || '',
      notes_pp:       o.notes_pp || '',
    })
    setStageForm({ date_debut: '', date_fin: '', entreprise: '', secteur: '', bilan: '' })
  }

  const sauvegarder = async () => {
    if (!selected) return
    setSaving(true)
    const payload = {
      ...form,
      specialites: form.specialites,
    }
    await fetch(`${API}/eleves/${selected.eleve_id}/orientation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    setSaved(true)
    // Mettre à jour la liste
    setEleves(prev => prev.map(e =>
      e.eleve_id === selected.eleve_id
        ? { ...e, voie_envisagee: form.voie_envisagee, nb_specialites: form.specialites.length, date_entretien: form.date_entretien }
        : e
    ))
  }

  const toggleSpec = (spec) => {
    setSaved(false)
    setForm(f => ({
      ...f,
      specialites: f.specialites.includes(spec)
        ? f.specialites.filter(s => s !== spec)
        : [...f.specialites, spec],
    }))
  }

  const soumettreStage = async () => {
    if (!selected) return
    await fetch(`${API}/eleves/${selected.eleve_id}/stages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stageForm),
    })
    const s = await fetch(`${API}/eleves/${selected.eleve_id}/stages`).then(r => r.json())
    setStages(s)
    setStageForm({ date_debut: '', date_fin: '', entreprise: '', secteur: '', bilan: '' })
    setAjoutStage(false)
    // Mettre à jour nb_stages dans la liste
    setEleves(prev => prev.map(e =>
      e.eleve_id === selected.eleve_id ? { ...e, nb_stages: s.length } : e
    ))
  }

  const supprimerStage = async (id) => {
    await fetch(`${API}/stages/${id}`, { method: 'DELETE' })
    setStages(prev => prev.filter(s => s.id !== id))
    setEleves(prev => prev.map(e =>
      e.eleve_id === selected.eleve_id ? { ...e, nb_stages: Math.max(0, e.nb_stages - 1) } : e
    ))
  }

  // ── Filtrage ─────────────────────────────────────────────────────────────
  const elevesFiltres = eleves.filter(e => {
    const q = filtre.toLowerCase()
    const matchNom = `${e.nom} ${e.prenom}`.toLowerCase().includes(q)
    const matchVoie = filtreVoie ? e.voie_envisagee === filtreVoie : true
    return matchNom && matchVoie
  })

  const stats = {
    total: eleves.length,
    entretiens: eleves.filter(e => e.date_entretien).length,
    generale: eleves.filter(e => e.voie_envisagee === 'générale').length,
    techno: eleves.filter(e => e.voie_envisagee === 'technologique').length,
    pro: eleves.filter(e => e.voie_envisagee === 'professionnelle').length,
    sansVoie: eleves.filter(e => !e.voie_envisagee || e.voie_envisagee === 'indéfini').length,
  }

  if (loading) return <div style={{ padding: 32, color: '#6b7280' }}>Chargement…</div>

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Panneau gauche : liste ───────────────────────────────────────── */}
      <div style={{
        width: selected ? 340 : '100%',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        borderRight: selected ? '1px solid #e5e7eb' : 'none',
        overflow: 'hidden',
      }}>
        {/* Stats */}
        <div style={{
          display: 'flex', gap: 12, padding: '14px 16px',
          background: '#f8fafc', borderBottom: '1px solid #e5e7eb',
          flexShrink: 0, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Élèves', val: stats.total, color: '#1d4ed8' },
            { label: 'Entretiens', val: `${stats.entretiens}/${stats.total}`, color: '#15803d' },
            { label: 'Générale', val: stats.generale, color: '#1d4ed8' },
            { label: 'Techno', val: stats.techno, color: '#a16207' },
            { label: 'Pro', val: stats.pro, color: '#15803d' },
            { label: 'Non défini', val: stats.sansVoie, color: '#6b7280' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          borderBottom: '1px solid #e5e7eb', flexShrink: 0,
        }}>
          <input
            placeholder="Rechercher un élève…"
            value={filtre}
            onChange={e => setFiltre(e.target.value)}
            style={{
              flex: 1, padding: '6px 10px', borderRadius: 6,
              border: '1px solid #d1d5db', fontSize: '0.85rem',
            }}
          />
          <select
            value={filtreVoie}
            onChange={e => setFiltreVoie(e.target.value)}
            style={{
              padding: '6px 8px', borderRadius: 6,
              border: '1px solid #d1d5db', fontSize: '0.85rem',
              color: filtreVoie ? '#1f2937' : '#9ca3af',
            }}
          >
            <option value="">Toutes voies</option>
            {VOIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>

        {/* Liste élèves */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {elevesFiltres.map(e => {
            const isActive = selected?.eleve_id === e.eleve_id
            return (
              <div
                key={e.eleve_id}
                onClick={() => chargerFiche(e)}
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  background: isActive ? '#eff6ff' : 'white',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {e.nom} {e.prenom}
                  </span>
                  <Badge voie={e.voie_envisagee} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.78rem', color: '#6b7280' }}>
                  <span>
                    {e.date_entretien
                      ? `✅ Entretien ${e.date_entretien}`
                      : '⏳ Pas d\'entretien'}
                  </span>
                  {e.nb_specialites > 0 && <span>📚 {e.nb_specialites} spé.</span>}
                  {e.nb_stages > 0 && <span>🏢 {e.nb_stages} stage{e.nb_stages > 1 ? 's' : ''}</span>}
                </div>
              </div>
            )
          })}
          {elevesFiltres.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
              Aucun élève trouvé
            </div>
          )}
        </div>
      </div>

      {/* ── Panneau droit : fiche orientation ───────────────────────────── */}
      {selected && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* En-tête */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                🎯 {selected.nom} {selected.prenom}
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 2 }}>
                Fiche orientation — 2nde 1
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={sauvegarder}
                disabled={saving}
                style={{
                  padding: '7px 18px', borderRadius: 7,
                  background: saved ? '#16a34a' : '#3b82f6',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.88rem',
                  transition: 'background 0.2s',
                }}
              >
                {saving ? '…' : saved ? '✓ Enregistré' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{
                  padding: '7px 12px', borderRadius: 7,
                  background: '#f3f4f6', border: '1px solid #d1d5db',
                  cursor: 'pointer', fontSize: '0.88rem', color: '#374151',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Entretien */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.9rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
              📅 Entretien d'orientation
            </h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="date"
                value={form.date_entretien}
                onChange={e => { setForm(f => ({ ...f, date_entretien: e.target.value })); setSaved(false) }}
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  border: '1px solid #d1d5db', fontSize: '0.88rem',
                }}
              />
              {form.date_entretien && (
                <span style={{ fontSize: '0.82rem', color: '#15803d' }}>✅ Entretien réalisé</span>
              )}
              {!form.date_entretien && (
                <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Aucun entretien enregistré</span>
              )}
            </div>
          </section>

          {/* Voie envisagée */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.9rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
              🛤️ Voie envisagée
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {VOIES.map(v => {
                const active = form.voie_envisagee === v.value
                const c = VOIE_COLORS[v.value]
                return (
                  <button
                    key={v.value}
                    onClick={() => { setForm(f => ({ ...f, voie_envisagee: active ? '' : v.value })); setSaved(false) }}
                    style={{
                      padding: '6px 14px', borderRadius: 20,
                      border: active ? `2px solid ${c.color}` : '2px solid #e5e7eb',
                      background: active ? c.bg : 'white',
                      color: active ? c.color : '#6b7280',
                      cursor: 'pointer', fontWeight: active ? 700 : 400,
                      fontSize: '0.85rem', transition: 'all 0.15s',
                    }}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Spécialités (si voie générale ou techno) */}
          {(form.voie_envisagee === 'générale' || form.voie_envisagee === 'technologique' || !form.voie_envisagee) && (
            <section style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.9rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
                📚 Spécialités envisagées
              </h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {form.specialites.length > 0
                  ? form.specialites.map(s => (
                      <SpecTag key={s} label={s} onRemove={() => toggleSpec(s)} />
                    ))
                  : <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Aucune spécialité sélectionnée</span>
                }
              </div>
              <div style={{
                display: 'flex', gap: 6, flexWrap: 'wrap',
                padding: 10, background: '#f8fafc',
                borderRadius: 8, border: '1px solid #e5e7eb',
              }}>
                {SPECIALITES_LYCEE.map(s => {
                  const sel = form.specialites.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSpec(s)}
                      style={{
                        padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
                        border: sel ? '1.5px solid #3b82f6' : '1.5px solid #e5e7eb',
                        background: sel ? '#dbeafe' : 'white',
                        color: sel ? '#1d4ed8' : '#6b7280',
                        fontSize: '0.78rem', fontWeight: sel ? 600 : 400,
                        transition: 'all 0.1s',
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Projet professionnel */}
          <section style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.9rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
              💼 Projet professionnel
            </h3>
            <input
              placeholder="Métier envisagé, secteur d'activité…"
              value={form.projet_pro}
              onChange={e => { setForm(f => ({ ...f, projet_pro: e.target.value })); setSaved(false) }}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: 6,
                border: '1px solid #d1d5db', fontSize: '0.88rem', boxSizing: 'border-box',
              }}
            />
          </section>

          {/* Notes PP */}
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.9rem', color: '#374151', marginBottom: 8, fontWeight: 700 }}>
              📝 Notes PP
            </h3>
            <textarea
              rows={4}
              placeholder="Observations, points d'attention, remarques sur le parcours d'orientation…"
              value={form.notes_pp}
              onChange={e => { setForm(f => ({ ...f, notes_pp: e.target.value })); setSaved(false) }}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 6,
                border: '1px solid #d1d5db', fontSize: '0.88rem',
                resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </section>

          {/* Stages de découverte */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: '0.9rem', color: '#374151', margin: 0, fontWeight: 700 }}>
                🏢 Stages de découverte
              </h3>
              <button
                onClick={() => setAjoutStage(a => !a)}
                style={{
                  padding: '5px 12px', borderRadius: 6,
                  background: ajoutStage ? '#f3f4f6' : '#eff6ff',
                  border: '1px solid #dbeafe', cursor: 'pointer',
                  fontSize: '0.82rem', color: '#1d4ed8', fontWeight: 600,
                }}
              >
                {ajoutStage ? 'Annuler' : '+ Ajouter un stage'}
              </button>
            </div>

            {/* Formulaire ajout stage */}
            {ajoutStage && (
              <div style={{
                background: '#f8fafc', borderRadius: 8,
                border: '1px solid #e5e7eb', padding: 14, marginBottom: 12,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#6b7280', display: 'block', marginBottom: 3 }}>
                      Début
                    </label>
                    <input type="date"
                      value={stageForm.date_debut}
                      onChange={e => setStageForm(f => ({ ...f, date_debut: e.target.value }))}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: '1px solid #d1d5db', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#6b7280', display: 'block', marginBottom: 3 }}>
                      Fin
                    </label>
                    <input type="date"
                      value={stageForm.date_fin}
                      onChange={e => setStageForm(f => ({ ...f, date_fin: e.target.value }))}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: '1px solid #d1d5db', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#6b7280', display: 'block', marginBottom: 3 }}>
                      Entreprise / Structure
                    </label>
                    <input
                      placeholder="Nom de l'entreprise"
                      value={stageForm.entreprise}
                      onChange={e => setStageForm(f => ({ ...f, entreprise: e.target.value }))}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: '1px solid #d1d5db', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#6b7280', display: 'block', marginBottom: 3 }}>
                      Secteur
                    </label>
                    <input
                      placeholder="Ex : Santé, Informatique, Commerce…"
                      value={stageForm.secteur}
                      onChange={e => setStageForm(f => ({ ...f, secteur: e.target.value }))}
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: '1px solid #d1d5db', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: '0.78rem', color: '#6b7280', display: 'block', marginBottom: 3 }}>
                    Bilan / Observations
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ce que l'élève en a retiré, points de vigilance…"
                    value={stageForm.bilan}
                    onChange={e => setStageForm(f => ({ ...f, bilan: e.target.value }))}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: 5, border: '1px solid #d1d5db', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
                <button
                  onClick={soumettreStage}
                  style={{
                    padding: '6px 16px', borderRadius: 6,
                    background: '#3b82f6', color: 'white',
                    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}
                >
                  Ajouter
                </button>
              </div>
            )}

            {/* Liste des stages */}
            {stages.length === 0 && !ajoutStage && (
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', padding: '8px 0' }}>
                Aucun stage enregistré.
              </div>
            )}
            {stages.map(s => (
              <div key={s.id} style={{
                background: '#f8fafc', borderRadius: 8,
                border: '1px solid #e5e7eb', padding: '10px 14px',
                marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1f2937' }}>
                    🏢 {s.entreprise || 'Entreprise non précisée'}
                    {s.secteur && <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: 6 }}>— {s.secteur}</span>}
                  </div>
                  {(s.date_debut || s.date_fin) && (
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>
                      📅 {s.date_debut || '?'} → {s.date_fin || '?'}
                    </div>
                  )}
                  {s.bilan && (
                    <div style={{ fontSize: '0.82rem', color: '#374151', marginTop: 4 }}>
                      {s.bilan}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => supprimerStage(s.id)}
                  title="Supprimer ce stage"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#f87171', fontSize: '1rem', padding: '0 4px', flexShrink: 0,
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </section>

          <div style={{ height: 32 }} />
        </div>
      )}
    </div>
  )
}
