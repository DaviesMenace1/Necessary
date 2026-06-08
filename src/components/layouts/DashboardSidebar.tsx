'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderOpen, ShoppingBag, FileText,
  Users, Settings, Wrench, ClipboardList, LogOut,
  ChevronRight
} from 'lucide-react'
import type { AppRole } from '@/types/database'

interface SidebarProps {
  role: AppRole
  userName: string
  userEmail: string
}

const CLIENT_LINKS = [
  { href: '/client', label: 'Overview', icon: LayoutDashboard },
  { href: '/client/timeline', label: 'Project Timeline', icon: FolderOpen },
  { href: '/client/vault', label: 'Document Vault', icon: FileText },
  { href: '/client/cart', label: 'Procurement Cart', icon: ShoppingBag },
]

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Client Profiles', icon: Users },
  { href: '/admin/projects', label: 'All Projects', icon: FolderOpen },
  { href: '/admin/sourcing', label: 'Sourcing Tool', icon: ClipboardList },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const INSTALLER_LINKS = [
  { href: '/installer', label: 'Today\'s Jobs', icon: LayoutDashboard },
  { href: '/installer/completed', label: 'Completed', icon: ClipboardList },
]

const ROLE_LABELS: Record<AppRole, string> = {
  client: 'Client Portal',
  designer: 'Design Studio',
  admin: 'Admin Console',
  installer: 'Field Dashboard',
}

const ROLE_COLORS: Record<AppRole, string> = {
  client: 'text-champagne-400',
  designer: 'text-blue-400',
  admin: 'text-purple-400',
  installer: 'text-emerald-400',
}

export default function DashboardSidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()

  const links =
    role === 'client' ? CLIENT_LINKS :
    role === 'installer' ? INSTALLER_LINKS :
    ADMIN_LINKS

  return (
    <aside className="hidden md:flex flex-col w-64 bg-obsidian-950 border-r border-obsidian-900 min-h-screen fixed left-0 top-0 z-30">
      {/* Brand */}
      <div className="p-6 border-b border-obsidian-900">
        <Link href="/" className="flex flex-col leading-none mb-4">
          <span className="font-serif text-xl font-light tracking-[0.25em] text-ivory">INTERIO</span>
          <span className={`text-[8px] tracking-[0.3em] uppercase font-light mt-0.5 ${ROLE_COLORS[role]}`}>
            {ROLE_LABELS[role]}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/client' && href !== '/admin' && href !== '/installer' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={10} className="text-champagne-500" />}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-obsidian-900">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-7 h-7 bg-champagne-500 flex items-center justify-center text-obsidian-950 text-xs font-bold shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-ivory text-xs truncate font-medium">{userName}</p>
            <p className="text-obsidian-600 text-[10px] truncate">{userEmail}</p>
          </div>
        </div>
        <button className="sidebar-link w-full text-red-500/60 hover:text-red-400 hover:bg-red-500/5">
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

// Mobile top bar
export function MobileTopBar({ role, userName }: { role: AppRole; userName: string }) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass-dark flex items-center justify-between px-4 py-3">
      <Link href="/" className="font-serif text-lg tracking-[0.2em] text-ivory">INTERIO</Link>
      <div className="flex items-center gap-3">
        <span className={`text-[9px] uppercase tracking-widest ${ROLE_COLORS[role]}`}>{role}</span>
        <div className="w-7 h-7 bg-champagne-500 flex items-center justify-center text-obsidian-950 text-xs font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  )
}
