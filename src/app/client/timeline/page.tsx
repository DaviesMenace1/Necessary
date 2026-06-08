'use client'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { CheckCircle2, Circle, Clock, MapPin, User, DollarSign } from 'lucide-react'
import { formatUGX } from '@/types/database'

const PHASES = [
  {
    key: 'concept',
    label: 'Concept & Vision',
    description: 'Initial consultation, space analysis, and mood board creation.',
    status: 'complete' as const,
    completedDate: '2025-04-10',
    milestones: [
      { label: 'Discovery call completed', done: true },
      { label: 'Mood board approved', done: true },
      { label: 'Design brief signed off', done: true },
    ],
  },
  {
    key: 'architectural_review',
    label: 'Architectural Review',
    description: 'Structural assessment, blueprints, and space planning finalised.',
    status: 'complete' as const,
    completedDate: '2025-05-02',
    milestones: [
      { label: 'Site survey completed', done: true },
      { label: 'Blueprint v3 approved', done: true },
      { label: 'Permits obtained', done: true },
    ],
  },
  {
    key: 'sourcing',
    label: 'Global Sourcing',
    description: 'Material curation from international suppliers and custom fabricators.',
    status: 'active' as const,
    milestones: [
      { label: 'Italian marble selected & ordered', done: true },
      { label: 'Sofa & furniture confirmed', done: true },
      { label: 'Lighting fixtures — awaiting confirmation', done: false },
      { label: 'Kitchen island measurement finalised', done: false },
    ],
  },
  {
    key: 'importing',
    label: 'Importing & Logistics',
    description: 'Freight forwarding, customs clearance, and bonded warehousing.',
    status: 'pending' as const,
    milestones: [
      { label: 'Freight forwarder assigned', done: false },
      { label: 'Customs documentation', done: false },
      { label: 'Local delivery scheduled', done: false },
    ],
  },
  {
    key: 'installation',
    label: 'Precision Installation',
    description: 'On-site installation by certified technicians per layout specs.',
    status: 'pending' as const,
    milestones: [
      { label: 'Lead installer assigned', done: false },
      { label: 'Day 1 — Structural fixtures', done: false },
      { label: 'Day 2 — Furniture & décor', done: false },
      { label: 'Day 3 — Lighting & final checks', done: false },
    ],
  },
  {
    key: 'handover',
    label: 'Handover & Styling',
    description: 'Final reveal, styling session, and client sign-off.',
    status: 'pending' as const,
    milestones: [
      { label: 'Final walkthrough', done: false },
      { label: 'Snag list resolved', done: false },
      { label: 'Client sign-off', done: false },
    ],
  },
]

const PROJECT = {
  name: 'Kololo Residence — Master Suite',
  client: 'James Okafor',
  designer: 'Anika Mensah',
  installer: 'TBA',
  address: 'Kololo Hill Drive, Kampala',
  budget: 180000000,
  startDate: '2025-04-01',
  estimatedEnd: '2025-09-30',
}

export default function ProjectTimeline() {
  const activeIdx = PHASES.findIndex(p => p.status === 'active')
  const progress = Math.round(((activeIdx + 0.5) / PHASES.length) * 100)

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="client" userName="James Okafor" userEmail="james@email.com" />
      <MobileTopBar role="client" userName="James Okafor" />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
        {/* Header */}
        <div className="mb-8">
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-500">Client Portal</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ivory mt-1">{PROJECT.name}</h1>
          <div className="divider-luxury mt-3" />
        </div>

        {/* Project meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Designer', value: PROJECT.designer, icon: User },
            { label: 'Installer', value: PROJECT.installer, icon: User },
            { label: 'Site Address', value: PROJECT.address, icon: MapPin },
            { label: 'Budget', value: formatUGX(PROJECT.budget), icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-dark rounded p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={11} className="text-champagne-500" />
                <span className="text-[9px] tracking-widest uppercase text-obsidian-600">{label}</span>
              </div>
              <p className="text-ivory text-sm font-light">{value}</p>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="glass-dark rounded p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] tracking-widest uppercase text-obsidian-500">Overall Progress</span>
            <span className="text-champagne-400 font-serif text-2xl">{progress}%</span>
          </div>
          <div className="h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-champagne-600 to-champagne-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-obsidian-700">
            <span>{PROJECT.startDate}</span>
            <span>Est. {PROJECT.estimatedEnd}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-obsidian-800" />
          {/* Progress spine */}
          <div
            className="absolute left-5 md:left-8 top-0 w-px bg-champagne-500 transition-all duration-1000"
            style={{ height: `${progress}%` }}
          />

          <div className="space-y-0">
            {PHASES.map((phase, idx) => {
              const done = phase.status === 'complete'
              const active = phase.status === 'active'
              const pending = phase.status === 'pending'

              return (
                <div key={phase.key} className="relative pl-14 md:pl-20 pb-10">
                  {/* Node */}
                  <div className={`absolute left-2 md:left-4 top-1 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                    done ? 'bg-champagne-500 border-champagne-500' :
                    active ? 'bg-obsidian-900 border-champagne-500 ring-4 ring-champagne-500/20' :
                    'bg-obsidian-900 border-obsidian-700'
                  }`}>
                    {done ? (
                      <CheckCircle2 size={14} className="text-obsidian-950" />
                    ) : active ? (
                      <Clock size={12} className="text-champagne-400 animate-pulse" />
                    ) : (
                      <Circle size={12} className="text-obsidian-700" />
                    )}
                  </div>

                  {/* Content card */}
                  <div className={`glass-dark rounded overflow-hidden transition-all duration-300 ${
                    active ? 'border border-champagne-500/30' : 'border border-transparent'
                  }`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono text-obsidian-600">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            {active && <span className="badge badge-active">In Progress</span>}
                            {done && <span className="badge badge-complete">Complete</span>}
                            {pending && <span className="badge badge-pending">Upcoming</span>}
                          </div>
                          <h3 className={`font-serif text-lg font-light ${
                            active ? 'text-champagne-300' : done ? 'text-ivory' : 'text-obsidian-500'
                          }`}>
                            {phase.label}
                          </h3>
                        </div>
                        {phase.completedDate && (
                          <span className="text-[10px] text-obsidian-600 font-mono shrink-0">
                            Completed {phase.completedDate}
                          </span>
                        )}
                      </div>

                      <p className={`text-sm font-light leading-relaxed mb-4 ${
                        pending ? 'text-obsidian-700' : 'text-obsidian-400'
                      }`}>
                        {phase.description}
                      </p>

                      {/* Milestones */}
                      <div className="space-y-2">
                        {phase.milestones.map((m, mi) => (
                          <div key={mi} className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              m.done
                                ? 'bg-champagne-500 border-champagne-500'
                                : 'border-obsidian-700 bg-transparent'
                            }`}>
                              {m.done && <span className="text-obsidian-950 text-[8px] font-bold">✓</span>}
                            </div>
                            <span className={`text-xs ${
                              m.done ? 'text-obsidian-400 line-through' : 
                              active ? 'text-ivory' : 'text-obsidian-700'
                            }`}>
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
