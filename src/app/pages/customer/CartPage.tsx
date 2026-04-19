import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../contexts/CartContext';
import { useOrder } from '../../contexts/OrderContext';
import { CartItemCard } from '../../components/CartItemCard';
import { Button } from '../../components/Button';
import { ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { createOrder } = useOrder();
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const tableNumber = localStorage.getItem('tableNumber') || '01';

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const orderId = await createOrder(tableNumber, cartItems, total);
      clearCart();
      navigate(`/confirmation/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError('Có lỗi xảy ra khi đặt món. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Header */}
      <header className="bg-[#3E2723] text-white px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/menu?table=${tableNumber}`)}
            className="p-2 hover:bg-[#4E342E] rounded-lg transition"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg">Giỏ hàng</h1>
            <p className="text-sm text-[#D7CCC8]">Bàn {tableNumber}</p>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <div className="flex-1 p-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Giỏ hàng trống</p>
            <Button onClick={() => navigate(`/menu?table=${tableNumber}`)}>
              Xem thực đơn
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Order Button */}
      {cartItems.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0">
          {/* Error Message */}
          {orderError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{orderError}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Tổng cộng:</span>
            <span className="text-2xl text-[#6D4C41]">
              {total.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            className="w-full"
            size="lg"
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Đang đặt món...' : orderError ? 'Thử lại' : 'Đặt món'}
          </Button>
        </div>
      )}
    </div>
  );
}
