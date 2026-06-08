'use client'
import { useState } from 'react'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { formatUGX } from '@/types/database'
import {
  TrendingUp, Users, ShoppingBag, DollarSign,
  Plus, ChevronRight, Search, CheckCircle
} from 'lucide-react'

const STATS = [
  { label: 'Active Projects', value: '12', change: '+2 this month', icon: TrendingUp, color: 'text-champagne-400' },
  { label: 'Total Project Value', value: 'UGX 2.4B', change: 'Across all clients', icon: DollarSign, color: 'text-blue-400' },
  { label: 'Deposits Collected', value: 'UGX 842M', change: '35% of total', icon: DollarSign, color: 'text-emerald-400' },
  { label: 'Outstanding Balance', value: 'UGX 1.56B', change: 'Due upon install', icon: ShoppingBag, color: 'text-purple-400' },
]

const ACTIVE_PROJECTS = [
  { client: 'James Okafor', project: 'Kololo Residence', phase: 'sourcing', value: 180000000, deposit: 64500000, status: 'active' },
  { client: 'Amara Diallo', project: 'Nakasero Office Fit-Out', phase: 'importing', value: 340000000, deposit: 170000000, status: 'active' },
  { client: 'Chidi Eze', project: 'Muyenga Villa', phase: 'architectural_review', value: 520000000, deposit: 0, status: 'active' },
  { client: 'Fatima Nkrumah', project: 'Bugolobi Penthouse', phase: 'installation', value: 210000000, deposit: 105000000, status: 'active' },
  { client: 'Kwame Asante', project: 'Jinja Commercial Hub', phase: 'concept', value: 890000000, deposit: 0, status: 'paused' },
]

const DEMO_CLIENTS = [
  { id: 'c1', name: 'James Okafor', email: 'james@email.com' },
  { id: 'c2', name: 'Amara Diallo', email: 'amara@email.com' },
  { id: 'c3', name: 'Chidi Eze', email: 'chidi@email.com' },
  { id: 'c4', name: 'Fatima Nkrumah', email: 'fatima@email.com' },
]

const PHASE_LABELS: Record<string, string> = {
  concept: 'Concept',
  architectural_review: 'Arch. Review',
  sourcing: 'Sourcing',
  importing: 'Importing',
  installation: 'Installation',
  handover: 'Handover',
}

interface SourcingForm {
  clientId: string
  title: string
  width: string
  height: string
  depth: string
  fabricChoice: string
  origin: string
  wholesaleCost: string
  markupPercent: string
  importDuties: string
  installationFee: string
  depositPercent: string
  notes: string
}

export default function AdminDashboard() {
  const [showSourcingTool, setShowSourcingTool] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [form, setForm] = useState<SourcingForm>({
    clientId: '', title: '', width: '', height: '', depth: '',
    fabricChoice: '', origin: '', wholesaleCost: '', markupPercent: '35',
    importDuties: '', installationFee: '', depositPercent: '50', notes: '',
  })

  const filteredClients = DEMO_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const sellingPrice = form.wholesaleCost
    ? Math.round(parseFloat(form.wholesaleCost) * (1 + parseFloat(form.markupPercent || '0') / 100))
    : 0

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production: call Supabase to insert into cart_items for the selected client
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowSourcingTool(false)
      setForm({ clientId: '', title: '', width: '', height: '', depth: '', fabricChoice: '', origin: '', wholesaleCost: '', markupPercent: '35', importDuties: '', installationFee: '', depositPercent: '50', notes: '' })
    }, 2500)
  }

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="admin" userName="Anika Mensah" userEmail="anika@interio.com" />
      <MobileTopBar role="admin" userName="Anika Mensah" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Admin Console</span>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1">Executive Dashboard</h1>
            <div className="divider-luxury mt-3" />
          </div>
          <button
            onClick={() => setShowSourcingTool(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.1em] uppercase hover:bg-champagne-400 transition-colors shrink-0"
          >
            <Plus size={14} />
            Sourcing Tool
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="glass-dark rounded p-5">
              <Icon size={16} className={`${color} mb-3`} />
              <p className={`font-serif text-2xl font-light ${color} mb-1`}>{value}</p>
              <p className="text-ivory text-xs font-medium mb-0.5">{label}</p>
              <p className="text-obsidian-600 text-[10px]">{change}</p>
            </div>
          ))}
        </div>

        {/* Active projects table */}
        <div className="glass-dark rounded overflow-hidden mb-8">
          <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
            <h2 className="font-serif text-xl font-light text-ivory flex items-center gap-2">
              <Users size={18} className="text-champagne-400" />
              Active Client Projects
            </h2>
            <span className="text-obsidian-600 text-xs">{ACTIVE_PROJECTS.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-obsidian-800">
                  {['Client', 'Project', 'Phase', 'Value', 'Deposit Collected', 'Outstanding', ''].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[9px] tracking-widest uppercase text-obsidian-600 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVE_PROJECTS.map((p, i) => {
                  const outstanding = p.value - p.deposit
                  return (
                    <tr key={i} className="border-b border-obsidian-900 hover:bg-obsidian-900/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-champagne-500/20 border border-champagne-500/30 flex items-center justify-center text-champagne-400 text-xs font-bold shrink-0">
                            {p.client.charAt(0)}
                          </div>
                          <span className="text-ivory text-sm font-medium">{p.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-obsidian-400 text-sm">{p.project}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${
                          p.phase === 'installation' ? 'badge-active' :
                          p.phase === 'importing' ? 'badge-sourcing' :
                          p.phase === 'sourcing' ? 'badge-sourcing' :
                          'badge-pending'
                        }`}>
                          {PHASE_LABELS[p.phase]}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-serif text-sm text-ivory">{formatUGX(p.value)}</td>
                      <td className="px-6 py-4 font-serif text-sm text-emerald-400">{formatUGX(p.deposit)}</td>
                      <td className="px-6 py-4 font-serif text-sm text-champagne-400">{formatUGX(outstanding)}</td>
                      <td className="px-6 py-4">
                        <ChevronRight size={14} className="text-obsidian-700 group-hover:text-champagne-400 transition-colors" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── SOURCING TOOL MODAL ── */}
      {showSourcingTool && (
        <div
          className="fixed inset-0 z-50 bg-obsidian-950/90 backdrop-blur-sm flex items-start justify-end"
          onClick={e => e.target === e.currentTarget && setShowSourcingTool(false)}
        >
          <div className="h-full w-full max-w-xl bg-obsidian-900 border-l border-obsidian-800 overflow-y-auto animate-slide-right">
            <div className="sticky top-0 bg-obsidian-900 border-b border-obsidian-800 p-6 flex items-center justify-between z-10">
              <div>
                <span className="text-[9px] tracking-widest uppercase text-champagne-500">Staff Tool</span>
                <h2 className="font-serif text-xl font-light text-ivory mt-0.5">Inject Custom Item</h2>
              </div>
              <button
                onClick={() => setShowSourcingTool(false)}
                className="text-obsidian-600 hover:text-ivory transition-colors text-lg"
              >✕</button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <div className="w-14 h-14 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <p className="font-serif text-xl text-ivory mb-2">Item Injected</p>
                <p className="text-obsidian-500 text-sm">Successfully added to client's procurement cart.</p>
              </div>
            ) : (
              <form onSubmit={handleInject} className="p-6 space-y-6">
                {/* Client selector */}
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Select Client *</label>
                  <div className="relative mb-2">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-600" />
                    <input
                      type="text"
                      placeholder="Search clients…"
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm pl-8 pr-4 py-2.5 rounded focus:outline-none focus:border-champagne-600 transition-colors placeholder:text-obsidian-700"
                    />
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setForm(f => ({ ...f, clientId: c.id })); setClientSearch(c.name) }}
                        className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                          form.clientId === c.id
                            ? 'bg-champagne-500/20 border border-champagne-500/30 text-champagne-400'
                            : 'bg-obsidian-800 border border-obsidian-700 text-ivory hover:border-obsidian-500'
                        }`}
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-obsidian-500 text-xs ml-2">{c.email}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item details */}
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Item Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Modena Sofa — Ivory Leather Custom"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm px-4 py-2.5 rounded focus:outline-none focus:border-champagne-600 transition-colors placeholder:text-obsidian-700"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['width', 'height', 'depth'] as const).map(dim => (
                      <div key={dim}>
                        <label className="text-[8px] uppercase text-obsidian-700 block mb-1">{dim}</label>
                        <input
                          type="number"
                          placeholder="cm"
                          value={form[dim]}
                          onChange={e => setForm(f => ({ ...f, [dim]: e.target.value }))}
                          className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fabric & Origin */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Fabric / Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Pelle Frau® Ivory"
                      value={form.fabricChoice}
                      onChange={e => setForm(f => ({ ...f, fabricChoice: e.target.value }))}
                      className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm px-3 py-2.5 rounded focus:outline-none focus:border-champagne-600 transition-colors placeholder:text-obsidian-700"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Country of Origin</label>
                    <input
                      type="text"
                      placeholder="e.g. Italy"
                      value={form.origin}
                      onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                      className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm px-3 py-2.5 rounded focus:outline-none focus:border-champagne-600 transition-colors placeholder:text-obsidian-700"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-obsidian-800/50 rounded p-4 space-y-3">
                  <p className="text-[9px] tracking-widest uppercase text-obsidian-500 mb-1">Pricing Structure</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[8px] uppercase text-obsidian-700 block mb-1">Wholesale Cost (UGX) *</label>
                      <input
                        required type="number" min="0"
                        value={form.wholesaleCost}
                        onChange={e => setForm(f => ({ ...f, wholesaleCost: e.target.value }))}
                        className="w-full bg-obsidian-900 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] uppercase text-obsidian-700 block mb-1">Markup %</label>
                      <input
                        type="number" min="0" max="500"
                        value={form.markupPercent}
                        onChange={e => setForm(f => ({ ...f, markupPercent: e.target.value }))}
                        className="w-full bg-obsidian-900 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] uppercase text-obsidian-700 block mb-1">Import Duties (UGX)</label>
                      <input
                        type="number" min="0"
                        value={form.importDuties}
                        onChange={e => setForm(f => ({ ...f, importDuties: e.target.value }))}
                        className="w-full bg-obsidian-900 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] uppercase text-obsidian-700 block mb-1">Installation Fee (UGX)</label>
                      <input
                        type="number" min="0"
                        value={form.installationFee}
                        onChange={e => setForm(f => ({ ...f, installationFee: e.target.value }))}
                        className="w-full bg-obsidian-900 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Selling price preview */}
                  {sellingPrice > 0 && (
                    <div className="flex items-center justify-between bg-obsidian-900 rounded px-4 py-3 border border-champagne-500/20">
                      <span className="text-[10px] uppercase tracking-widest text-obsidian-500">Client Selling Price</span>
                      <span className="text-champagne-400 font-serif text-lg">{formatUGX(sellingPrice)}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[8px] uppercase text-obsidian-700 block mb-1">Required Deposit %</label>
                    <input
                      type="number" min="0" max="100"
                      value={form.depositPercent}
                      onChange={e => setForm(f => ({ ...f, depositPercent: e.target.value }))}
                      className="w-full bg-obsidian-900 border border-obsidian-700 text-ivory text-sm px-3 py-2 rounded focus:outline-none focus:border-champagne-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-2">Notes for Client</label>
                  <textarea
                    rows={3}
                    placeholder="Any special instructions, lead time, or caveats…"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-obsidian-800 border border-obsidian-700 text-ivory text-sm px-4 py-3 rounded focus:outline-none focus:border-champagne-600 transition-colors resize-none placeholder:text-obsidian-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!form.clientId || !form.title || !form.wholesaleCost}
                  className="w-full py-3.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-widest uppercase hover:bg-champagne-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Inject into Client Cart
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
