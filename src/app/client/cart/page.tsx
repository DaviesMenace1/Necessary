'use client'
import { useState } from 'react'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { ShoppingBag, Trash2, ChevronDown, ChevronUp, Info, CreditCard, ArrowRight } from 'lucide-react'
import { formatUGX, computeCartSummary } from '@/types/database'
import type { CartItem } from '@/types/database'

// Demo cart items — replace with Supabase query in production
const DEMO_ITEMS: CartItem[] = [
  {
    id: '1', cart_id: 'c1', product_id: null,
    custom_title: 'Modena Sofa — Custom 3-Seater (Ivory Leather)',
    custom_specs: { origin: 'Italy', material: 'Pelle Frau® Ivory', dimensions: 'L260 × D95 × H80 cm', finish: 'Polished Walnut Frame' },
    quantity: 1, unit_price_ugx: 48500000, import_duties_ugx: 7200000, installation_fee_ugx: 1500000,
    required_deposit_percentage: 50, sourcing_status: 'ordered', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    notes: null, added_by: null, created_at: '', updated_at: ''
  },
  {
    id: '2', cart_id: 'c1', product_id: null,
    custom_title: 'Travertine Coffee Table — Brushed Gold',
    custom_specs: { origin: 'Turkey', material: 'Travertine slab + brushed gold steel', dimensions: 'L120 × D60 × H38 cm' },
    quantity: 1, unit_price_ugx: 13800000, import_duties_ugx: 2100000, installation_fee_ugx: 800000,
    required_deposit_percentage: 50, sourcing_status: 'sourcing', image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
    notes: null, added_by: null, created_at: '', updated_at: ''
  },
  {
    id: '3', cart_id: 'c1', product_id: null,
    custom_title: 'Flos Arrangements Pendant Light × 2',
    custom_specs: { origin: 'Italy', material: 'Borosilicate glass, die-cast aluminum', dimensions: 'Ø48 cm per unit' },
    quantity: 2, unit_price_ugx: 6500000, import_duties_ugx: 980000, installation_fee_ugx: 600000,
    required_deposit_percentage: 60, sourcing_status: 'pending', image_url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&q=80',
    notes: 'Confirm ceiling height before ordering', added_by: 'designer', created_at: '', updated_at: ''
  },
  {
    id: '4', cart_id: 'c1', product_id: null,
    custom_title: 'Bulthaup B3 Kitchen Island — Custom',
    custom_specs: { origin: 'Germany', material: 'Titanium aluminum + Bardiglio marble', dimensions: 'Custom to space (±240 cm)' },
    quantity: 1, unit_price_ugx: 92000000, import_duties_ugx: 14400000, installation_fee_ugx: 8500000,
    required_deposit_percentage: 70, sourcing_status: 'pending', image_url: null,
    notes: 'Awaiting final kitchen measurements from architect', added_by: 'admin', created_at: '', updated_at: ''
  },
]

const SOURCING_STATUS_COLORS = {
  pending: 'badge-pending',
  sourcing: 'badge-sourcing',
  ordered: 'badge-active',
  in_transit: 'badge-active',
  customs: 'badge-active',
  delivered: 'badge-complete',
  installed: 'badge-complete',
} as const

export default function ProcurementCart() {
  const [items, setItems] = useState<CartItem[]>(DEMO_ITEMS)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const summary = computeCartSummary(items)

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="client" userName="James Okafor" userEmail="james@email.com" />
      <MobileTopBar role="client" userName="James Okafor" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        <div className="mb-8">
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Client Portal</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1 flex items-center gap-3">
            <ShoppingBag size={24} className="text-champagne-400" />
            Procurement Cart
          </h1>
          <div className="divider-luxury mt-3" />
          <p className="text-obsidian-500 text-sm font-light mt-2">
            Custom items curated by your designer. Each line includes material cost, import duties, and installation fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="glass-dark rounded p-12 text-center">
                <ShoppingBag size={32} className="text-obsidian-700 mx-auto mb-4" />
                <p className="font-serif text-xl text-obsidian-500">Your cart is empty</p>
                <p className="text-obsidian-700 text-sm mt-2">Items added by your designer will appear here.</p>
              </div>
            ) : items.map((item) => {
              const lineSubtotal = item.unit_price_ugx * item.quantity
              const lineDuties = item.import_duties_ugx * item.quantity
              const lineTotal = lineSubtotal + lineDuties + item.installation_fee_ugx
              const lineDeposit = (lineTotal * item.required_deposit_percentage) / 100

              return (
                <div key={item.id} className="glass-dark rounded overflow-hidden">
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-obsidian-800 flex-shrink-0 overflow-hidden rounded">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.custom_title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-obsidian-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 className="text-ivory text-sm font-medium leading-snug">{item.custom_title}</h3>
                          <span className={`badge ${SOURCING_STATUS_COLORS[item.sourcing_status]} shrink-0`}>
                            {item.sourcing_status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-obsidian-500 text-xs">Qty: {item.quantity}</span>
                          <span className="text-champagne-400 font-serif text-sm">{formatUGX(lineTotal)}</span>
                          {item.added_by && (
                            <span className="text-[9px] tracking-widest uppercase text-obsidian-700">Added by {item.added_by}</span>
                          )}
                        </div>

                        {item.notes && (
                          <div className="flex items-start gap-1.5 mt-2">
                            <Info size={10} className="text-obsidian-600 mt-0.5 shrink-0" />
                            <p className="text-obsidian-600 text-[10px] leading-relaxed">{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expand / Collapse */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-obsidian-800">
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-obsidian-500 hover:text-obsidian-300 transition-colors"
                      >
                        {expandedId === item.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {expandedId === item.id ? 'Hide' : 'View'} Breakdown
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-obsidian-700 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded breakdown */}
                  {expandedId === item.id && (
                    <div className="border-t border-obsidian-800 bg-obsidian-900/50 p-5">
                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(item.custom_specs as Record<string, string>).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-[8px] tracking-[0.2em] uppercase text-obsidian-600">{k}</p>
                            <p className="text-ivory text-xs mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* Price breakdown */}
                      <div className="space-y-1.5 border-t border-obsidian-800 pt-4">
                        {[
                          { label: `Item Cost × ${item.quantity}`, value: lineSubtotal },
                          { label: 'Import Duties & Tax', value: lineDuties },
                          { label: 'Installation Fee', value: item.installation_fee_ugx },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-xs">
                            <span className="text-obsidian-500">{label}</span>
                            <span className="text-ivory font-mono">{formatUGX(value)}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-sm border-t border-obsidian-700 pt-2 mt-2">
                          <span className="text-ivory font-medium">Line Total</span>
                          <span className="text-champagne-400 font-serif">{formatUGX(lineTotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2 bg-champagne-500/10 border border-champagne-500/20 rounded px-3 py-2">
                          <span className="text-champagne-400 font-medium">Deposit ({item.required_deposit_percentage}%)</span>
                          <span className="text-champagne-400 font-serif font-medium">{formatUGX(lineDeposit)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary panel */}
          <div className="space-y-4">
            <div className="glass-dark rounded overflow-hidden sticky top-24">
              <div className="p-5 border-b border-obsidian-800">
                <h3 className="font-serif text-lg font-light text-ivory">Order Summary</h3>
              </div>

              <div className="p-5 space-y-3">
                {[
                  { label: 'Items Subtotal', value: summary.subtotal },
                  { label: 'Import Duties', value: summary.totalDuties },
                  { label: 'Installation Fees', value: summary.totalInstallation },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-obsidian-500">{label}</span>
                    <span className="text-ivory font-mono text-xs">{formatUGX(value)}</span>
                  </div>
                ))}

                <div className="flex justify-between border-t border-obsidian-700 pt-3">
                  <span className="text-ivory font-medium">Grand Total</span>
                  <span className="text-champagne-400 font-serif text-lg">{formatUGX(summary.grandTotal)}</span>
                </div>
              </div>

              {/* Payment split */}
              <div className="mx-5 mb-5 rounded overflow-hidden border border-champagne-500/30">
                <div className="bg-champagne-500/15 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={13} className="text-champagne-400" />
                    <span className="text-[9px] tracking-[0.2em] uppercase text-champagne-400">Deposit Due Now</span>
                  </div>
                  <p className="text-champagne-400 font-serif text-2xl">{formatUGX(summary.depositDue)}</p>
                  <p className="text-champagne-600 text-[10px] mt-1">Required to confirm & place all orders</p>
                </div>
                <div className="bg-obsidian-900/50 p-4 border-t border-champagne-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 block mb-0.5">Balance Due Upon Installation</span>
                      <span className="text-ivory font-serif text-lg">{formatUGX(summary.balanceDue)}</span>
                    </div>
                    <Info size={14} className="text-obsidian-600" />
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => setConfirming(true)}
                  disabled={items.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-champagne-400 transition-colors disabled:opacity-40"
                >
                  Pay Deposit — {formatUGX(summary.depositDue)}
                  <ArrowRight size={13} />
                </button>
                <p className="text-obsidian-700 text-[9px] text-center mt-3 leading-relaxed">
                  Payment processed securely. Your designer will confirm order placement within 24h.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation modal */}
        {confirming && (
          <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-dark rounded w-full max-w-md p-8 text-center animate-fade-up">
              <div className="w-12 h-12 border border-champagne-500/50 rotate-45 flex items-center justify-center mx-auto mb-6">
                <div className="w-4 h-4 bg-champagne-500 rotate-0" />
              </div>
              <h3 className="font-serif text-2xl font-light text-ivory mb-2">Confirm Deposit</h3>
              <p className="text-obsidian-400 text-sm mb-6">
                You are about to pay a deposit of{' '}
                <span className="text-champagne-400 font-medium">{formatUGX(summary.depositDue)}</span>{' '}
                to confirm procurement of {items.length} item{items.length > 1 ? 's' : ''}.
              </p>
              <p className="text-obsidian-600 text-xs mb-8">
                The remaining balance of {formatUGX(summary.balanceDue)} will be due upon successful installation and handover.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-3 border border-obsidian-700 text-obsidian-400 text-[11px] tracking-widest uppercase hover:text-ivory hover:border-obsidian-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setConfirming(false); alert('Payment flow — connect to Stripe or FlutterWave') }}
                  className="flex-1 py-3 bg-champagne-500 text-obsidian-950 text-[11px] tracking-widest uppercase font-medium hover:bg-champagne-400 transition-colors"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
