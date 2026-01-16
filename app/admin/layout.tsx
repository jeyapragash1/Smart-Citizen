'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  Building2,
  Stamp,
  FileText,
  Activity,
  MapPin,
  Lock,
  ShoppingBag,
  Settings,
  DollarSign,
  Home,
  Bell,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Hook for navigation
  const [authChecked, setAuthChecked] = useState(false);

  // 🔴 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  // 🚦 Client-side auth/role guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const roleRaw = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const role = roleRaw ? roleRaw.toLowerCase() : null;

    // Map various stored role labels to canonical keys
    const toCanonical = (r: string | null) => {
      if (!r) return null;
      const s = r.trim().toLowerCase();
      if (s === 'admin' || s === 'super' || s === 'super admin' || s === 'system admin' || s === 'administrator') return 'admin';
      if (s === 'ds' || s === 'divisional secretary' || s === 'divisional-secretary' || s === 'ds_officer') return 'ds';
      if (s === 'gs' || s === 'grama niladhari' || s === 'grama-niladhari' || s === 'gs_officer') return 'gs';
      return s; // fall through to stored value
    };
    const canonicalRole = toCanonical(role);

    // Map path to required role
    const requiredRole = pathname.startsWith('/admin/gs')
      ? 'gs'
      : pathname.startsWith('/admin/ds')
      ? 'ds'
      : pathname.startsWith('/admin/super') || pathname === '/admin/messages'
      ? 'admin'
      : null;

    if (!token || !canonicalRole) {
      router.replace('/login');
      return;
    }

    if (requiredRole && canonicalRole !== requiredRole) {
      // Redirect to the correct role home instead of citizen dashboard
      const target = canonicalRole === 'admin'
        ? '/admin/super'
        : canonicalRole === 'ds'
        ? '/admin/ds'
        : canonicalRole === 'gs'
        ? '/admin/gs'
        : '/dashboard';
      router.replace(target);
      return;
    }

    setAuthChecked(true);
  }, [pathname, router]);

  // 🤖 AUTO-DETECT ROLE
  let currentRole = 'GUEST';
  let menuItems: any[] = [];
  let themeColor = 'bg-slate-900'; 

  // Role Logic (Same as before)
  if (pathname.startsWith('/admin/gs')) {
    currentRole = 'GRAMA NILADHARI';
    themeColor = 'bg-blue-900';
    menuItems = [
      { name: 'GS Overview', icon: <LayoutDashboard size={20} />, path: '/admin/gs' },
      { name: 'Verify Applications', icon: <FileCheck size={20} />, path: '/admin/gs/verify' },
      { name: 'Villager Database', icon: <Users size={20} />, path: '/admin/gs/villagers' },
      { name: 'Land Disputes', icon: <MapPin size={20} />, path: '/admin/gs/land' },
      { name: 'Certificates', icon: <Stamp size={20} />, path: '/admin/gs/certificates' },
      { name: 'Records & Archives', icon: <FileText size={20} />, path: '/admin/gs/records' },
      { name: 'Statistics', icon: <Activity size={20} />, path: '/admin/gs/statistics' },
      { name: 'Messages', icon: <MessageSquare size={20} />, path: '/admin/gs/messages' },
      { name: 'Settings', icon: <Settings size={20} />, path: '/admin/gs/settings' },
    ];
  } else if (pathname.startsWith('/admin/ds')) {
    currentRole = 'DIVISIONAL SECRETARY';
    themeColor = 'bg-purple-900';
    menuItems = [
      { name: 'DS Overview', icon: <LayoutDashboard size={20} />, path: '/admin/ds' },
      { name: 'Application Approvals', icon: <FileCheck size={20} />, path: '/admin/ds/approvals' },
      { name: 'Batch Approvals', icon: <FileCheck size={20} />, path: '/admin/ds/batch' },
      { name: 'Manage GS Officers', icon: <Users size={20} />, path: '/admin/ds/gs' },
      { name: 'GS Performance', icon: <Activity size={20} />, path: '/admin/ds/performance' },
      { name: 'Signed Certificates', icon: <FileText size={20} />, path: '/admin/ds/certificates' },
      { name: 'Quality Assurance', icon: <FileCheck size={20} />, path: '/admin/ds/qa' },
      { name: 'Citizen Complaints', icon: <ShieldAlert size={20} />, path: '/admin/ds/complaints' },
      { name: 'Activity Logs', icon: <Activity size={20} />, path: '/admin/ds/logs' },
      { name: 'Digital Signatures', icon: <Lock size={20} />, path: '/admin/ds/signatures' },
      { name: 'Workflow Analytics', icon: <BarChart3 size={20} />, path: '/admin/ds/analytics' },
      { name: 'Notifications', icon: <Bell size={20} />, path: '/admin/ds/notifications' },
      { name: 'Report Generator', icon: <FileText size={20} />, path: '/admin/ds/reports' },
      { name: 'Escalations', icon: <ShieldAlert size={20} />, path: '/admin/ds/escalations' },
      { name: 'Regional Reports', icon: <Building2 size={20} />, path: '/admin/ds/regional' },
      { name: 'Revenue & Payments', icon: <DollarSign size={20} />, path: '/admin/ds/revenue' },
      { name: 'Messages', icon: <MessageSquare size={20} />, path: '/admin/ds/messages' },
      { name: 'Settings', icon: <Settings size={20} />, path: '/admin/ds/settings' },
    ];
  } else if (pathname.startsWith('/admin/super')) {
    currentRole = 'SUPER ADMIN';
    themeColor = 'bg-slate-950';
    menuItems = [
      { name: 'System Monitor', icon: <Activity size={20} />, path: '/admin/super' },
      { name: 'Manage DS Divisions', icon: <Users size={20} />, path: '/admin/super/divisions' },
      { name: 'Officer Management', icon: <Users size={20} />, path: '/admin/super/users' },
      { name: 'Marketplace Manager', icon: <ShoppingBag size={20} />, path: '/admin/super/products' },
      { name: 'Service Configuration', icon: <Settings size={20} />, path: '/admin/super/services' },
      { name: 'Revenue Analytics', icon: <DollarSign size={20} />, path: '/admin/super/revenue' },
      { name: 'Security & Logs', icon: <ShieldAlert size={20} />, path: '/admin/super/logs' },
      { name: 'Database Config', icon: <Lock size={20} />, path: '/admin/super/db' },
      { name: 'Messages', icon: <MessageSquare size={20} />, path: '/admin/messages' },
      { name: 'Deployments & CI/CD', icon: <Activity size={20} />, path: '/admin/super/deployments' },
      { name: 'Alerts & Notifications', icon: <Bell size={20} />, path: '/admin/super/notifications' },
      { name: 'Audit & Compliance', icon: <ShieldAlert size={20} />, path: '/admin/super/audit' },
      { name: 'Integrations', icon: <Settings size={20} />, path: '/admin/super/integrations' },
      { name: 'Feature Flags', icon: <Settings size={20} />, path: '/admin/super/features' },
      { name: 'Support Desk', icon: <Users size={20} />, path: '/admin/super/support' },
    ];
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Verifying access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${themeColor} text-white transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 bg-black/20 gap-2">
           <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold border-2 border-white shadow-lg">🦁</div>
           <div>
             <h1 className="font-bold text-xs tracking-widest text-white/90">GOV.LK OFFICIAL</h1>
             <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">{currentRole}</p>
           </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 mt-4">
          {/* Back to Home Button */}
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/60 hover:bg-white/10 hover:text-white mb-4 border border-white/20">
              <Home size={20} />
              <span className="font-medium text-sm">Back to Home</span>
            </div>
          </Link>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-white/20 text-white shadow-lg border-l-4 border-yellow-400' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 🔴 LOGOUT BUTTON (UPDATED) */}
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={handleLogout} // Calls the function
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/30 text-left"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600"><Menu /></button>
            <div className="flex items-center gap-4 ml-auto">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">System Admin</p>
                    <p className="text-xs text-gray-500">{currentRole}</p>
                </div>
                <button
                  onClick={() => {
                    const roleRaw = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
                    const s = roleRaw ? roleRaw.toLowerCase() : null;
                    const toCanonical = (r: string | null) => {
                      if (!r) return null;
                      const x = r.trim().toLowerCase();
                      if (x === 'admin' || x === 'super' || x === 'super admin' || x === 'system admin' || x === 'administrator') return 'admin';
                      if (x === 'ds' || x === 'divisional secretary' || x === 'divisional-secretary' || x === 'ds_officer') return 'ds';
                      if (x === 'gs' || x === 'grama niladhari' || x === 'grama-niladhari' || x === 'gs_officer') return 'gs';
                      return x;
                    };
                    const role = toCanonical(s);
                    const target = role === 'admin' ? '/admin/super' : role === 'ds' ? '/admin/ds' : role === 'gs' ? '/admin/gs' : '/dashboard';
                    router.push(target);
                  }}
                  className={`w-10 h-10 ${themeColor} rounded-full flex items-center justify-center text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  aria-label="Open role dashboard"
                >
                  OP
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}