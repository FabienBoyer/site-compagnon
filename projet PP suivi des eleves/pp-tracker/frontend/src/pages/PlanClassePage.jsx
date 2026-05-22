import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8000'

// ── Utilitaires ───────────────────────────────────────────────────────────────

function clef(l, c) { return `${l}-${c}` }

// ── Composant Siège ───────────────────────────────────────────────────────────

function Siege({ cle, eleve, onDragStart, onDrop, onDragOver, onDragLeave, survole }) {
  const occupe = !!eleve

  return (
    <div
      draggable={occupe}
      onDragStart={occupe ? (e) => onDragStart(e, 'seat', cle) : undefined}
      onDragOver={(e) => { e.preventDefault(); onDragOver(cle) }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDrop(cle) }}
      style={{
        width: 90,
        height: 56,
        borderRadius: 8,
        border: survole
          ? '2px dashed #3b82f6'
          : occupe ? '2px solid #cbd5e1' : '2px dashed #e2e8f0',
        background: survole
          ? '#eff6ff'
          : occupe ? '#f8fafc' : '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: occupe ? 'grab' : 'default',
        transition: 'all 0.1s',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {eleve ? (
        <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>
            {eleve.nom}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
            {eleve.prenom}
          </div>
        </div>
      ) : (
        <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>—</span>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function PlanClassePage() {
  const [plans, setPlans]           = useState([])
  const [planActif, setPlanActif]   = useState(null)   // plan complet chargé
  const [eleves, setEleves]         = useState([])      // tous les élèves
  const [grille, setGrille]         = useState({})      // { "l-c": eleve_id }
  const [survole, setSurvole]       = useState(null)    // clé du siège survolé
  const [dragging, setDragging]     = useState(null)    // { eleve_id, source, seat }
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [nomEdit, setNomEdit]       = useState('')
  const [lignes, setLignes]         = useState(5)
  const [colonnes, setColonnes]     = useState(6)
  const [showNouveauForm, setShowNouveauForm] = useState(false)
  const [nouveauNom, setNouveauNom] = useState('Plan 1')
  const [nouveauL, setNouveauL]     = useState(5)
  const [nouveauC, setNouveauC]     = useState(6)

  useEffect(() => {
    chargerEleves()
    chargerPlans()
  }, [])

  // ── Chargement ──────────────────────────────────────────────────────────────

  function chargerEleves() {
    fetch(`${API}/eleves`)
      .then(r => r.json())
      .then(setEleves)
      .catch(() => {})
  }

  function chargerPlans() {
    fetch(`${API}/plan-classe`)
      .then(r => r.json())
      .then(data => {
        setPlans(data)
        if (data.length > 0 && !planActif) {
          chargerPlan(data[0].id)
        }
      })
      .catch(() => {})
  }

  function chargerPlan(id) {
    fetch(`${API}/plan-classe/${id}`)
      .then(r => r.json())
      .then(data => {
        setPlanActif(data)
        setNomEdit(data.nom)
        setLignes(data.nb_lignes)
        setColonnes(data.nb_colonnes)
        // Convertir les clés string en int pour eleve_id
        const g = {}
        Object.entries(data.grille).forEach(([k, v]) => { g[k] = v })
        setGrille(g)
        setSaved(false)
      })
      .catch(() => {})
  }

  // ── Élèves non placés ───────────────────────────────────────────────────────

  const elevesPlaces = new Set(Object.values(grille).filter(Boolean))
  const elevesNonPlaces = eleves.filter(e => !elevesPlaces.has(e.id))

  // ── Drag & Drop ─────────────────────────────────────────────────────────────

  function handleDragStart(e, source, seatKey) {
    const eleve_id = source === 'sidebar'
      ? parseInt(e.currentTarget.dataset.eleveid)
      : grille[seatKey]
    setDragging({ eleve_id, source, seat: seatKey || null })
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDrop(targetKey) {
    if (!dragging) return
    const { eleve_id, source, seat: sourceSeat } = dragging

    setGrille(prev => {
      const next = { ...prev }
      // Qui est déjà sur la case cible ?
      const occupant = next[targetKey]

      // Placer l'élève sur la cible
      next[targetKey] = eleve_id

      // Libérer la source
      if (source === 'seat' && sourceSeat) {
        if (occupant) {
          // Échange : mettre l'ancien occupant sur la source
          next[sourceSeat] = occupant
        } else {
          delete next[sourceSeat]
        }
      }
      // Si source === 'sidebar' et cible avait quelqu'un → il retourne dans la sidebar (on ne stocke pas, il disparaît de la grille)

      return next
    })

    setSurvole(null)
    setDragging(null)
    setSaved(false)
  }

  function handleDropSidebar(e) {
    e.preventDefault()
    if (!dragging || dragging.source !== 'seat') return
    // Retirer l'élève de la grille → retour sidebar
    setGrille(prev => {
      const next = { ...prev }
      delete next[dragging.seat]
      return next
    })
    setDragging(null)
    setSaved(false)
  }

  // ── Sauvegarde ──────────────────────────────────────────────────────────────

  async function sauvegarder() {
    if (!planActif) return
    setSaving(true)
    try {
      await fetch(`${API}/plan-classe/${planActif.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nomEdit,
          nb_lignes: lignes,
          nb_colonnes: colonnes,
          grille,
        }),
      })
      setSaved(true)
      chargerPlans()
    } catch {}
    setSaving(false)
  }

  // ── Nouveau plan ─────────────────────────────────────────────────────────────

  async function creerPlan(e) {
    e.preventDefault()
    const r = await fetch(`${API}/plan-classe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: nouveauNom, nb_lignes: nouveauL, nb_colonnes: nouveauC }),
    })
    const data = await r.json()
    setShowNouveauForm(false)
    await chargerPlans()
    chargerPlan(data.id)
  }

  async function supprimerPlan(id) {
    if (!confirm('Supprimer ce plan ?')) return
    await fetch(`${API}/plan-classe/${id}`, { method: 'DELETE' })
    setPlanActif(null)
    setGrille({})
    chargerPlans().then(() => {
      // Charge le premier plan restant si possible
    })
    fetch(`${API}/plan-classe`)
      .then(r => r.json())
      .then(data => {
        setPlans(data)
        if (data.length > 0) chargerPlan(data[0].id)
      })
  }

  // ── Redimensionnement grille ─────────────────────────────────────────────────

  function changerDimensions(nl, nc) {
    setLignes(nl)
    setColonnes(nc)
    // Retirer les élèves dont la case n'existe plus
    setGrille(prev => {
      const next = {}
      Object.entries(prev).forEach(([k, v]) => {
        const [l, c] = k.split('-').map(Number)
        if (l < nl && c < nc) next[k] = v
      })
      return next
    })
    setSaved(false)
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* Panneau gauche : liste plans + élèves non placés */}
      <div style={{
        width: 200,
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}>

        {/* Plans */}
        <div style={{ padding: '14px 12px 8px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Plans
            <button
              onClick={() => setShowNouveauForm(true)}
              style={{ fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: 0, lineHeight: 1 }}
              title="Nouveau plan"
            >＋</button>
          </div>

          {showNouveauForm && (
            <form onSubmit={creerPlan} style={{ marginBottom: 8 }}>
              <input
                value={nouveauNom}
                onChange={e => setNouveauNom(e.target.value)}
                placeholder="Nom"
                style={{ width: '100%', padding: '4px 6px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: '0.8rem', boxSizing: 'border-box', marginBottom: 4 }}
              />
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                <input type="number" min={2} max={10} value={nouveauL} onChange={e => setNouveauL(+e.target.value)}
                  style={{ width: '50%', padding: '3px 5px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: '0.8rem' }} />
                <input type="number" min={2} max={10} value={nouveauC} onChange={e => setNouveauC(+e.target.value)}
                  style={{ width: '50%', padding: '3px 5px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: '0.8rem' }} />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="submit" style={{ flex: 1, padding: '3px 0', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem' }}>Créer</button>
                <button type="button" onClick={() => setShowNouveauForm(false)} style={{ flex: 1, padding: '3px 0', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem' }}>Annuler</button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {plans.map(p => (
              <div
                key={p.id}
                onClick={() => chargerPlan(p.id)}
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: planActif?.id === p.id ? '#eff6ff' : 'transparent',
                  border: planActif?.id === p.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: planActif?.id === p.id ? 700 : 400, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.nom}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); supprimerPlan(p.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.8rem', padding: '0 2px', flexShrink: 0 }}
                  title="Supprimer"
                >✕</button>
              </div>
            ))}
            {plans.length === 0 && (
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', padding: '4px 0' }}>Aucun plan. Cliquez sur ＋</div>
            )}
          </div>
        </div>

        {/* Élèves non placés */}
        <div
          style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropSidebar}
        >
          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151', marginBottom: 8 }}>
            Élèves ({elevesNonPlaces.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {elevesNonPlaces.map(e => (
              <div
                key={e.id}
                draggable
                data-eleveid={e.id}
                onDragStart={ev => handleDragStart(ev, 'sidebar', null)}
                style={{
                  padding: '5px 8px',
                  borderRadius: 6,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'grab',
                  fontSize: '0.78rem',
                  color: '#1e293b',
                  userSelect: 'none',
                }}
              >
                <strong>{e.nom}</strong> {e.prenom}
              </div>
            ))}
            {elevesNonPlaces.length === 0 && eleves.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Tous placés ✓</div>
            )}
          </div>
        </div>
      </div>

      {/* Zone principale : grille */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#f8fafc' }}>

        {!planActif ? (
          <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: 40, textAlign: 'center' }}>
            Sélectionnez ou créez un plan de classe.
          </div>
        ) : (
          <>
            {/* Barre d'outils */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <input
                value={nomEdit}
                onChange={e => { setNomEdit(e.target.value); setSaved(false) }}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem', fontWeight: 600, width: 180 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#374151' }}>
                <span>Lignes</span>
                <input type="number" min={2} max={10} value={lignes}
                  onChange={e => changerDimensions(+e.target.value, colonnes)}
                  style={{ width: 48, padding: '4px 6px', borderRadius: 6, border: '1px solid #d1d5db', textAlign: 'center' }} />
                <span>×</span>
                <input type="number" min={2} max={10} value={colonnes}
                  onChange={e => changerDimensions(lignes, +e.target.value)}
                  style={{ width: 48, padding: '4px 6px', borderRadius: 6, border: '1px solid #d1d5db', textAlign: 'center' }} />
                <span>colonnes</span>
              </div>
              <button
                onClick={sauvegarder}
                disabled={saving}
                style={{
                  padding: '7px 18px',
                  background: saved ? '#dcfce7' : '#3b82f6',
                  color: saved ? '#15803d' : 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: saving ? 'default' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
              >
                {saving ? 'Enregistrement…' : saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
              </button>
            </div>

            {/* Tableau (zone prof) */}
            <div style={{
              width: colonnes * 102,
              maxWidth: '100%',
              margin: '0 auto 28px',
              padding: '10px 0',
              textAlign: 'center',
              background: '#1e293b',
              color: 'white',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: 2,
            }}>
              TABLEAU
            </div>

            {/* Grille de sièges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              {Array.from({ length: lignes }, (_, l) => (
                <div key={l} style={{ display: 'flex', gap: 10 }}>
                  {Array.from({ length: colonnes }, (_, c) => {
                    const k = clef(l, c)
                    const eleve_id = grille[k]
                    const eleve = eleve_id ? eleves.find(e => e.id === eleve_id) : null
                    return (
                      <Siege
                        key={k}
                        cle={k}
                        eleve={eleve}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={k => setSurvole(k)}
                        onDragLeave={() => setSurvole(null)}
                        survole={survole === k}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
              Glissez les élèves depuis la liste de gauche vers les sièges · Glissez entre sièges pour échanger · Glissez vers la liste pour retirer
            </div>
          </>
        )}
      </div>
    </div>
  )
}
