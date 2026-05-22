import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

const cardStyle = {
  background: 'white',
  borderRadius: 12,
  padding: '20px 24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  marginBottom: 20,
}

const badgeStyle = (bg, color) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 20,
  background: bg,
  color,
  fontSize: '0.75rem',
  fontWeight: 700,
})

const NIVEAU_COLORS = {
  alerte:    { bg: '#fee2e2', color: '#b91c1c' },
  attention: { bg: '#fef9c3', color: '#a16207' },
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 10,
      padding: '14px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      minWidth: 130,
      flex: 1,
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color || '#1e293b' }}>{value ?? '—'}</div>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default function RapportPage() {
  const [rapport, setRapport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState(null)
  const navigate = useNavigate()

  useEffect(() => { charger() }, [])

  function charger() {
    setLoading(true)
    setErreur(null)
    fetch(`${API}/rapport/hebdo`)
      .then(r => r.json())
      .then(d => { setRapport(d); setLoading(false) })
      .catch(() => { setErreur('Impossible de contacter le backend.'); setLoading(false) })
  }

  function exporter() {
    if (!rapport) return
    const lignes = []
    lignes.push(`RAPPORT PP TRACKER — Semaine du ${rapport.semaine_debut}`)
    lignes.push(`Généré le ${rapport.genere_le}`)
    lignes.push(`Classe : ${rapport.nb_eleves} élèves\n`)

    lignes.push('── STATS SEMAINE ──')
    const s = rapport.stats
    lignes.push(`Absences : ${s.nb_absences_semaine} (dont ${s.nb_absences_non_just} non justifiées, ${s.nb_eleves_touches} élève(s) concerné(s))`)
    lignes.push(`Contacts familles : ${s.nb_contacts_semaine}`)
    lignes.push(`Notes saisies : ${s.nb_notes_semaine}${s.moy_notes_semaine ? ` — moyenne ${s.moy_notes_semaine}/20` : ''}`)

    lignes.push('\n── ALERTES PP ──')
    if (rapport.alertes.length === 0) {
      lignes.push('Aucun élève en alerte cette semaine.')
    } else {
      rapport.alertes.forEach(a => {
        lignes.push(`${a.nom} ${a.prenom} [${a.niveau.toUpperCase()} — score ${a.score}]`)
        lignes.push(`  Abs. non just.: ${a.detail.absences_non_justifiees} | Moy: ${a.detail.moyenne_generale ?? '—'}/20`)
      })
    }

    lignes.push('\n── ABSENCES DE LA SEMAINE ──')
    if (rapport.absences.length === 0) {
      lignes.push('Aucune absence enregistrée cette semaine.')
    } else {
      rapport.absences.forEach(a => {
        const just = a.justifiee ? 'Justifiée' : 'Non justifiée'
        lignes.push(`${a.nom} ${a.prenom} — ${a.date_debut}${a.date_fin ? ` au ${a.date_fin}` : ''} [${just}]${a.motif ? ' — ' + a.motif : ''}`)
      })
    }

    lignes.push('\n── SANS CONTACT DEPUIS > 30 JOURS ──')
    if (rapport.sans_contact.length === 0) {
      lignes.push('Tous les élèves ont été contactés récemment.')
    } else {
      rapport.sans_contact.forEach(e => {
        const info = e.dernier_contact
          ? `dernier contact : ${e.dernier_contact} (${e.jours_sans_contact}j)`
          : 'aucun contact enregistré'
        lignes.push(`${e.nom} ${e.prenom} — ${info}`)
      })
    }

    const blob = new Blob([lignes.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `rapport_pp_${rapport.semaine_debut}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div style={{ padding: 40, color: '#6b7280' }}>Chargement du rapport…</div>
  if (erreur)  return <div style={{ padding: 40, color: '#b91c1c' }}>{erreur}</div>
  if (!rapport) return null

  const { stats, alertes, absences, sans_contact } = rapport

  return (
    <div style={{ maxWidth: 820, margin: '32px auto', padding: '0 16px' }}>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            📋 Rapport de la semaine
          </h2>
          <div style={{ fontSize: '0.83rem', color: '#6b7280', marginTop: 4 }}>
            Semaine du <strong>{rapport.semaine_debut}</strong> — {rapport.nb_eleves} élèves — généré le {rapport.genere_le}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={charger}
            style={{ padding: '7px 14px', background: '#f1f5f9', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            🔄 Actualiser
          </button>
          <button
            onClick={exporter}
            style={{ padding: '7px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            ⬇ Exporter .txt
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard
          label="Absences cette semaine"
          value={stats.nb_absences_semaine}
          sub={`dont ${stats.nb_absences_non_just} non justifiée(s)`}
          color={stats.nb_absences_non_just > 0 ? '#dc2626' : '#15803d'}
        />
        <StatCard
          label="Élèves touchés"
          value={stats.nb_eleves_touches}
          color="#7c3aed"
        />
        <StatCard
          label="Contacts familles"
          value={stats.nb_contacts_semaine}
          color="#2563eb"
        />
        <StatCard
          label="Notes saisies"
          value={stats.nb_notes_semaine}
          sub={stats.moy_notes_semaine ? `moy. ${stats.moy_notes_semaine}/20` : undefined}
          color="#0891b2"
        />
      </div>

      {/* Alertes PP */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: alertes.length ? 14 : 0 }}>
          🚨 Alertes PP
          <span style={{ marginLeft: 8, ...badgeStyle(alertes.length > 0 ? '#fee2e2' : '#dcfce7', alertes.length > 0 ? '#b91c1c' : '#15803d') }}>
            {alertes.length} élève{alertes.length !== 1 ? 's' : ''}
          </span>
        </h3>
        {alertes.length === 0 ? (
          <div style={{ fontSize: '0.88rem', color: '#6b7280' }}>✓ Aucun élève en alerte ou en vigilance.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alertes.map(a => (
              <div
                key={a.eleve_id}
                onClick={() => navigate(`/eleve/${a.eleve_id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: NIVEAU_COLORS[a.niveau]?.bg || '#f1f5f9',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                    {a.nom} {a.prenom}
                  </span>
                  <span style={{ marginLeft: 10, ...badgeStyle(NIVEAU_COLORS[a.niveau]?.bg, NIVEAU_COLORS[a.niveau]?.color) }}>
                    {a.niveau === 'alerte' ? '🔴 Alerte' : '🟡 Attention'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', gap: 14 }}>
                  <span>Score <strong>{a.score}</strong>/100</span>
                  <span>Abs. NJ : <strong>{a.detail.absences_non_justifiees}</strong></span>
                  {a.detail.moyenne_generale && <span>Moy. : <strong>{a.detail.moyenne_generale}/20</strong></span>}
                  {a.detail.dispositif_actif && <span style={{ color: '#7c3aed' }}>📋 Dispositif</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Absences de la semaine */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: absences.length ? 14 : 0 }}>
          📅 Absences de la semaine
          <span style={{ marginLeft: 8, ...badgeStyle('#f1f5f9', '#374151') }}>
            {absences.length}
          </span>
        </h3>
        {absences.length === 0 ? (
          <div style={{ fontSize: '0.88rem', color: '#6b7280' }}>✓ Aucune absence cette semaine.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#6b7280', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Élève</th>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Motif</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((a, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                  onClick={() => navigate(`/eleve/${a.eleve_id}`)}
                >
                  <td style={{ padding: '7px 8px', fontWeight: 600, color: '#1e293b' }}>
                    {a.nom} {a.prenom}
                  </td>
                  <td style={{ padding: '7px 8px', color: '#374151' }}>
                    {a.date_debut}{a.date_fin && a.date_fin !== a.date_debut ? ` → ${a.date_fin}` : ''}
                  </td>
                  <td style={{ padding: '7px 8px' }}>
                    <span style={badgeStyle(
                      a.justifiee ? '#dcfce7' : '#fee2e2',
                      a.justifiee ? '#15803d' : '#b91c1c',
                    )}>
                      {a.justifiee ? 'Justifiée' : 'Non justifiée'}
                    </span>
                  </td>
                  <td style={{ padding: '7px 8px', color: '#6b7280' }}>{a.motif || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sans contact */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: sans_contact.length ? 14 : 0 }}>
          📵 Sans contact famille depuis &gt; 30 jours
          <span style={{ marginLeft: 8, ...badgeStyle(sans_contact.length > 0 ? '#fef9c3' : '#dcfce7', sans_contact.length > 0 ? '#a16207' : '#15803d') }}>
            {sans_contact.length} élève{sans_contact.length !== 1 ? 's' : ''}
          </span>
        </h3>
        {sans_contact.length === 0 ? (
          <div style={{ fontSize: '0.88rem', color: '#6b7280' }}>✓ Tous les élèves ont été contactés récemment.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sans_contact.map(e => (
              <div
                key={e.eleve_id}
                onClick={() => navigate(`/eleve/${e.eleve_id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 14px',
                  borderRadius: 8,
                  background: '#fffbeb',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                  {e.nom} {e.prenom}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
                  {e.dernier_contact
                    ? `Dernier contact : ${e.dernier_contact} (il y a ${e.jours_sans_contact}j)`
                    : 'Aucun contact enregistré'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
