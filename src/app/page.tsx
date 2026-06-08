'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Menu, X, Mail, MapPin, Phone } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Showcase', href: '/showcase' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

const PHASES = [
  { num: '01', title: 'Concept', sub: 'Vision & Mood Boarding' },
  { num: '02', title: 'Architectural Review', sub: 'Space Planning & Blueprints' },
  { num: '03', title: 'Sourcing', sub: 'Global Material Curation' },
  { num: '04', title: 'Importing', sub: 'Logistics & Customs Clearance' },
  { num: '05', title: 'Installation', sub: 'Precision Execution' },
  { num: '06', title: 'Handover', sub: 'Final Reveal & Styling' },
]

const PROJECTS = [
  {
    title: 'The Lagos Penthouse',
    category: 'Residential',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },
  {
    title: 'Kigali Business Hub',
    category: 'Commercial',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  },
  {
    title: 'Cape Town Villa',
    category: 'Residential',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState<'residential' | 'commercial' | 'both'>('both')
  const [subscribed, setSubscribed] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production: call Supabase insert into newsletter_subscribers
    setSubscribed(true)
  }

  return (
    <main className="bg-obsidian-950 text-ivory min-h-screen">

      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark py-3' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-2xl font-light tracking-[0.25em] text-ivory">INTERIO</span>
            <span className="text-[9px] tracking-[0.35em] text-champagne-400 uppercase font-light mt-0.5">Design · Source · Install</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] tracking-[0.15em] uppercase text-obsidian-300 hover:text-champagne-400 transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth" className="text-[11px] tracking-[0.12em] uppercase text-obsidian-300 hover:text-ivory transition-colors duration-300">
              Client Portal
            </Link>
            <Link
              href="/auth"
              className="px-5 py-2.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.1em] uppercase hover:bg-champagne-400 transition-colors duration-200"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-ivory"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass-dark mt-3 mx-4 rounded p-6 flex flex-col gap-4">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] tracking-[0.2em] uppercase text-obsidian-200 py-1"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/auth" className="text-[12px] tracking-[0.2em] uppercase text-champagne-400 py-1">
              Client Portal
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO: CINEMATIC SPLIT LAYOUT ── */}
      <section className="min-h-screen grid md:grid-cols-2">
        {/* Left: Residential */}
        <div className="relative group overflow-hidden cursor-pointer min-h-[50vh] md:min-h-screen">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950/80 via-obsidian-950/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-10 md:p-16">
            <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-400 mb-3">Residential Projects</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-ivory leading-[1.1] mb-4">
              Where Homes<br />Become Havens
            </h2>
            <p className="text-obsidian-300 text-sm font-light leading-relaxed max-w-xs mb-6">
              Bespoke interiors crafted around your life — from concept drawings to the final curtain.
            </p>
            <Link
              href="/showcase?type=residential"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-champagne-400 hover:text-champagne-300 transition-colors group/link"
            >
              Explore Residential
              <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
          {/* Vertical line divider (desktop) */}
          <div className="hidden md:block absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-champagne-700/30 to-transparent" />
        </div>

        {/* Right: Commercial */}
        <div className="relative group overflow-hidden cursor-pointer min-h-[50vh] md:min-h-screen">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-obsidian-950/80 via-obsidian-950/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-10 md:p-16">
            <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-400 mb-3">Commercial Sourcing</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-ivory leading-[1.1] mb-4">
              Corporate Spaces<br />Reimagined
            </h2>
            <p className="text-obsidian-300 text-sm font-light leading-relaxed max-w-xs mb-6">
              Global sourcing expertise paired with precision installation — built for business at scale.
            </p>
            <Link
              href="/showcase?type=commercial"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-champagne-400 hover:text-champagne-300 transition-colors group/link"
            >
              Explore Commercial
              <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Centered brand mark */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-champagne-500" />
            <div className="w-8 h-8 border border-champagne-500/50 rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-champagne-500 rotate-0" />
            </div>
            <div className="w-px h-16 bg-gradient-to-t from-transparent to-champagne-500" />
          </div>
        </div>
      </section>

      {/* ── SCROLL INDICATOR ── */}
      <div className="bg-obsidian-950 flex justify-center py-6">
        <div className="flex flex-col items-center gap-2 animate-bounce opacity-40">
          <ChevronDown size={16} className="text-champagne-400" />
          <span className="text-[9px] tracking-[0.3em] uppercase text-obsidian-400">Scroll</span>
        </div>
      </div>

      {/* ── PROCESS / TIMELINE ── */}
      <section id="process" className="bg-obsidian-950 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-500 mb-3 block">Our Process</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ivory">Six Phases of Excellence</h2>
            <div className="divider-luxury mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {PHASES.map((phase, i) => (
              <div
                key={phase.num}
                className="text-center group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative mb-4">
                  <div className="w-12 h-12 mx-auto border border-obsidian-700 group-hover:border-champagne-500 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-champagne-500">{phase.num}</span>
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-0 h-px bg-obsidian-800" />
                  )}
                </div>
                <p className="text-ivory text-sm font-medium mb-1">{phase.title}</p>
                <p className="text-obsidian-500 text-[10px] leading-relaxed">{phase.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="bg-obsidian-900 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-500 mb-2 block">Portfolio</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-ivory">Selected Works</h2>
            </div>
            <Link
              href="/showcase"
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-champagne-400 hover:text-champagne-300 transition-colors group/link"
            >
              View All
              <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((proj) => (
              <div key={proj.title} className="card-lift group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] mb-4">
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6">
                    <Link
                      href="/showcase"
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-champagne-400"
                    >
                      Shop the Look <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-active">{proj.category}</span>
                    <span className="text-[10px] text-obsidian-500 font-mono">{proj.year}</span>
                  </div>
                  <h3 className="text-ivory font-serif text-lg font-light">{proj.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="contact" className="bg-obsidian-950 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-500 mb-4 block">Stay Informed</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-ivory mb-3">
            Receive Curated Design Insights
          </h2>
          <p className="text-obsidian-400 text-sm font-light leading-relaxed mb-10">
            Join our exclusive mailing list for project reveals, material trend reports, and sourcing intelligence.
          </p>

          {subscribed ? (
            <div className="glass-dark rounded p-8">
              <div className="w-10 h-10 border border-champagne-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-champagne-500 text-lg">✓</span>
              </div>
              <p className="font-serif text-xl text-ivory mb-1">You&apos;re on the list.</p>
              <p className="text-obsidian-400 text-sm">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label className="text-[9px] tracking-[0.2em] uppercase text-obsidian-400 block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-luxury text-ivory"
                  />
                </div>
                <div className="text-left">
                  <label className="text-[9px] tracking-[0.2em] uppercase text-obsidian-400 block mb-2">Interest</label>
                  <select
                    value={interest}
                    onChange={e => setInterest(e.target.value as typeof interest)}
                    className="input-luxury text-ivory bg-transparent"
                  >
                    <option value="residential" className="bg-obsidian-900">Residential</option>
                    <option value="commercial" className="bg-obsidian-900">Commercial</option>
                    <option value="both" className="bg-obsidian-900">Both</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-10 py-3.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-champagne-400 transition-colors duration-200"
              >
                Subscribe to Newsletter
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-obsidian-800 bg-obsidian-950 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl tracking-[0.25em] text-ivory block mb-3">INTERIO</span>
            <p className="text-obsidian-500 text-sm font-light leading-relaxed max-w-xs">
              Luxury interior design, global material sourcing, and precision installation for Africa&apos;s most discerning spaces.
            </p>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-champagne-500 mb-4">Quick Links</p>
            <div className="space-y-2">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block text-sm text-obsidian-400 hover:text-ivory transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-champagne-500 mb-4">Contact</p>
            <div className="space-y-3 text-sm text-obsidian-400">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-champagne-600" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-champagne-600" />
                <span>+256 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-champagne-600" />
                <span>hello@interio.design</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-obsidian-900 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-obsidian-600">
          <span>© {new Date().getFullYear()} INTERIO. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/auth" className="hover:text-obsidian-400 transition-colors">Client Portal</Link>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
