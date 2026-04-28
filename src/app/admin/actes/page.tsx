'use client'

import { useState, useRef } from 'react'
import { FileUp, QRCode, Download, CheckCircle, Search } from 'lucide-react'

interface Acte {
  id: string
  nom: string
  dateDeclaration: string
  date_naissance: string
  lieu_naissance: string
  nomPere: string
  nomMere: string
  numeroActe: string
  statut: 'en_attente' | 'traite' | 'annule'
  qrCode?: string
}

const ACTES_EXAMPLE: Acte[] = [
  { id: '1', nom: 'Kouame Jean-Baptiste', dateDeclaration: '2025-04-15', date_naissance: '2025-03-15', lieu_naissance: 'Cocody', nomPere: 'Kouame Pierre', nomMere: 'Aka Marie', numeroActe: 'ACT-2025-00142', statut: 'traite', qrCode: 'QR-ACT-2025-00142' },
  { id: '2', nom: 'Traore Fatou', dateDeclaration: '2025-04-14', date_naissance: '2025-02-28', lieu_naissance: 'Yopougon', nomPere: 'Traore Amadou', nomMere: 'Coulibaly Awa', numeroActe: 'ACT-2025-00141', statut: 'traite', qrCode: 'QR-ACT-2025-00141' },
  { id: '3', nom: 'Ouattara Mohamed', dateDeclaration: '2025-04-13', date_naissance: '2025-04-01', lieu_naissance: 'Abobo', nomPere: 'Ouattara Youssouf', nomMere: 'Keita Fatou', numeroActe: 'ACT-2025-00140', statut: 'en_attente' },
  { id: '4', nom: 'Kone Adama', dateDeclaration: '2025-04-12', date_naissance: '2025-03-22', lieu_naissance: 'Plateau', nomPere: 'Kone Bakary', nomMere: 'Sangare Aminata', numeroActe: 'ACT-2025-00139', statut: 'annule' },
]

export default function ActesPage() {
  const [actes, setActes] = useState<Acte[]>(ACTES_EXAMPLE)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'traite' | 'en_attente' | 'annule'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredActes = actes.filter(act => {
    const matchesSearch = act.nom.toLowerCase().includes(search.toLowerCase()) || 
                     act.numeroActe.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || act.statut === filter
    return matchesSearch && matchesFilter
  })

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const nouveauActe: Acte = {
      id: String(actes.length + 1),
      nom: 'Nouveau ne',
      dateDeclaration: new Date().toISOString().split('T')[0],
      date_naissance: '',
      lieu_naissance: '',
      nomPere: '',
      nomMere: '',
      numeroActe: `ACT-2025-00${140 + actes.length + 1}`,
      statut: 'en_attente',
    }
    
    setActes([nouveauActe, ...actes])
    setSelectedFile(null)
    setUploading(false)
  }

  const generateQRCode = (acteId: string) => {
    const acte = actes.find(a => a.id === acteId)
    if (!acte) return
    
    const qrData = `COCODY-ACT:${acte.numeroActe}:${acte.nom}:${acte.dateDeclaration}:${Date.now()}`
    
    setActes(actes.map(a => 
      a.id === acteId 
        ? { ...a, qrCode: qrData, statut: 'traite' as const }
        : a
    ))
  }

  const downloadWithQR = (acte: Acte) => {
    if (!acte.qrCode) return
    
    const content = `MAIRIE DE COCODY - ACTE DE NAISSANCE

N: ${acte.numeroActe}
Date: ${acte.dateDeclaration}

Nom: ${acte.nom}
Date naissance: ${acte.date_naissance}
Lieu naissance: ${acte.lieu_naissance}

Pere: ${acte.nomPere}
Mere: ${acte.nomMere}

TIMBRE DIGITAL
Verifier: cocody.ci/v/${acte.id}
QR: ${acte.qrCode}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${acte.numeroActe}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900">Timbre d&apos;actes</h1>
          <p className="text-sm text-ink-500">Gestion des actes avec QR code</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-forest-600 px-3 py-1 rounded-full text-white text-sm font-semibold">
            {actes.filter(a => a.statut === 'traite').length} traites
          </div>
          <div className="bg-ocre-600 px-3 py-1 rounded-full text-white text-sm font-semibold">
            {actes.filter(a => a.statut === 'en_attente').length} en attente
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Declarer un acte</h2>
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-lagune-600 text-white rounded-xl hover:bg-lagune-700"
          >
            <FileUp size={18} /> Choisir un fichier
          </button>
          
          {selectedFile && (
            <span className="text-sm text-ink-600">{selectedFile.name}</span>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-xl hover:bg-forest-700 disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><CheckCircle size={18} />Confirmer</>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-ink-200 rounded-xl"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'traite', 'en_attente', 'annule'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === f 
                  ? 'bg-lagune-600 text-white' 
                  : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {f === 'all' ? 'Tous' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase">N Acte</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase">QR Code</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-ink-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filteredActes.map(acte => (
              <tr key={acte.id} className="hover:bg-ink-50/50">
                <td className="px-4 py-3 font-mono text-sm font-medium text-ink-900">
                  {acte.numeroActe}
                </td>
                <td className="px-4 py-3 text-sm text-ink-700">
                  {acte.nom}
                </td>
                <td className="px-4 py-3 text-sm text-ink-500">
                  {acte.dateDeclaration}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    acte.statut === 'traite' 
                      ? 'bg-forest-100 text-forest-800'
                      : acte.statut === 'en_attente'
                      ? 'bg-ocre-100 text-ocre-800'
                      : 'bg-terra-100 text-terra-800'
                  }`}>
                    {acte.statut === 'traite' ? 'Traite' : acte.statut === 'en_attente' ? 'En attente' : 'Annule'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {acte.qrCode ? (
                    <span className="text-xs font-mono text-lagune-600 bg-lagune-50 px-2 py-1 rounded">
                      {acte.qrCode.substring(0, 20)}...
                    </span>
                  ) : (
                    <span className="text-xs text-ink-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {!acte.qrCode && acte.statut !== 'annule' && (
                      <button
                        onClick={() => generateQRCode(acte.id)}
                        className="p-1.5 text-lagune-600 hover:bg-lagune-50 rounded-lg"
                        title="Generer QR code"
                      >
                        <QRCode size={16} />
                      </button>
                    )}
                    {acte.qrCode && (
                      <button
                        onClick={() => downloadWithQR(acte)}
                        className="p-1.5 text-forest-600 hover:bg-forest-50 rounded-lg"
                        title="Telecharger"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredActes.length === 0 && (
          <div className="p-8 text-center text-ink-400">
            Aucun acte trouve
          </div>
        )}
      </div>
    </div>
  )
}