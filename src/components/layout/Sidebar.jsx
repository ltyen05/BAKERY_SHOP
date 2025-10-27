import { 
  LayoutDashboard, 
  Cookie,
  ShoppingCart, 
  Users, 
  UserCircle,
  Store,
  Ticket,
  Settings
} from 'lucide-react';

export default function Sidebar({ activePage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', icon: Cookie, label: 'Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'customers', icon: UserCircle, label: 'Customers' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'branches', icon: Store, label: 'Branches' },
    { id: 'vouchers', icon: Ticket, label: 'Vouchers' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="bg-gradient-to-b from-amber-600 to-amber-700 w-64 fixed left-0 top-0 bottom-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-amber-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-white">
            <div className="font-bold text-lg">HUS Bakery</div>
            <div className="text-xs text-amber-100">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="px-3 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-amber-700 shadow-lg'
                      : 'text-amber-50 hover:bg-amber-500 hover:bg-opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-500">
        <div className="text-amber-100 text-xs text-center">
         
        </div>
      </div>
    </aside>
  );
}
