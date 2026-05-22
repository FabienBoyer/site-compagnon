import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://127.0.0.1:8000'

function AbsenceBadge({ nb }) {
  if (nb === 0) return <span className="badge badge-ok">0</span>
  if (nb <= 3)  return <span className="badge badge-warn">{nb}</span>
  return <span className="badge badge-alert">{nb}</span>
}

export default function ClassePage() {
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/eleves`)
      .then(r => r.json())
      .then(data => { setEleves(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtres = eleves.filter(e =>
    `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase())
  )

  const nbAlerte = eleves.filter(e => e.nb_absences > 3).length

  if (loading) return <div className="loading">Chargement de la classe…</div>

  return (
    <>
      {/* Stats rapides */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <StatCard label="Élèves" value={eleves.length} color="#1e3a5f" />
        <StatCard label="Absences > 3" value={nbAlerte} color="#dc2626" />
        <StatCard
          label="Moy. absences"
          value={(eleves.reduce((s, e) => s + e.nb_absences, 0) / (eleves.length || 1)).toFixed(1)}
          color="#d97706"
        />
      </div>

      <div className="card">
        <h2>Liste de la classe</h2>

        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher un élève…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
            borderRadius: 8, marginBottom: 16, fontSize: '0.9rem', outline: 'none'
          }}
        />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Absences</th>
              </tr>
            </thead>
            <tbody>
              {filtres.map((e, i) => (
                <tr key={e.id} onClick={() => navigate(`/eleve/${e.id}`)}>
                  <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{e.nom}</td>
                  <td>{e.prenom}</td>
                  <td><AbsenceBadge nb={e.nb_absences} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtres.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>
            Aucun élève trouvé.
          </p>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>{label}</div>
    </div>
  )
}
