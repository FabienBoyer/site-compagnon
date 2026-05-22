import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:8000'

const TYPES = ['', 'appel', 'mail', 'rencontre', 'courrier', 'sms']
const TYPE_COLOR = {
  appel:     { bg: '#dbeafe', color: '#1d4ed8' },
  mail:      { bg: '#e0e7ff', color: '#4338ca' },
  rencontre: { bg: '#dcfce7', color: '#15803d' },
  courrier:  { bg: '#fef9c3', color: '#a16207' },
  sms:       { bg: '#fce7f3', color: '#be185d' },
}
const TYPE_ICONE = {
  appel: '📞', mail: '✉️', rencontre: '🤝', courrier: '📬', sms: '💬'
}

export default function FamillesPage() {
  const [contacts, setContacts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filtre, setFiltre]       = useState('')
  const [recherche, setRecherche] = useState('')
  const navigate = useNavigate()

  const charger = useCallback(() => {
    setLoading(true)
    const url = filtre ? `${API}/contacts?type_contact=${filtre}` : `${API}/contacts`
    fetch(url)
      .then(r => r.json())
      .then(data => { setContacts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filtre])

  useEffect(() => { charger() }, [charger])

  async function supprimer(id) {
    if (!confirm('Supprimer ce contact ?')) return
    await fetch(`${API}/contacts/${id}`, { method: 'DELETE' })
    setContacts(c => c.filter(x => x.id !== id))
  }

  const contactsFiltres = contacts.filter(c => {
    if (!recherche) return true
    const q = recherche.toLowerCase()
    return (
      c.nom.toLowerCase().includes(q) ||
      c.prenom.toLowerCase().includes(q) ||
      c.contenu?.toLowerCase().includes(q)
    )
  })

  // Grouper par date
  const parDate = contactsFiltres.reduce((acc, c) => {
    const d = c.date_contact
    if (!acc[d]) acc[d] = []
    acc[d].push(c)
    return acc
  }, {})

  return (
    <>
      {/* En-tête */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, border: 'none', padding: 0, color: '#1e3a5f', fontSize: '1.1rem' }}>
            Journal des contacts familles
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 4 }}>
            {contacts.length} contact{contacts.length > 1 ? 's' : ''} enregistré{contacts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher un élève ou mot-clé…"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            style={{
              padding: '6px 12px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: '0.85rem', outline: 'none', minWidth: 220,
            }}
          />
          {/* Filtre type */}
          <select
            value={filtre}
            onChange={e => setFiltre(e.target.value)}
            style={{
              padding: '6px 12px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: '0.85rem', outline: 'none',
            }}
          >
            <option value="">Tous les types</option>
            {TYPES.filter(Boolean).map(t => (
              <option key={t} value={t}>{TYPE_ICONE[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement…</div>
      ) : contactsFiltres.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
          Aucun contact trouvé.<br />
          <span style={{ fontSize: '0.85rem' }}>Ajoutez des contacts depuis la fiche de chaque élève.</span>
        </div>
      ) : (
        Object.entries(parDate)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, items]) => (
            <div key={date} style={{ marginBottom: 20 }}>
              {/* Séparateur de date */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
              }}>
                <div style={{
                  padding: '3px 12px', borderRadius: 20,
                  background: '#1e3a5f', color: 'white',
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </div>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Contacts du jour */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(c => {
                  const style = TYPE_COLOR[c.type_contact] || { bg: '#f1f5f9', color: '#374151' }
                  return (
                    <div key={c.id} className="card" style={{
                      marginBottom: 0, display: 'flex', gap: 14, alignItems: 'flex-start',
                    }}>
                      {/* Badge type */}
                      <div style={{
                        padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap',
                        background: style.bg, color: style.color,
                        fontWeight: 700, fontSize: '0.8rem', marginTop: 2,
                      }}>
                        {TYPE_ICONE[c.type_contact] || '📋'} {c.type_contact}
                      </div>

                      {/* Contenu */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontWeight: 700, color: '#1e3a5f', cursor: 'pointer', fontSize: '0.92rem' }}
                          onClick={() => navigate(`/eleve/${c.eleve_id}`)}
                        >
                          {c.prenom} {c.nom}
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>
                            → voir la fiche
                          </span>
                        </div>
                        {c.contenu && (
                          <div style={{ color: '#4b5563', fontSize: '0.85rem', marginTop: 4, fontStyle: 'italic' }}>
                            {c.contenu}
                          </div>
                        )}
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => supprimer(c.id)}
                        title="Supprimer ce contact"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#d1d5db', fontSize: '1rem', padding: '2px 6px',
                          borderRadius: 6, transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.color = '#dc2626'}
                        onMouseLeave={e => e.target.style.color = '#d1d5db'}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
      )}
    </>
  )
}
