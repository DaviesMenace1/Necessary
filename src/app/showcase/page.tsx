'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, ArrowRight, ZoomIn, Tag } from 'lucide-react'

interface Hotspot {
  x: number // % from left
  y: number // % from top
  product: {
    title: string
    category: string
    origin: string
    material: string
    dimensions: string
    priceRange: string
    leadTime: string
  }
}

interface ShowcaseProject {
  id: string
  title: string
  category: 'residential' | 'commercial'
  location: string
  year: string
  img: string
  hotspots: Hotspot[]
}

const SHOWCASE: ShowcaseProject[] = [
  {
    id: 'lagos-penthouse',
    title: 'The Lagos Penthouse',
    category: 'residential',
    location: 'Victoria Island, Lagos',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85',
    hotspots: [
      {
        x: 25, y: 40,
        product: {
          title: 'Modena Sofa — Custom 3-Seater',
          category: 'Seating',
          origin: 'Italy (Poltrona Frau)',
          material: 'Full-grain Pelle Frau® leather, solid walnut frame',
          dimensions: 'L 260 × D 95 × H 80 cm',
          priceRange: 'UGX 42,000,000 – 58,000,000',
          leadTime: '14–18 weeks',
        },
      },
      {
        x: 65, y: 25,
        product: {
          title: 'Travertine Coffee Table',
          category: 'Tables',
          origin: 'Turkey',
          material: 'Brushed travertine slab, brushed gold steel base',
          dimensions: 'L 120 × D 60 × H 38 cm',
          priceRange: 'UGX 12,500,000 – 16,000,000',
          leadTime: '6–8 weeks',
        },
      },
    ],
  },
  {
    id: 'kigali-hub',
    title: 'Kigali Business Hub',
    category: 'commercial',
    location: 'Kigali, Rwanda',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
    hotspots: [
      {
        x: 50, y: 55,
        product: {
          title: 'Vitra Grand Executive Chair',
          category: 'Seating',
          origin: 'Switzerland',
          material: 'Hopsak fabric, polished aluminum base',
          dimensions: 'W 71 × D 81 × H 90–100 cm',
          priceRange: 'UGX 8,200,000 – 11,000,000',
          leadTime: '8–10 weeks',
        },
      },
    ],
  },
  {
    id: 'cape-villa',
    title: 'Cape Town Villa',
    category: 'residential',
    location: 'Clifton, Cape Town',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85',
    hotspots: [
      {
        x: 30, y: 60,
        product: {
          title: 'Bulthaup Kitchen Island',
          category: 'Kitchen',
          origin: 'Germany',
          material: 'Titanium finish aluminum, Bardiglio marble top',
          dimensions: 'Custom to space',
          priceRange: 'UGX 85,000,000+',
          leadTime: '20–24 weeks',
        },
      },
      {
        x: 72, y: 35,
        product: {
          title: 'Flos Arrangements Pendant',
          category: 'Lighting',
          origin: 'Italy',
          material: 'Die-cast aluminum, borosilicate glass',
          dimensions: 'Ø 48 cm, cable adjustable',
          priceRange: 'UGX 5,800,000 – 8,000,000',
          leadTime: '6–8 weeks',
        },
      },
    ],
  },
  {
    id: 'nairobi-suite',
    title: 'Nairobi Executive Suite',
    category: 'commercial',
    location: 'Upper Hill, Nairobi',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85',
    hotspots: [
      {
        x: 45, y: 45,
        product: {
          title: 'Herman Miller Eames Lounge',
          category: 'Seating',
          origin: 'USA',
          material: 'Santos Palisander veneer, black leather cushions',
          dimensions: 'W 84 × D 86 × H 89 cm',
          priceRange: 'UGX 24,000,000 – 28,000,000',
          leadTime: '10–12 weeks',
        },
      },
    ],
  },
]

export default function ShowcasePage() {
  const [filter, setFilter] = useState<'all' | 'residential' | 'commercial'>('all')
  const [activeHotspot, setActiveHotspot] = useState<{ projectId: string; idx: number } | null>(null)

  const filtered = SHOWCASE.filter(p => filter === 'all' || p.category === filter)

  const getActiveProduct = () => {
    if (!activeHotspot) return null
    const proj = SHOWCASE.find(p => p.id === activeHotspot.projectId)
    return proj?.hotspots[activeHotspot.idx]?.product || null
  }
  const activeProduct = getActiveProduct()

  return (
    <main className="bg-obsidian-950 min-h-screen text-ivory pt-24">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-10">
          <Link href="/" className="text-[10px] tracking-[0.2em] uppercase text-obsidian-500 hover:text-champagne-400 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <span className="text-[9px] tracking-[0.4em] uppercase text-champagne-500 mb-3 block">Portfolio</span>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-ivory leading-tight">
              The Showcase
            </h1>
            <div className="divider-luxury mt-4" />
            <p className="text-obsidian-400 text-sm font-light mt-4 max-w-md leading-relaxed">
              Hover over any room to reveal sourcing hotspots. Click to explore materials, origins, and add to your project cart.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 p-1 border border-obsidian-800 self-start">
            {(['all', 'residential', 'commercial'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200 ${
                  filter === f
                    ? 'bg-champagne-500 text-obsidian-950 font-medium'
                    : 'text-obsidian-400 hover:text-ivory'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <div key={project.id} className="group relative overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-103"
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-obsidian-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Hotspot hint icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1.5 bg-obsidian-950/80 px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase text-champagne-400">
                    <Tag size={10} />
                    {project.hotspots.length} item{project.hotspots.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Hotspots */}
                {project.hotspots.map((spot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHotspot({ projectId: project.id, idx })}
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                    aria-label={`View ${spot.product.title}`}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="hotspot-ring absolute inset-0 border border-champagne-400 rounded-full" />
                      <div className="w-3 h-3 bg-champagne-500 rounded-full border-2 border-ivory shadow-lg" />
                    </div>
                  </button>
                ))}

                {/* Zoom icon */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={16} className="text-ivory/60" />
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-light text-ivory">{project.title}</h3>
                  <p className="text-obsidian-500 text-xs mt-1">{project.location} · {project.year}</p>
                </div>
                <span className={`badge ${project.category === 'residential' ? 'badge-active' : 'badge-sourcing'}`}>
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCT POP-UP MODAL ── */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setActiveHotspot(null)}
        >
          <div className="glass-dark w-full max-w-lg rounded overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
              <div>
                <span className="text-[9px] tracking-[0.3em] uppercase text-champagne-500">{activeProduct.category}</span>
                <h3 className="font-serif text-xl font-light text-ivory mt-1">{activeProduct.title}</h3>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="w-8 h-8 flex items-center justify-center border border-obsidian-700 hover:border-obsidian-500 transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Origin', value: activeProduct.origin },
                  { label: 'Lead Time', value: activeProduct.leadTime },
                  { label: 'Material', value: activeProduct.material },
                  { label: 'Dimensions', value: activeProduct.dimensions },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 mb-1">{label}</p>
                    <p className="text-ivory text-sm font-light leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-obsidian-800">
                <p className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 mb-1">Price Range (UGX)</p>
                <p className="text-champagne-400 font-serif text-2xl font-light">{activeProduct.priceRange}</p>
                <p className="text-obsidian-600 text-[10px] mt-1">Import duties & installation fees quoted separately per project scope.</p>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Link
                href="/auth"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.12em] uppercase hover:bg-champagne-400 transition-colors"
              >
                <ShoppingBag size={13} />
                Add to Project Cart
              </Link>
              <button
                onClick={() => setActiveHotspot(null)}
                className="px-5 py-3 border border-obsidian-700 text-[11px] tracking-[0.12em] uppercase text-obsidian-400 hover:text-ivory hover:border-obsidian-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Strip */}
      <section className="border-t border-obsidian-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-ivory mb-4">
            Ready to begin your project?
          </h2>
          <p className="text-obsidian-400 text-sm font-light mb-8">
            Book a consultation and receive a complimentary design brief within 48 hours.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-10 py-4 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-champagne-400 transition-colors"
          >
            Enter Client Portal <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}
