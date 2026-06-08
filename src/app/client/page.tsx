'use client'
import Link from 'next/link'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { ArrowRight, Clock, FileText, ShoppingBag, TrendingUp } from 'lucide-react'

// Demo data — replace with Supabase queries in production
const DEMO_PROJECT = {
  name: 'Kololo Residence — Master Suite',
  phase: 'sourcing',
  phaseLabel: 'Sourcing',
  progress: 55,
  budget: 180000000,
  spent: 64500000,
  nextMilestone: 'Material delivery confirmation — Italian marble',
  nextDate: '2025-08-14',
}

const QUICK_STATS = [
  { label: 'Active Projects', value: '1', icon: TrendingUp, color: 'text-champagne-400' },
  { label: 'Items in Cart', value: '4', icon: ShoppingBag, color: 'text-blue-400' },
  { label: 'Documents', value: '7', icon: FileText, color: 'text-emerald-400' },
  { label: 'Days Remaining', value: '68', icon: Clock, color: 'text-purple-400' },
]

const PHASES = [
  { key: 'concept', label: 'Concept' },
  { key: 'architectural_review', label: 'Arch. Review' },
  { key: 'sourcing', label: 'Sourcing' },
  { key: 'importing', label: 'Importing' },
  { key: 'installation', label: 'Installation' },
  { key: 'handover', label: 'Handover' },
]

export default function ClientDashboard() {
  const currentPhaseIdx = PHASES.findIndex(p => p.key === DEMO_PROJECT.phase)

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="client" userName="James Okafor" userEmail="james@email.com" />
      <MobileTopBar role="client" userName="James Okafor" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        {/* Welcome */}
        <div className="mb-8">
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Client Portal</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1">
            Good morning, James.
          </h1>
          <div className="divider-luxury mt-3" />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {QUICK_STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-dark rounded p-5">
              <div className="flex items-start justify-between mb-3">
                <Icon size={16} className={color} />
              </div>
              <p className={`font-serif text-3xl font-light ${color} mb-1`}>{value}</p>
              <p className="text-obsidian-500 text-xs uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Active project card */}
        <div className="glass-dark rounded overflow-hidden mb-8">
          <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500 block mb-1">Active Project</span>
              <h2 className="font-serif text-xl font-light text-ivory">{DEMO_PROJECT.name}</h2>
            </div>
            <span className="badge badge-sourcing">{DEMO_PROJECT.phaseLabel}</span>
          </div>

          {/* Phase tracker */}
          <div className="p-6 border-b border-obsidian-800">
            <p className="text-[9px] tracking-[0.2em] uppercase text-obsidian-600 mb-5">Project Timeline</p>
            <div className="relative">
              {/* Track */}
              <div className="absolute top-4 left-0 right-0 h-px bg-obsidian-800" />
              <div
                className="absolute top-4 left-0 h-px bg-champagne-500 transition-all duration-1000"
                style={{ width: `${(currentPhaseIdx / (PHASES.length - 1)) * 100}%` }}
              />

              <div className="flex justify-between relative">
                {PHASES.map((phase, idx) => {
                  const done = idx < currentPhaseIdx
                  const current = idx === currentPhaseIdx
                  return (
                    <div key={phase.key} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
                        done ? 'bg-champagne-500 border-champagne-500' :
                        current ? 'bg-obsidian-900 border-champagne-500 ring-4 ring-champagne-500/20' :
                        'bg-obsidian-900 border-obsidian-700'
                      }`}>
                        {done ? (
                          <span className="text-obsidian-950 text-xs font-bold">✓</span>
                        ) : (
                          <span className={`text-[9px] font-mono ${current ? 'text-champagne-400' : 'text-obsidian-700'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] tracking-tight text-center leading-tight ${
                        current ? 'text-champagne-400 font-medium' :
                        done ? 'text-obsidian-500' :
                        'text-obsidian-700'
                      }`}>
                        {phase.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Budget & next milestone */}
          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div>
              <p className="text-[9px] tracking-widest uppercase text-obsidian-600 mb-2">Total Budget</p>
              <p className="font-serif text-xl text-ivory">UGX {(DEMO_PROJECT.budget / 1000000).toFixed(0)}M</p>
            </div>
            <div>
              <p className="text-[9px] tracking-widest uppercase text-obsidian-600 mb-2">Spent to Date</p>
              <p className="font-serif text-xl text-champagne-400">UGX {(DEMO_PROJECT.spent / 1000000).toFixed(1)}M</p>
              <div className="mt-2 h-1 bg-obsidian-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-champagne-500 rounded-full"
                  style={{ width: `${(DEMO_PROJECT.spent / DEMO_PROJECT.budget) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-[9px] tracking-widest uppercase text-obsidian-600 mb-2">Next Milestone</p>
              <p className="text-ivory text-sm font-light leading-relaxed">{DEMO_PROJECT.nextMilestone}</p>
              <p className="text-obsidian-500 text-xs mt-1">{DEMO_PROJECT.nextDate}</p>
            </div>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { href: '/client/timeline', label: 'View Full Timeline', icon: TrendingUp, desc: 'Track every renovation phase' },
            { href: '/client/vault', label: 'Document Vault', icon: FileText, desc: 'Download blueprints & mood boards' },
            { href: '/client/cart', label: 'Procurement Cart', icon: ShoppingBag, desc: '4 items · Deposit due' },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="glass-dark rounded p-5 group card-lift flex items-start justify-between"
            >
              <div>
                <Icon size={16} className="text-champagne-500 mb-3" />
                <p className="text-ivory text-sm font-medium mb-1">{label}</p>
                <p className="text-obsidian-500 text-xs">{desc}</p>
              </div>
              <ArrowRight size={14} className="text-obsidian-700 group-hover:text-champagne-400 transition-colors mt-1" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
