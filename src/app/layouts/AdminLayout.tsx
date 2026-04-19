import { Outlet, Link, useLocation } from 'react-router';
import { Coffee, LayoutDashboard } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#3E2723] text-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <Coffee className="w-8 h-8 text-[#D7CCC8]" />
          <h1 className="text-xl">Coffee Admin</h1>
        </div>
        
        <nav className="space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === '/admin'
                ? 'bg-[#5D4037] text-white'
                : 'text-[#D7CCC8] hover:bg-[#4E342E]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Quản lý Menu</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
