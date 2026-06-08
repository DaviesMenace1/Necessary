'use client'
import { useState } from 'react'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { formatUGX } from '@/types/database'
import { Plus, Search, CheckCircle, ChevronDown, User } from 'lucide-react'

const DEMO_CLIENTS = [
  { id: 'c1', name: 'James Okafor', email: 'james@email.com', project: 'Kololo Residence — Master Suite' },
  { id: 'c2', name: 'Amara Diallo', email: 'amara@email.com', project: 'Nakasero Office Fit-Out' },
  { id: 'c3', name: 'Chidi Eze', email: 'chidi@email.com', project: 'Muyenga Villa' },
  { id: 'c4', name: 'Fatima Nkrumah', email: 'fatima@email.com', project: 'Bugolobi Penthouse' },
  { id: 'c5', name: 'Kwame Asante', email: 'kwame@email.com', project: 'Jinja Commercial Hub' },
]

const RECENT_INJECTIONS = [
  { client: 'James Okafor', item: 'Modena Sofa — Ivory Leather', price: 57200000, by: 'Anika Mensah', when: '2 days ago' },
  { client: 'Fatima Nkrumah', item: 'Flos Arrangements Pendant × 2', price: 15560000, by: 'Anika Mensah', when: '4 days ago' },
  { client: 'Amara Diallo', item: 'Custom Reception Desk', price: 118000000, by: 'Admin', when: '1 week ago' },
]

interface SourcingForm {
  clientId: string
  title: string
  width: string
  height: string
  depth: string
  fabricChoice: string
  finish: string
  origin: string
  wholesaleCost: string
  markupPercent: string
  importDuties: string
  installationFee: string
  depositPercent: string
  quantity: string
  notes: string
}

const BLANK: SourcingForm = {
  clientId: '', title: '', width: '', height: '', depth: '',
  fabricChoice: '', finish: '', origin: '', wholesaleCost: '',
  markupPercent: '35', importDuties: '', installationFee: '',
  depositPercent: '50', quantity: '1', notes: '',
}

export default function SourcingToolPage() {
  const [form, setForm] = useState<SourcingForm>(BLANK)
  const [clientSearch, setClientSearch] = useState('')
  const [clientDropOpen, setClientDropOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedClient = DEMO_CLIENTS.find(c => c.id === form.clientId)

  const filteredClients = DEMO_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const wholesale = parseFloat(form.wholesaleCost) || 0
  const markup = parseFloat(form.markupPercent) || 0
  const sellingPrice = Math.round(wholesale * (1 + markup / 100))
  const qty = parseInt(form.quantity) || 1
  const duties = parseFloat(form.importDuties) || 0
  const install = parseFloat(form.installationFee) || 0
  const lineTotal = (sellingPrice * qty) + (duties * qty) + install
  const depositAmount = Math.round(lineTotal * (parseFloat(form.depositPercent) || 50) / 100)

  const set = (k: keyof SourcingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In production: supabase.from('cart_items').insert({...})
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  const reset = () => {
    setForm(BLANK)
    setClientSearch('')
    setSubmitted(false)
  }

  const inputCls = 'w-full bg-obsidian-900 border border-obsidian-800 text-ivory text-sm px-3 py-2.5 rounded focus:outline-none focus:border-champagne-600 transition-colors placeholder:text-obsidian-700 font-light'

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="admin" userName="Anika Mensah" userEmail="anika@interio.com" />
      <MobileTopBar role="admin" userName="Anika Mensah" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        <div className="mb-8">
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Admin · Design Tools</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1">Sourcing Tool</h1>
          <div className="divider-luxury mt-3" />
          <p className="text-obsidian-500 text-sm font-light mt-2 max-w-xl">
            Manually configure and inject custom-sourced items directly into any client's procurement cart. All pricing, specs, and deposit requirements are set here.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── FORM ── */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="glass-dark rounded p-16 flex flex-col items-center justify-center text-center animate-fade-up">
                <div className="w-16 h-16 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="font-serif text-2xl font-light text-ivory mb-2">Item Successfully Injected</p>
                <p className="text-obsidian-500 text-sm mb-2">
                  <span className="text-champagne-400 font-medium">{form.title}</span> has been added to{' '}
                  <span className="text-ivory font-medium">{selectedClient?.name}</span>'s procurement cart.
                </p>
                <p className="text-obsidian-600 text-xs mb-8">The client will see it on their next login. A notification email has been queued.</p>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-8 py-3 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-widest uppercase hover:bg-champagne-400 transition-colors"
                  >
                    Inject Another Item
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 border border-obsidian-700 text-obsidian-400 text-[11px] tracking-widest uppercase hover:text-ivory hover:border-obsidian-500 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client selector */}
                <div className="glass-dark rounded p-6">
                  <h2 className="font-serif text-lg font-light text-ivory mb-4 flex items-center gap-2">
                    <User size={16} className="text-champagne-400" />
                    Select Client
                  </h2>
                  <div className="relative">
                    <div className="relative mb-2">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-600" />
                      <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={clientSearch}
                        onChange={e => { setClientSearch(e.target.value); setClientDropOpen(true) }}
                        onFocus={() => setClientDropOpen(true)}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    {clientDropOpen && filteredClients.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 bg-obsidian-900 border border-obsidian-700 rounded overflow-hidden shadow-2xl">
                        {filteredClients.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setForm(f => ({ ...f, clientId: c.id }))
                              setClientSearch(c.name)
                              setClientDropOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-obsidian-800 last:border-0 ${
                              form.clientId === c.id
                                ? 'bg-champagne-500/10 text-champagne-400'
                                : 'hover:bg-obsidian-800 text-ivory'
                            }`}
                          >
                            <span className="font-medium">{c.name}</span>
                            <span className="text-obsidian-500 text-xs ml-2">{c.email}</span>
                            <span className="block text-[10px] text-obsidian-600 mt-0.5">{c.project}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedClient && (
                    <div className="mt-3 flex items-center gap-3 bg-champagne-500/10 border border-champagne-500/20 rounded px-4 py-3">
                      <div className="w-8 h-8 bg-champagne-500 flex items-center justify-center text-obsidian-950 text-sm font-bold shrink-0">
                        {selectedClient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-champagne-400 font-medium text-sm">{selectedClient.name}</p>
                        <p className="text-obsidian-500 text-xs">{selectedClient.project}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Item details */}
                <div className="glass-dark rounded p-6 space-y-5">
                  <h2 className="font-serif text-lg font-light text-ivory mb-1">Item Details</h2>

                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Item Title *</label>
                    <input required type="text" value={form.title} onChange={set('title')}
                      placeholder="e.g. Modena Sofa — Custom 3-Seater, Ivory Pelle Frau®"
                      className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Fabric / Material</label>
                      <input type="text" value={form.fabricChoice} onChange={set('fabricChoice')}
                        placeholder="e.g. Pelle Frau® Ivory" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Finish</label>
                      <input type="text" value={form.finish} onChange={set('finish')}
                        placeholder="e.g. Brushed Walnut Frame" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Country of Origin</label>
                    <input type="text" value={form.origin} onChange={set('origin')}
                      placeholder="e.g. Italy" className={inputCls} />
                  </div>

                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['width', 'height', 'depth'] as const).map(dim => (
                        <div key={dim}>
                          <label className="text-[8px] uppercase text-obsidian-700 block mb-1">{dim}</label>
                          <input type="number" value={form[dim]} onChange={set(dim)}
                            placeholder="cm" className={inputCls} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Quantity</label>
                    <input type="number" min="1" value={form.quantity} onChange={set('quantity')}
                      className={`${inputCls} w-24`} />
                  </div>
                </div>

                {/* Pricing */}
                <div className="glass-dark rounded p-6 space-y-4">
                  <h2 className="font-serif text-lg font-light text-ivory mb-1">Pricing Structure</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Wholesale Cost (UGX) *</label>
                      <input required type="number" min="0" value={form.wholesaleCost} onChange={set('wholesaleCost')}
                        placeholder="0" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Markup %</label>
                      <input type="number" min="0" max="500" value={form.markupPercent} onChange={set('markupPercent')}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Import Duties (UGX)</label>
                      <input type="number" min="0" value={form.importDuties} onChange={set('importDuties')}
                        placeholder="0" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest uppercase text-obsidian-500 block mb-1.5">Installation Fee (UGX)</label>
                      <input type="number" min="0" value={form.installationFee} onChange={set('installationFee')}
                        placeholder="0" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] tracking-widets uppercase text-obsidian-500 block mb-1.5">Required Deposit %</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="10" max="100" step="5" value={form.depositPercent} onChange={set('depositPercent')}
                        className="flex-1 accent-amber-500" />
                      <span className="text-champagne-400 font-mono text-sm w-10 text-right">{form.depositPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="glass-dark rounded p-6">
                  <label className="text-[9px] tracking-widets uppercase text-obsidian-500 block mb-1.5">Notes for Client</label>
                  <textarea rows={3} value={form.notes} onChange={set('notes')}
                    placeholder="Any special instructions, lead times, or caveats the client should know…"
                    className={`${inputCls} resize-none`} />
                </div>

                <button
                  type="submit"
                  disabled={!form.clientId || !form.title || !form.wholesaleCost || loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-widest uppercase hover:bg-champagne-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={14} />
                      Inject into {selectedClient?.name ?? 'Client'}'s Cart
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── SIDE PANEL ── */}
          <div className="space-y-5">
            {/* Live price preview */}
            {sellingPrice > 0 && (
              <div className="glass-dark rounded overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-obsidian-800">
                  <p className="text-[9px] tracking-widest uppercase text-obsidian-500">Live Price Preview</p>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label: `Unit Price × ${qty}`, value: sellingPrice * qty },
                    { label: `Import Duties × ${qty}`, value: duties * qty },
                    { label: 'Installation Fee', value: install },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-obsidian-500">{label}</span>
                      <span className="text-ivory font-mono">{formatUGX(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-obsidian-800 pt-2.5">
                    <span className="text-ivory text-sm font-medium">Line Total</span>
                    <span className="text-champagne-400 font-serif text-lg">{formatUGX(lineTotal)}</span>
                  </div>
                  <div className="flex justify-between bg-champagne-500/10 border border-champagne-500/20 rounded px-3 py-2">
                    <span className="text-champagne-400 text-xs">Deposit ({form.depositPercent}%)</span>
                    <span className="text-champagne-400 font-serif">{formatUGX(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-obsidian-500">Balance on Install</span>
                    <span className="text-ivory font-mono">{formatUGX(lineTotal - depositAmount)}</span>
                  </div>
                  <div className="pt-1 border-t border-obsidian-800">
                    <p className="text-[9px] text-obsidian-600 leading-relaxed">
                      Markup applied: {form.markupPercent}% ({formatUGX(sellingPrice - wholesale)} margin per unit)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent injections */}
            <div className="glass-dark rounded overflow-hidden">
              <div className="p-4 border-b border-obsidian-800">
                <p className="text-[9px] tracking-widest uppercase text-obsidian-500">Recent Injections</p>
              </div>
              <div className="divide-y divide-obsidian-900">
                {RECENT_INJECTIONS.map((inj, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-ivory text-xs font-medium leading-snug">{inj.item}</p>
                      <span className="text-[9px] text-obsidian-600 shrink-0">{inj.when}</span>
                    </div>
                    <p className="text-obsidian-500 text-[10px]">{inj.client}</p>
                    <p className="text-champagne-500 font-serif text-sm mt-1">{formatUGX(inj.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="glass-dark rounded p-4">
              <p className="text-[9px] tracking-widets uppercase text-obsidian-500 mb-3">Injection Guidelines</p>
              <ul className="space-y-2">
                {[
                  'Always confirm final measurements with the architect before injecting kitchen items.',
                  'Import duties are typically 25–35% of wholesale for furniture from EU/USA.',
                  'Set deposit to 70%+ for custom-fabricated or high-value items (>UGX 50M).',
                  'Notes are visible to the client — keep professional and client-facing.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-obsidian-500 leading-relaxed">
                    <span className="text-champagne-700 shrink-0 mt-0.5">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
