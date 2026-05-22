import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const API = 'http://127.0.0.1:8000'

const NIVEAU_COLOR  = { ok: '#16a34a', attention: '#d97706', alerte: '#dc2626' }
const NIVEAU_BG     = { ok: '#dcfce7', attention: '#fef9c3', alerte: '#fee2e2' }
const NIVEAU_LABEL  = { ok: 'Suivi normal', attention: 'À surveiller', alerte: 'Alerte PP' }

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/dashboard`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Chargement du tableau de bord…</div>
  if (!data)   return <div className="loading">Erreur de chargement.</div>

  const { nb_eleves, total_absences, abs_non_just, moy_abs_eleve,
          moy_generale, nb_dispositifs, matieres_stats, repartition, top_alerte } = data

  // Couleur des barres selon la moyenne
  const barColor = (moy) => {
    if (moy >= 14) return '#16a34a'
    if (moy >= 10) return '#d97706'
    return '#dc2626'
  }

  return (
    <>
      {/* Stats générales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <StatCard label="Élèves" value={nb_eleves} color="#1e3a5f" />
        <StatCard label="Moy. générale classe" value={moy_generale ? `${moy_generale}/20` : '—'} color="#1e3a5f" />
        <StatCard label="Moy. absences / élève" value={moy_abs_eleve} color="#d97706" />
        <StatCard label="Total absences" value={total_absences} color="#6b7280" />
        <StatCard label="Non justifiées" value={abs_non_just} color="#dc2626" />
        <StatCard label="Avec dispositif" value={nb_dispositifs} color="#7c3aed" />
      </div>

      {/* Répartition des niveaux */}
      <div className="card">
        <h2>Répartition du suivi</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          {['ok', 'attention', 'alerte'].map(n => (
            <div key={n} style={{
              flex: 1, textAlign: 'center', padding: '16px 8px',
              background: NIVEAU_BG[n], borderRadius: 10,
              border: `2px solid ${NIVEAU_COLOR[n]}20`
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: NIVEAU_COLOR[n] }}>
                {repartition[n]}
              </div>
              <div style={{ fontSize: '0.8rem', color: NIVEAU_COLOR[n], fontWeight: 600, marginTop: 4 }}>
                {NIVEAU_LABEL[n]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moyennes par matière */}
      <div className="card">
        <h2>Moyennes par matière</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={matieres_stats} layout="vertical"
            margin={{ top: 0, right: 20, left: 110, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
            <XAxis type="number" domain={[0, 20]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="matiere" tick={{ fontSize: 11 }} width={110} />
            <Tooltip
              formatter={(val) => [`${val}/20`, 'Moyenne']}
              contentStyle={{ borderRadius: 8, fontSize: '0.85rem' }}
            />
            <Bar dataKey="moyenne" radius={[0, 4, 4, 0]}>
              {matieres_stats.map((entry, i) => (
                <Cell key={i} fill={barColor(entry.moyenne)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, fontSize: '0.75rem', color: '#6b7280' }}>
          <span style={{ color: '#16a34a' }}>● ≥ 14</span>
          <span style={{ color: '#d97706' }}>● 10–14</span>
          <span style={{ color: '#dc2626' }}>● &lt; 10</span>
        </div>
      </div>

      {/* Élèves à suivre en priorité */}
      <div className="card">
        <h2>Élèves à suivre en priorité</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Élève</th>
                <th>Score d'alerte</th>
                <th>Niveau</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {top_alerte.map(e => (
                <tr key={e.id} onClick={() => navigate(`/eleve/${e.id}`)}
                  style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600 }}>{e.prenom} {e.nom}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 120, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${e.score}%`, height: '100%',
                          background: NIVEAU_COLOR[e.niveau], borderRadius: 4
                        }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700,
                        color: NIVEAU_COLOR[e.niveau] }}>{e.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: NIVEAU_BG[e.niveau],
                      color: NIVEAU_COLOR[e.niveau]
                    }}>
                      {NIVEAU_LABEL[e.niveau]}
                    </span>
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: '0.8rem' }}>→ fiche</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>{label}</div>
    </div>
  )
}
