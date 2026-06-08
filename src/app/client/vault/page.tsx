'use client'
import { useState } from 'react'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { FileText, Download, Shield, Search, Filter, Eye, Lock } from 'lucide-react'

const DOC_TYPES = ['all', 'blueprint', 'floor_plan', 'mood_board', 'contract', 'invoice'] as const
type DocType = typeof DOC_TYPES[number]

const DEMO_DOCS = [
  {
    id: '1', title: 'Master Suite — Architectural Blueprint v3', doc_type: 'blueprint' as const,
    file_url: '#', file_size: 8400000, is_signed: true, created_at: '2025-06-01',
    project: 'Kololo Residence',
  },
  {
    id: '2', title: 'Ground Floor Plan — Final Approved', doc_type: 'floor_plan' as const,
    file_url: '#', file_size: 5200000, is_signed: true, created_at: '2025-05-18',
    project: 'Kololo Residence',
  },
  {
    id: '3', title: 'Living Room Mood Board — Italian Palette', doc_type: 'mood_board' as const,
    file_url: '#', file_size: 24600000, is_signed: false, created_at: '2025-05-10',
    project: 'Kololo Residence',
  },
  {
    id: '4', title: 'Design Services Agreement — Signed', doc_type: 'contract' as const,
    file_url: '#', file_size: 1100000, is_signed: true, created_at: '2025-04-22',
    project: 'Kololo Residence',
  },
  {
    id: '5', title: 'Deposit Invoice #INV-2025-0041', doc_type: 'invoice' as const,
    file_url: '#', file_size: 420000, is_signed: false, created_at: '2025-04-28',
    project: 'Kololo Residence',
  },
  {
    id: '6', title: 'Kitchen & Bathrooms — Technical Layout', doc_type: 'floor_plan' as const,
    file_url: '#', file_size: 6700000, is_signed: false, created_at: '2025-06-10',
    project: 'Kololo Residence',
  },
  {
    id: '7', title: 'Material Selections Mood Board', doc_type: 'mood_board' as const,
    file_url: '#', file_size: 18900000, is_signed: false, created_at: '2025-06-12',
    project: 'Kololo Residence',
  },
]

const DOC_TYPE_COLORS: Record<string, string> = {
  blueprint: 'badge-sourcing',
  floor_plan: 'badge-active',
  mood_board: 'badge-pending',
  contract: 'badge-complete',
  invoice: 'badge-pending',
  report: 'badge-pending',
}

const DOC_TYPE_ICONS: Record<string, string> = {
  blueprint: '📐',
  floor_plan: '🗺',
  mood_board: '🎨',
  contract: '📋',
  invoice: '🧾',
  report: '📊',
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentVault() {
  const [filter, setFilter] = useState<DocType>('all')
  const [search, setSearch] = useState('')

  const filtered = DEMO_DOCS.filter(d => {
    const matchesType = filter === 'all' || d.doc_type === filter
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="client" userName="James Okafor" userEmail="james@email.com" />
      <MobileTopBar role="client" userName="James Okafor" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        {/* Header */}
        <div className="mb-8">
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Client Portal</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1 flex items-center gap-3">
            <Shield size={22} className="text-champagne-400" />
            Document Vault
          </h1>
          <div className="divider-luxury mt-3" />
          <p className="text-obsidian-500 text-sm font-light mt-2">
            Secure storage for all project documents. Downloads are encrypted and access-controlled.
          </p>
        </div>

        {/* Security notice */}
        <div className="flex items-center gap-3 glass-dark rounded p-4 mb-6 border-l-2 border-champagne-500">
          <Lock size={14} className="text-champagne-400 shrink-0" />
          <p className="text-obsidian-400 text-xs leading-relaxed">
            All documents in this vault are private to your account. Sharing links expire after 24 hours.
            Row-level security enforced by Supabase — only you can access these files.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-600" />
            <input
              type="text"
              placeholder="Search documents…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-800 rounded text-ivory text-sm pl-9 pr-4 py-2.5 placeholder:text-obsidian-700 focus:outline-none focus:border-champagne-600 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={13} className="text-obsidian-600 shrink-0" />
            {DOC_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`shrink-0 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded transition-colors ${
                  filter === t
                    ? 'bg-champagne-500 text-obsidian-950 font-medium'
                    : 'text-obsidian-500 hover:text-ivory border border-obsidian-800 hover:border-obsidian-600'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Document grid */}
        {filtered.length === 0 ? (
          <div className="glass-dark rounded p-16 text-center">
            <FileText size={32} className="text-obsidian-700 mx-auto mb-4" />
            <p className="font-serif text-xl text-obsidian-500">No documents found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(doc => (
              <div key={doc.id} className="glass-dark rounded overflow-hidden card-lift group">
                {/* Top color strip */}
                <div className={`h-1 w-full ${
                  doc.doc_type === 'blueprint' ? 'bg-blue-500' :
                  doc.doc_type === 'floor_plan' ? 'bg-champagne-500' :
                  doc.doc_type === 'mood_board' ? 'bg-purple-500' :
                  doc.doc_type === 'contract' ? 'bg-emerald-500' :
                  'bg-obsidian-600'
                }`} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-2xl">{DOC_TYPE_ICONS[doc.doc_type]}</span>
                    <div className="flex items-center gap-2">
                      {doc.is_signed && (
                        <span className="badge badge-complete">Signed</span>
                      )}
                      <span className={`badge ${DOC_TYPE_COLORS[doc.doc_type]}`}>
                        {doc.doc_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-ivory text-sm font-medium leading-snug mb-4 line-clamp-2">
                    {doc.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-obsidian-600">
                    <span>{doc.created_at}</span>
                    <span className="font-mono">{formatBytes(doc.file_size)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-obsidian-800 flex">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-widest uppercase text-obsidian-500 hover:text-ivory hover:bg-obsidian-800 transition-colors">
                    <Eye size={12} />
                    Preview
                  </button>
                  <div className="w-px bg-obsidian-800" />
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-widest uppercase text-obsidian-500 hover:text-champagne-400 hover:bg-obsidian-800 transition-colors">
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary footer */}
        <div className="mt-8 pt-6 border-t border-obsidian-900 flex items-center justify-between text-xs text-obsidian-700">
          <span>{filtered.length} of {DEMO_DOCS.length} documents shown</span>
          <span className="flex items-center gap-1.5">
            <Shield size={10} className="text-champagne-700" />
            Secured with Supabase RLS
          </span>
        </div>
      </main>
    </div>
  )
}
