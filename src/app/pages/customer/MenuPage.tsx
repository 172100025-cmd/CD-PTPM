import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useMenu } from '../../contexts/MenuContext';
import { useCart } from '../../contexts/CartContext';
import { MenuCard } from '../../components/MenuCard';
import { ShoppingCart, Coffee, Cake, UtensilsCrossed, Grid3x3 } from 'lucide-react';
import { MenuItem } from '../../types';

type TabType = 'all' | 'drinks' | 'desserts' | 'food';

export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '01';
  const { menuItems, loading, refreshMenuItems } = useMenu();
  const { addToCart, cartItems } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const isFirstRender = useRef(true);

  // Save table number to localStorage (read-only from QR code)
  useEffect(() => {
    const tableFromUrl = searchParams.get('table');
    if (tableFromUrl) {
      localStorage.setItem('tableNumber', tableFromUrl);
    }
  }, [searchParams]);

  // AC5: Handle direct access - if no table param, default to 01
  useEffect(() => {
    if (!searchParams.get('table')) {
      navigate(`/menu?table=01`, { replace: true });
    }
  }, [searchParams, navigate]);

  // Refresh menu items when tab changes (skip first render to avoid double loading)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log('⏭️ Skipping initial tab load (already loaded by MenuProvider)');
      return;
    }

    console.log(`🔄 Tab changed to: ${activeTab} - refreshing menu items...`);
    refreshMenuItems();
  }, [activeTab, refreshMenuItems]);

  // Debug: Log when component renders
  console.log('🍽️ MenuPage render - activeTab:', activeTab, 'menuItems count:', menuItems.length, 'loading:', loading);

  const handleAddToCart = useCallback((item: MenuItem) => {
    addToCart(item);
  }, [addToCart]);

  const cartItemCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Filter menu items based on active tab (memoized to prevent unnecessary recalculation)
  const filteredItems = useMemo(() => {
    const filtered = menuItems.filter(item => {
      if (activeTab === 'all') return true;
      if (activeTab === 'drinks') return item.category === 'Đồ uống' || item.category === 'Cà phê';
      if (activeTab === 'desserts') return item.category === 'Bánh ngọt';
      if (activeTab === 'food') return item.category === 'Đồ ăn';
      return true;
    });
    // Sort by order
    const sorted = filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    console.log(`🔍 Filtered ${sorted.length} items for tab: ${activeTab}`);
    return sorted;
  }, [menuItems, activeTab]);

  // Tabs configuration
  const tabs = [
    { id: 'all' as TabType, label: 'Tất cả', icon: Grid3x3 },
    { id: 'drinks' as TabType, label: 'Đồ uống', icon: Coffee },
    { id: 'desserts' as TabType, label: 'Bánh ngọt', icon: Cake },
    { id: 'food' as TabType, label: 'Đồ ăn', icon: UtensilsCrossed },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#3E2723] text-white px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-[#D7CCC8]" />
            <div>
              <h1 className="text-lg">Bàn {tableNumber}</h1>
              <p className="text-sm text-[#D7CCC8]">Coffee House</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 hover:bg-[#4E342E] rounded-lg transition"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10 shadow-sm">
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] py-4 px-4 flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? 'text-[#6D4C41] border-b-2 border-[#6D4C41] bg-[#FAF8F5]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6D4C41]"></div>
            <p className="text-gray-600 mt-4">Đang tải menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {activeTab === 'all'
                ? 'Chưa có món nào trong thực đơn'
                : 'Chưa có món nào trong danh mục này'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Link Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FAF8F5] to-transparent py-4 text-center">
        <button
          onClick={() => navigate('/admin')}
          className="text-xs text-gray-400 hover:text-[#6D4C41] transition"
        >
          Quản trị viên
        </button>
      </div>
    </div>
  );
}
