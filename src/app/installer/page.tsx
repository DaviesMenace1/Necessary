'use client'
import { useState } from 'react'
import DashboardSidebar, { MobileTopBar } from '@/components/layouts/DashboardSidebar'
import { MapPin, Clock, CheckCircle2, ChevronDown, ChevronUp, Phone, FileText, Wrench } from 'lucide-react'

const JOBS = [
  {
    id: 'j1',
    project: 'Bugolobi Penthouse — Living Room',
    client: 'Fatima Nkrumah',
    clientPhone: '+256 772 000 001',
    address: '14 Bugolobi Close, Kampala',
    time: '08:00 AM',
    duration: '6 hours',
    status: 'in_progress' as const,
    specs: [
      { label: 'Item', value: 'Cassina LC4 Chaise — Black Leather' },
      { label: 'Layout ref', value: 'Floor Plan v4 — Zone B, NW corner' },
      { label: 'Fixing', value: 'Furniture feet pads + wall anchor points' },
      { label: 'Special note', value: 'Marble floor — no dragging, use felt pads' },
    ],
    layoutUrl: '/docs/bugolobi-floorplan-v4.pdf',
  },
  {
    id: 'j2',
    project: 'Bugolobi Penthouse — Master Bedroom',
    client: 'Fatima Nkrumah',
    clientPhone: '+256 772 000 001',
    address: '14 Bugolobi Close, Kampala',
    time: '02:00 PM',
    duration: '4 hours',
    status: 'pending' as const,
    specs: [
      { label: 'Item', value: 'Flos Arrangements Pendant × 2 units' },
      { label: 'Ceiling height', value: '3.2m — use 10cm cable drop' },
      { label: 'Electrician', value: 'Moses Kato on site from 1:30 PM' },
      { label: 'Dimmer spec', value: 'Legrand Valena 500W dimmer, already installed' },
    ],
    layoutUrl: '/docs/bugolobi-floorplan-v4.pdf',
  },
  {
    id: 'j3',
    project: 'Nakasero Office — Reception',
    client: 'Amara Diallo',
    clientPhone: '+256 772 000 002',
    address: '5 Parliament Avenue, Nakasero',
    time: 'Tomorrow 09:00 AM',
    duration: '8 hours',
    status: 'scheduled' as const,
    specs: [
      { label: 'Item', value: 'Custom reception desk — marble top, steel frame' },
      { label: 'Weight', value: '~380kg — 4-person lift required' },
      { label: 'Access', value: 'Service elevator only, 2.1m clearance' },
      { label: 'Sign-off', value: 'Security clearance: show ID at reception' },
    ],
    layoutUrl: '/docs/nakasero-floorplan-v2.pdf',
  },
]

const STATUS_CONFIG = {
  in_progress: { label: 'In Progress', class: 'badge-active', dot: 'bg-champagne-500 animate-pulse' },
  pending: { label: 'Next Up', class: 'badge-pending', dot: 'bg-obsidian-500' },
  scheduled: { label: 'Tomorrow', class: 'badge-sourcing', dot: 'bg-blue-500' },
  completed: { label: 'Done', class: 'badge-complete', dot: 'bg-emerald-500' },
}

export default function InstallerDashboard() {
  const [expandedId, setExpandedId] = useState<string | null>('j1')
  const [completing, setCompleting] = useState<string | null>(null)
  const [completed, setCompleted] = useState<string[]>([])

  const handleComplete = async (jobId: string) => {
    await new Promise(r => setTimeout(r, 1000))
    setCompleted(prev => [...prev, jobId])
    setCompleting(null)
  }

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-ivory">
      <DashboardSidebar role="installer" userName="David Ssempa" userEmail="david@interio.com" />
      <MobileTopBar role="installer" userName="David Ssempa" />

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <span className="text-[9px] tracking-widest uppercase text-obsidian-500">Field Dashboard</span>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-ivory mt-1">Today's Installations</h1>
          <div className="divider-luxury mt-3" />
          <p className="text-obsidian-500 text-xs font-light mt-2">
            Sunday, 7 June 2026 · Kampala & Nakasero
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Jobs Today', value: '2', color: 'text-champagne-400' },
            { label: 'Completed', value: completed.length.toString(), color: 'text-emerald-400' },
            { label: 'Tomorrow', value: '1', color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-dark rounded p-3 text-center">
              <p className={`font-serif text-2xl font-light ${color}`}>{value}</p>
              <p className="text-obsidian-600 text-[9px] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-4">
          {JOBS.map(job => {
            const isExpanded = expandedId === job.id
            const isDone = completed.includes(job.id)
            const statusKey = isDone ? 'completed' : job.status
            const config = STATUS_CONFIG[statusKey]

            return (
              <div
                key={job.id}
                className={`glass-dark rounded overflow-hidden border transition-all duration-300 ${
                  isDone ? 'border-emerald-500/20 opacity-60' :
                  job.status === 'in_progress' ? 'border-champagne-500/30' :
                  'border-transparent'
                }`}
              >
                {/* Job header */}
                <button
                  className="w-full p-5 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : job.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                        <span className={`badge ${config.class}`}>{config.label}</span>
                      </div>
                      <h3 className="text-ivory text-sm font-medium leading-snug mb-1">{job.project}</h3>
                      <div className="flex items-center gap-3 text-[10px] text-obsidian-500">
                        <span className="flex items-center gap-1"><Clock size={10} />{job.time}</span>
                        <span>{job.duration}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-obsidian-600 shrink-0 mt-1" /> : <ChevronDown size={14} className="text-obsidian-600 shrink-0 mt-1" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-obsidian-800">
                    {/* Location */}
                    <div className="px-5 py-4 border-b border-obsidian-800 flex items-start gap-2.5">
                      <MapPin size={13} className="text-champagne-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-ivory text-sm">{job.address}</p>
                        <a href={`tel:${job.clientPhone}`} className="flex items-center gap-1.5 text-champagne-400 text-xs mt-1">
                          <Phone size={10} />
                          {job.client} · {job.clientPhone}
                        </a>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="px-5 py-4 border-b border-obsidian-800">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Wrench size={12} className="text-obsidian-500" />
                        <span className="text-[9px] tracking-widest uppercase text-obsidian-500">Technical Specs</span>
                      </div>
                      <div className="space-y-2.5">
                        {job.specs.map(({ label, value }) => (
                          <div key={label} className="flex gap-3">
                            <span className="text-[9px] uppercase tracking-widest text-obsidian-600 w-20 shrink-0 mt-0.5">{label}</span>
                            <span className="text-ivory text-xs leading-relaxed">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-4 flex flex-col sm:flex-row gap-3">
                      <a
                        href={job.layoutUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-obsidian-700 text-[10px] tracking-widest uppercase text-obsidian-400 hover:text-ivory hover:border-obsidian-500 transition-colors"
                      >
                        <FileText size={12} />
                        View Layout
                      </a>

                      {!isDone && (
                        <button
                          onClick={() => setCompleting(job.id)}
                          disabled={job.status === 'scheduled'}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-champagne-500 text-obsidian-950 text-[10px] tracking-widest uppercase font-medium hover:bg-champagne-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 size={12} />
                          Complete & Request Invoice
                        </button>
                      )}

                      {isDone && (
                        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-[10px] tracking-widest uppercase text-emerald-400">
                          <CheckCircle2 size={12} />
                          Completed · Invoice Sent
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Completion confirmation */}
      {completing && (
        <div
          className="fixed inset-0 z-50 bg-obsidian-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setCompleting(null)}
        >
          <div className="glass-dark w-full max-w-sm rounded p-8 text-center animate-fade-up">
            <Wrench size={28} className="text-champagne-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-light text-ivory mb-2">Mark as Complete?</h3>
            <p className="text-obsidian-400 text-sm mb-6 leading-relaxed">
              This will notify the admin team and trigger the final invoice to be sent to the client.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCompleting(null)}
                className="flex-1 py-3 border border-obsidian-700 text-obsidian-400 text-[10px] tracking-widest uppercase hover:text-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleComplete(completing)}
                className="flex-1 py-3 bg-emerald-600 text-white text-[10px] tracking-widest uppercase font-medium hover:bg-emerald-500 transition-colors"
              >
                Confirm Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
