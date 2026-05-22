import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const API = 'http://127.0.0.1:8000'

const COULEURS_MATIERES = [
  '#1e3a5f', '#dc2626', '#d97706', '#16a34a',
  '#7c3aed', '#0891b2', '#db2777', '#65a30d'
]

const BADGE_DISPOSITIF = {
  PAP: 'badge-pap', PPS: 'badge-pps', PPRE: 'badge-ppre', ESS: 'badge-ess',
}

const SCORE_COULEUR = { ok: '#16a34a', attention: '#d97706', alerte: '#dc2626' }
const SCORE_LABEL   = { ok: 'Suivi normal', attention: 'À surveiller', alerte: 'Alerte PP' }

// ── M9 constantes ─────────────────────────────────────────────────────────────

const CERTIF_STATUT_COLORS = {
  valide:     { bg: '#dcfce7', color: '#15803d', label: '✓ Validé' },
  repechage:  { bg: '#fef9c3', color: '#a16207', label: '~ Repêchage' },
  en_attente: { bg: '#f1f5f9', color: '#6b7280', label: '— En attente' },
}

const PARCOURS_ICONS = {
  EVARS:   '💞',
  Citoyen: '🏛️',
  Sante:   '🫀',
  PEAC:    '🎭',
}

const TYPES_DOCUMENTS = ['PAP', 'PPRE', 'PPS', 'ESS', 'Autre']
const DOC_COLORS = {
  PAP:  { bg: '#dbeafe', color: '#1d4ed8' },
  PPRE: { bg: '#fce7f3', color: '#be185d' },
  PPS:  { bg: '#ede9fe', color: '#7c3aed' },
  ESS:  { bg: '#dcfce7', color: '#15803d' },
  Autre:{ bg: '#f1f5f9', color: '#374151' },
}

export default function FicheElevePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [eleve, setEleve] = useState(null)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)

  // Formulaire contact
  const [contact, setContact] = useState({ date_contact: today(), type_contact: 'appel', contenu: '' })
  const [showContactForm, setShowContactForm] = useState(false)

  // Formulaire absence
  const [absence, setAbsence] = useState({ date_debut: today(), justifiee: false, motif: '' })
  const [showAbsenceForm, setShowAbsenceForm] = useState(false)

  // M9 — Profil & Parcours
  const [profil, setProfil] = useState(null)
  const [onglet, setOnglet] = useState('certifications') // 'certifications' | 'parcours' | 'documents'
  const [showDocForm, setShowDocForm] = useState(false)
  const [newDoc, setNewDoc] = useState({ type_document: 'PAP', titre: '', date_document: today(), preconisations: '' })
  const [docExpanded, setDocExpanded] = useState({}) // { [doc_id]: bool }
  const [savingCertif, setSavingCertif] = useState({})
  const [savingParcours, setSavingParcours] = useState({})

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  function chargerFiche() {
    return Promise.all([
      fetch(`${API}/eleves/${id}`).then(r => r.json()),
      fetch(`${API}/eleves/${id}/score`).then(r => r.json()),
    ]).then(([e, s]) => { setEleve(e); setScore(s); setLoading(false) })
  }

  function chargerProfil() {
    fetch(`${API}/eleves/${id}/profil`)
      .then(r => r.json())
      .then(data => setProfil(data))
      .catch(() => {})
  }

  useEffect(() => { chargerFiche() }, [id])
  useEffect(() => { chargerProfil() }, [id])

  async function soumettreContact(e) {
    e.preventDefault()
    await fetch(`${API}/eleves/${id}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
    setContact({ date_contact: today(), type_contact: 'appel', contenu: '' })
    setShowContactForm(false)
    chargerFiche()
  }

  async function soumettreAbsence(e) {
    e.preventDefault()
    await fetch(`${API}/eleves/${id}/absences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...absence, motif: absence.motif || null }),
    })
    setAbsence({ date_debut: today(), justifiee: false, motif: '' })
    setShowAbsenceForm(false)
    chargerFiche()
  }

  // ── M9 handlers ─────────────────────────────────────────────────────────────

  async function sauverCertif(type, statut, date_obtention, notes) {
    setSavingCertif(s => ({ ...s, [type]: true }))
    await fetch(`${API}/eleves/${id}/certifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, statut, date_obtention: date_obtention || null, notes: notes || null }),
    })
    setSavingCertif(s => ({ ...s, [type]: false }))
    chargerProfil()
  }

  async function sauverParcours(type, participation, valide) {
    setSavingParcours(s => ({ ...s, [type]: true }))
    await fetch(`${API}/eleves/${id}/parcours`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, participation, valide }),
    })
    setSavingParcours(s => ({ ...s, [type]: false }))
    chargerProfil()
  }

  async function ajouterDocument(e) {
    e.preventDefault()
    await fetch(`${API}/eleves/${id}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc),
    })
    setNewDoc({ type_document: 'PAP', titre: '', date_document: today(), preconisations: '' })
    setShowDocForm(false)
    chargerProfil()
  }

  async function supprimerDocument(docId) {
    if (!confirm('Supprimer ce document ?')) return
    await fetch(`${API}/documents/${docId}`, { method: 'DELETE' })
    chargerProfil()
  }

  async function sauverPreconisations(docId, preconisations) {
    await fetch(`${API}/documents/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preconisations }),
    })
    chargerProfil()
  }

  if (loading) return <div className="loading">Chargement de la fiche…</div>
  if (!eleve)  return <div className="loading">Élève introuvable.</div>

  const periodes  = [...new Set(eleve.appreciations.map(a => a.periode))].sort()
  const matieres  = [...new Set(eleve.appreciations.map(a => a.matiere))]

  const chartData = periodes.map(p => {
    const row = { periode: p }
    matieres.forEach(m => {
      const found = eleve.appreciations.find(a => a.periode === p && a.matiere === m)
      row[m] = found ? found.note : null
    })
    return row
  })

  const moyennes = periodes.map(p => {
    const notes = eleve.appreciations.filter(a => a.periode === p && a.note !== null).map(a => a.note)
    return notes.length ? (notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(1) : '—'
  })

  const initiales = `${eleve.prenom[0]}${eleve.nom[0]}`
  const couleurScore = score ? SCORE_COULEUR[score.niveau] : '#6b7280'

  return (
    <>
      <button className="btn-back" onClick={() => navigate('/')}>← Retour à la classe</button>

      {/* En-tête élève */}
      <div className="card">
        <div className="fiche-header">
          <div className="avatar">{initiales}</div>
          <div>
            <div className="nom">{eleve.prenom} {eleve.nom}</div>
            <div className="classe">{eleve.classe}</div>
            {eleve.dispositifs.length > 0 && (
              <div className="dispositifs-list">
                {eleve.dispositifs.map(d => (
                  <span key={d.id} className={`badge ${BADGE_DISPOSITIF[d.type] || 'badge-ok'}`}>{d.type}</span>
                ))}
              </div>
            )}
          </div>

          {/* Score d'alerte */}
          {score && (
            <div style={{ marginLeft: 24, textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: `4px solid ${couleurScore}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 4px'
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: couleurScore }}>{score.score}</div>
                <div style={{ fontSize: '0.6rem', color: '#9ca3af' }}>/100</div>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: couleurScore }}>
                {SCORE_LABEL[score.niveau]}
              </div>
            </div>
          )}

          {/* Moyennes par période */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            {periodes.map((p, i) => (
              <div key={p} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e3a5f' }}>{moyennes[i]}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Moy. {p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Détail score */}
        {score && (
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <Chip label={`${score.detail.absences_non_justifiees} abs. non justifiées`} color="#fee2e2" text="#991b1b" />
            <Chip label={`${score.detail.absences_justifiees} abs. justifiées`} color="#fef9c3" text="#854d0e" />
            {score.detail.moyenne_generale && (
              <Chip label={`Moy. générale : ${score.detail.moyenne_generale}/20`} color="#dbeafe" text="#1e40af" />
            )}
            {score.detail.dispositif_actif && (
              <Chip label="Dispositif actif" color="#ede9fe" text="#5b21b6" />
            )}
          </div>
        )}
      </div>

      {/* Graphe */}
      <div className="card">
        <h2>Évolution des notes</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
            <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(val, name) => [val !== null ? `${val}/20` : '—', name]}
              contentStyle={{ borderRadius: 8, fontSize: '0.85rem' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
            {matieres.map((m, i) => (
              <Line key={m} type="monotone" dataKey={m}
                stroke={COULEURS_MATIERES[i % COULEURS_MATIERES.length]}
                strokeWidth={2} dot={{ r: 4 }} connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        {/* Absences */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Absences ({eleve.absences.length})</h2>
            <button onClick={() => setShowAbsenceForm(v => !v)} style={btnStyle('#1e3a5f')}>
              {showAbsenceForm ? 'Annuler' : '+ Ajouter'}
            </button>
          </div>

          {showAbsenceForm && (
            <form onSubmit={soumettreAbsence} style={formStyle}>
              <label style={labelStyle}>Date</label>
              <input type="date" required style={inputStyle}
                value={absence.date_debut}
                onChange={e => setAbsence(a => ({ ...a, date_debut: e.target.value }))} />

              <label style={labelStyle}>
                <input type="checkbox" checked={absence.justifiee}
                  onChange={e => setAbsence(a => ({ ...a, justifiee: e.target.checked }))} />
                {' '}Justifiée
              </label>

              <label style={labelStyle}>Motif (optionnel)</label>
              <input type="text" style={inputStyle} placeholder="Maladie, RDV médical…"
                value={absence.motif}
                onChange={e => setAbsence(a => ({ ...a, motif: e.target.value }))} />

              <button type="submit" style={btnStyle('#16a34a')}>Enregistrer</button>
            </form>
          )}

          {eleve.absences.length === 0 && !showAbsenceForm ? (
            <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Aucune absence enregistrée.</p>
          ) : (
            eleve.absences.map(a => (
              <div key={a.id} className="absence-item">
                <span>{a.date_debut}</span>
                <span className={`badge ${a.justifiee ? 'badge-ok' : 'badge-alert'}`}>
                  {a.justifiee ? 'Justifiée' : 'Non justifiée'}
                </span>
                {a.motif && <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{a.motif}</span>}
              </div>
            ))
          )}
        </div>

        {/* Appréciations */}
        <div className="card">
          <h2>Appréciations</h2>
          {matieres.map(m => {
            const appres = eleve.appreciations.filter(a => a.matiere === m)
            return (
              <div key={m} className="appre-bloc">
                <div className="appre-matiere">{m}</div>
                {appres.map(a => (
                  <div key={a.id} className="appre-row">
                    <span style={{ minWidth: 24, color: '#9ca3af', fontSize: '0.78rem' }}>{a.periode}</span>
                    <span className="appre-note">{a.note}/20</span>
                    <span>{a.appreciation}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Contacts familles */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>
            Journal familles ({eleve.contacts.length})
          </h2>
          <button onClick={() => setShowContactForm(v => !v)} style={btnStyle('#1e3a5f')}>
            {showContactForm ? 'Annuler' : '+ Ajouter'}
          </button>
        </div>

        {showContactForm && (
          <form onSubmit={soumettreContact} style={formStyle}>
            <label style={labelStyle}>Date</label>
            <input type="date" required style={inputStyle}
              value={contact.date_contact}
              onChange={e => setContact(c => ({ ...c, date_contact: e.target.value }))} />

            <label style={labelStyle}>Type de contact</label>
            <select style={inputStyle} value={contact.type_contact}
              onChange={e => setContact(c => ({ ...c, type_contact: e.target.value }))}>
              <option value="appel">Appel téléphonique</option>
              <option value="mail">Mail</option>
              <option value="rencontre">Rencontre</option>
              <option value="note">Note interne</option>
            </select>

            <label style={labelStyle}>Contenu</label>
            <textarea required rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Résumé de l'échange…"
              value={contact.contenu}
              onChange={e => setContact(c => ({ ...c, contenu: e.target.value }))} />

            <button type="submit" style={btnStyle('#16a34a')}>Enregistrer</button>
          </form>
        )}

        {eleve.contacts.length === 0 && !showContactForm ? (
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Aucun contact enregistré.</p>
        ) : (
          eleve.contacts.map(c => (
            <div key={c.id} className="absence-item">
              <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{c.date_contact}</span>
              <span className="badge badge-pap">{c.type_contact}</span>
              <span style={{ fontSize: '0.85rem' }}>{c.contenu}</span>
            </div>
          ))
        )}
      </div>

      {/* ── M9 — Profil & Parcours ─────────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Profil & Parcours</h2>
          {/* Onglets */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { key: 'certifications', label: '🏅 Certifications' },
              { key: 'parcours',       label: '📚 Parcours' },
              { key: 'documents',      label: '📄 Documents' },
            ].map(t => (
              <button key={t.key} onClick={() => setOnglet(t.key)} style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: onglet === t.key ? 700 : 400,
                background: onglet === t.key ? '#1e3a5f' : '#f1f5f9',
                color: onglet === t.key ? 'white' : '#374151',
                transition: 'all 0.15s',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {!profil ? (
          <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>Chargement…</p>
        ) : (
          <>
            {/* ── Certifications ─────────────────────────────────────────────── */}
            {onglet === 'certifications' && (
              <CertificationsPanel
                certifications={profil.certifications}
                saving={savingCertif}
                onSave={sauverCertif}
              />
            )}

            {/* ── Parcours éducatifs ─────────────────────────────────────────── */}
            {onglet === 'parcours' && (
              <ParcoursPanel
                parcours={profil.parcours}
                saving={savingParcours}
                onSave={sauverParcours}
              />
            )}

            {/* ── Documents ──────────────────────────────────────────────────── */}
            {onglet === 'documents' && (
              <DocumentsPanel
                documents={profil.documents}
                showForm={showDocForm}
                newDoc={newDoc}
                docExpanded={docExpanded}
                onToggleForm={() => setShowDocForm(v => !v)}
                onChangeNewDoc={setNewDoc}
                onSubmitDoc={ajouterDocument}
                onDeleteDoc={supprimerDocument}
                onToggleExpand={(docId) => setDocExpanded(e => ({ ...e, [docId]: !e[docId] }))}
                onSavePreco={sauverPreconisations}
                today={today}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

// ── Certifications Panel ──────────────────────────────────────────────────────

function CertificationsPanel({ certifications, saving, onSave }) {
  // État local pour les modifications non encore sauvegardées
  const [local, setLocal] = useState(() =>
    Object.fromEntries(certifications.map(c => [c.type, {
      statut: c.statut || 'en_attente',
      date_obtention: c.date_obtention || '',
      notes: c.notes || '',
    }]))
  )

  function setField(type, field, value) {
    setLocal(l => ({ ...l, [type]: { ...l[type], [field]: value } }))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {certifications.map(c => {
        const vals = local[c.type] || { statut: 'en_attente', date_obtention: '', notes: '' }
        const sc = CERTIF_STATUT_COLORS[vals.statut] || CERTIF_STATUT_COLORS.en_attente
        return (
          <div key={c.type} style={{
            border: `1px solid ${sc.bg === '#f1f5f9' ? '#e2e8f0' : sc.bg}`,
            borderRadius: 10, padding: 14,
            background: sc.bg, transition: 'all 0.2s',
          }}>
            {/* Titre + badge statut */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e3a5f' }}>{c.type}</div>
              <span style={{
                padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem',
                fontWeight: 700, background: 'white', color: sc.color,
              }}>{sc.label}</span>
            </div>

            {/* Sélecteur statut */}
            <select
              value={vals.statut}
              onChange={e => setField(c.type, 'statut', e.target.value)}
              style={{ ...inputStyle, marginBottom: 6, fontSize: '0.82rem', background: 'white' }}
            >
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="repechage">Repêchage</option>
            </select>

            {/* Date d'obtention */}
            <input
              type="date"
              value={vals.date_obtention}
              onChange={e => setField(c.type, 'date_obtention', e.target.value)}
              style={{ ...inputStyle, marginBottom: 6, fontSize: '0.82rem', background: 'white' }}
            />

            {/* Notes */}
            <input
              type="text"
              placeholder="Notes (optionnel)…"
              value={vals.notes}
              onChange={e => setField(c.type, 'notes', e.target.value)}
              style={{ ...inputStyle, marginBottom: 10, fontSize: '0.82rem', background: 'white' }}
            />

            <button
              onClick={() => onSave(c.type, vals.statut, vals.date_obtention, vals.notes)}
              disabled={saving[c.type]}
              style={{
                ...btnStyle('#1e3a5f'), width: '100%', textAlign: 'center',
                opacity: saving[c.type] ? 0.6 : 1, fontSize: '0.8rem', padding: '5px 0',
              }}
            >
              {saving[c.type] ? '…' : '💾 Enregistrer'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Parcours Panel ────────────────────────────────────────────────────────────

function ParcoursPanel({ parcours, saving, onSave }) {
  const [local, setLocal] = useState(() =>
    Object.fromEntries(parcours.map(p => [p.type, {
      participation: p.participation || '',
      valide: !!p.valide,
    }]))
  )

  function setField(type, field, value) {
    setLocal(l => ({ ...l, [type]: { ...l[type], [field]: value } }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {parcours.map(p => {
        const vals = local[p.type] || { participation: '', valide: false }
        return (
          <div key={p.type} style={{
            border: `1px solid ${vals.valide ? '#bbf7d0' : '#e2e8f0'}`,
            borderRadius: 10, padding: 14,
            background: vals.valide ? '#f0fdf4' : '#fafafa',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{PARCOURS_ICONS[p.type] || '📌'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, color: '#1e3a5f', fontSize: '0.95rem' }}>{p.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.detail}</div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Participation, actions menées…"
                  value={vals.participation}
                  onChange={e => setField(p.type, 'participation', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', fontSize: '0.85rem', marginBottom: 8 }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: vals.valide ? '#15803d' : '#374151' }}>
                    <input
                      type="checkbox"
                      checked={vals.valide}
                      onChange={e => setField(p.type, 'valide', e.target.checked)}
                      style={{ width: 16, height: 16 }}
                    />
                    {vals.valide ? '✓ Validé' : 'Marquer comme validé'}
                  </label>

                  <button
                    onClick={() => onSave(p.type, vals.participation, vals.valide)}
                    disabled={saving[p.type]}
                    style={{ ...btnStyle('#1e3a5f'), fontSize: '0.8rem', padding: '5px 12px', opacity: saving[p.type] ? 0.6 : 1 }}
                  >
                    {saving[p.type] ? '…' : '💾 Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Documents Panel ───────────────────────────────────────────────────────────

function DocumentsPanel({ documents, showForm, newDoc, docExpanded, onToggleForm, onChangeNewDoc, onSubmitDoc, onDeleteDoc, onToggleExpand, onSavePreco, today }) {
  // État local pour édition des préconisations
  const [precoLocal, setPrecoLocal] = useState({})

  function setPreco(id, val) {
    setPrecoLocal(p => ({ ...p, [id]: val }))
  }

  function getPreco(doc) {
    return precoLocal[doc.id] !== undefined ? precoLocal[doc.id] : (doc.preconisations || '')
  }

  return (
    <div>
      {/* Bouton ajouter */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={onToggleForm} style={btnStyle('#1e3a5f')}>
          {showForm ? 'Annuler' : '+ Ajouter un document'}
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <form onSubmit={onSubmitDoc} style={{ ...formStyle, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={newDoc.type_document}
                onChange={e => onChangeNewDoc(d => ({ ...d, type_document: e.target.value }))}>
                {TYPES_DOCUMENTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Titre / intitulé</label>
              <input required type="text" style={inputStyle} placeholder="Ex : PAP 2024-2025 — mathématiques"
                value={newDoc.titre}
                onChange={e => onChangeNewDoc(d => ({ ...d, titre: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Date du document</label>
            <input type="date" style={inputStyle} value={newDoc.date_document}
              onChange={e => onChangeNewDoc(d => ({ ...d, date_document: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Préconisations (peut être rempli plus tard)</label>
            <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Aménagements, adaptations pédagogiques, points de vigilance…"
              value={newDoc.preconisations}
              onChange={e => onChangeNewDoc(d => ({ ...d, preconisations: e.target.value }))} />
          </div>
          <button type="submit" style={btnStyle('#16a34a')}>Enregistrer</button>
        </form>
      )}

      {/* Liste des documents */}
      {documents.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.88rem', textAlign: 'center', padding: 20 }}>
          Aucun document enregistré.<br />
          <span style={{ fontSize: '0.82rem' }}>Ajoutez un PAP, PPRE, PPS ou ESS via le bouton ci-dessus.</span>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {documents.map(doc => {
            const dc = DOC_COLORS[doc.type_document] || DOC_COLORS.Autre
            const isOpen = !!docExpanded[doc.id]
            return (
              <div key={doc.id} style={{
                border: `1px solid ${dc.bg}`, borderRadius: 10, overflow: 'hidden',
              }}>
                {/* En-tête document */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  background: dc.bg, cursor: 'pointer',
                }} onClick={() => onToggleExpand(doc.id)}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 8,
                    background: 'white', color: dc.color,
                    fontWeight: 700, fontSize: '0.8rem',
                  }}>{doc.type_document}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1e3a5f', fontSize: '0.9rem' }}>{doc.titre}</div>
                    {doc.date_document && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(doc.date_document + 'T00:00:00').toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  {doc.preconisations && (
                    <span style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic' }}>
                      {doc.preconisations.length > 60 ? doc.preconisations.slice(0, 60) + '…' : doc.preconisations}
                    </span>
                  )}
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteDoc(doc.id) }}
                    title="Supprimer"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#d1d5db', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 6,
                    }}
                    onMouseEnter={e => e.target.style.color = '#dc2626'}
                    onMouseLeave={e => e.target.style.color = '#d1d5db'}
                  >✕</button>
                </div>

                {/* Corps : préconisations éditable */}
                {isOpen && (
                  <div style={{ padding: 14, background: 'white' }}>
                    <label style={{ ...labelStyle, marginBottom: 6, display: 'block' }}>
                      Préconisations / aménagements
                    </label>
                    <textarea
                      rows={5}
                      value={getPreco(doc)}
                      onChange={e => setPreco(doc.id, e.target.value)}
                      placeholder="Aménagements pédagogiques, adaptations, points de vigilance…"
                      style={{ ...inputStyle, resize: 'vertical', marginBottom: 8, fontSize: '0.85rem' }}
                    />
                    <button
                      onClick={() => onSavePreco(doc.id, getPreco(doc))}
                      style={btnStyle('#16a34a')}
                    >
                      💾 Enregistrer les préconisations
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Utilitaires ───────────────────────────────────────────────────────────────

function Chip({ label, color, text }) {
  return (
    <span style={{
      background: color, color: text,
      padding: '3px 10px', borderRadius: 20,
      fontSize: '0.78rem', fontWeight: 600
    }}>{label}</span>
  )
}

const formStyle = {
  background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: 8, padding: '14px 16px', marginBottom: 16,
  display: 'flex', flexDirection: 'column', gap: 8
}
const labelStyle = { fontSize: '0.82rem', fontWeight: 600, color: '#374151' }
const inputStyle = {
  padding: '7px 10px', border: '1px solid #e2e8f0',
  borderRadius: 6, fontSize: '0.88rem', outline: 'none', width: '100%',
  boxSizing: 'border-box',
}
const btnStyle = (bg) => ({
  background: bg, color: 'white', border: 'none',
  borderRadius: 6, padding: '6px 14px', fontSize: '0.82rem',
  cursor: 'pointer', alignSelf: 'flex-start'
})
