import { useState, useRef } from 'react'

const API = 'http://127.0.0.1:8000'

export default function OcrPage() {
  const [etat, setEtat]         = useState('idle')   // idle | loading | done | error
  const [resultat, setResultat] = useState(null)
  const [erreur, setErreur]     = useState('')
  const [fichierNom, setFichierNom] = useState('')
  const [importStatus, setImportStatus] = useState({}) // { eleve_id: 'ok'|'error' }
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  async function analyser(fichier) {
    if (!fichier) return
    setFichierNom(fichier.name)
    setEtat('loading')
    setResultat(null)
    setErreur('')
    setImportStatus({})

    const formData = new FormData()
    formData.append('fichier', fichier)

    try {
      const r = await fetch(`${API}/bulletins/ocr`, {
        method: 'POST',
        body: formData,
      })
      if (!r.ok) {
        const err = await r.json()
        throw new Error(err.detail || `Erreur ${r.status}`)
      }
      const data = await r.json()
      setResultat(data)
      setEtat('done')
    } catch (e) {
      setErreur(e.message)
      setEtat('error')
    }
  }

  function onFichierChange(e) {
    const f = e.target.files?.[0]
    if (f) analyser(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) analyser(f)
  }

  function reset() {
    setEtat('idle')
    setResultat(null)
    setErreur('')
    setFichierNom('')
    setImportStatus({})
    if (inputRef.current) inputRef.current.value = ''
  }

  async function importerNote(note, eleve_id) {
    // Import d'une seule note dans la base via POST /eleves/:id/appreciations
    // (endpoint à créer si nécessaire — ici on utilise synthese-pp pour stocker l'appréciation)
    const key = `${note.matiere}`
    try {
      const r = await fetch(`${API}/appreciations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eleve_id,
          matiere: note.matiere,
          note: note.note,
          appreciation: note.appreciation,
          periode: resultat.periode || 'T1',
        }),
      })
      if (!r.ok) throw new Error()
      setImportStatus(s => ({ ...s, [key]: 'ok' }))
    } catch {
      setImportStatus(s => ({ ...s, [key]: 'error' }))
    }
  }

  return (
    <div>
      {/* En-tête */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#1e3a5f', fontSize: '1.1rem', border: 'none', padding: 0 }}>
          Lecture de bulletins scannés
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 4 }}>
          Dépose un bulletin scanné (PNG, JPG ou PDF) — Qwen2.5VL extrait automatiquement les notes et appréciations.
        </p>
      </div>

      {/* Zone de dépôt */}
      {etat === 'idle' && (
        <div
          className="card"
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            textAlign: 'center', padding: '48px 24px',
            border: `2px dashed ${dragOver ? '#6366f1' : '#cbd5e1'}`,
            borderRadius: 12, cursor: 'pointer',
            background: dragOver ? '#f5f3ff' : '#f8fafc',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📄</div>
          <div style={{ fontWeight: 700, color: '#1e3a5f', fontSize: '1rem' }}>
            Glisse un bulletin ici
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: 4 }}>
            ou clique pour sélectionner un fichier (PNG, JPG, PDF)
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={onFichierChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Chargement */}
      {etat === 'loading' && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
          <div style={{ fontWeight: 700, color: '#6366f1', fontSize: '1rem' }}>
            Analyse en cours via Qwen2.5VL…
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: 4 }}>
            {fichierNom} · Cela peut prendre 30 à 90 secondes
          </div>
        </div>
      )}

      {/* Erreur */}
      {etat === 'error' && (
        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ fontWeight: 700, color: '#dc2626' }}>❌ Erreur d'analyse</div>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 6 }}>{erreur}</div>
          <button
            onClick={reset}
            style={{
              marginTop: 16, padding: '8px 20px', border: 'none', borderRadius: 8,
              background: '#1e3a5f', color: 'white', cursor: 'pointer', fontWeight: 600,
            }}
          >Réessayer</button>
        </div>
      )}

      {/* Résultats */}
      {etat === 'done' && resultat && (
        <>
          {/* Identité extraite */}
          <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #16a34a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e3a5f' }}>
                  {resultat.prenom || '—'} {resultat.nom || '—'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                  Classe : {resultat.classe || '—'} · Période : {resultat.periode || '—'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, background: '#dcfce7',
                  color: '#16a34a', fontWeight: 700, fontSize: '0.8rem',
                }}>
                  ✓ {resultat.notes?.length || 0} matières extraites
                </span>
                <button
                  onClick={reset}
                  style={{
                    padding: '4px 12px', border: 'none', borderRadius: 8,
                    background: '#f1f5f9', color: '#374151', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}
                >Nouveau bulletin</button>
              </div>
            </div>
          </div>

          {/* Table des notes */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', color: '#1e3a5f', fontSize: '0.95rem', border: 'none', padding: 0 }}>
              Notes et appréciations extraites
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={thStyle}>Matière</th>
                    <th style={{ ...thStyle, width: 70 }}>Note /20</th>
                    <th style={thStyle}>Appréciation</th>
                    <th style={{ ...thStyle, width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(resultat.notes || []).map((note, i) => {
                    const key = note.matiere
                    const statut = importStatus[key]
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdStyle}>
                          <strong style={{ color: '#1e3a5f' }}>{note.matiere}</strong>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {note.note !== null && note.note !== undefined ? (
                            <span style={{
                              fontWeight: 700,
                              color: note.note >= 14 ? '#16a34a' : note.note >= 10 ? '#d97706' : '#dc2626',
                            }}>
                              {note.note}
                            </span>
                          ) : <span style={{ color: '#9ca3af' }}>—</span>}
                        </td>
                        <td style={{ ...tdStyle, color: '#4b5563', fontStyle: note.appreciation ? 'italic' : 'normal' }}>
                          {note.appreciation || <span style={{ color: '#d1d5db' }}>—</span>}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {statut === 'ok' && <span style={{ color: '#16a34a' }}>✓</span>}
                          {statut === 'error' && <span style={{ color: '#dc2626' }}>✗</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: 16, padding: '10px 14px', borderRadius: 8,
              background: '#f0f9ff', color: '#0369a1', fontSize: '0.82rem',
            }}>
              💡 <strong>Import automatique :</strong> Pour importer ces notes dans la fiche d'un élève,
              ajoute l'endpoint <code>POST /appreciations</code> dans main.py
              ou copie manuellement les données dans la fiche élève.
            </div>
          </div>

          {/* JSON brut (pour debug / livre) */}
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.8rem', padding: '6px 0' }}>
              Afficher le JSON brut
            </summary>
            <pre style={{
              background: '#1e293b', color: '#e2e8f0', padding: 16,
              borderRadius: 8, fontSize: '0.75rem', overflowX: 'auto',
              marginTop: 8,
            }}>
              {JSON.stringify(resultat, null, 2)}
            </pre>
          </details>
        </>
      )}
    </div>
  )
}

const thStyle = {
  textAlign: 'left', padding: '8px 12px',
  color: '#6b7280', fontWeight: 600, fontSize: '0.8rem',
}
const tdStyle = {
  padding: '10px 12px', verticalAlign: 'top',
}
