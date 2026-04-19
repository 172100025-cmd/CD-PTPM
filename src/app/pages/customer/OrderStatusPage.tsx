import { useNavigate, useParams } from 'react-router';
import { useOrder } from '../../contexts/OrderContext';
import { OrderProgress } from '../../components/OrderProgress';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function OrderStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders } = useOrder();

  // Find order from orders array - will re-render when orders state changes
  const order = orderId ? orders.find(o => o.id === orderId) : undefined;

  // Debug: Log when component renders and current status
  console.log(`🔍 OrderStatusPage render - orderId: ${orderId}, status: ${order?.status}, orders count: ${orders.length}`);

  if (!order) {
    const savedTableNumber = localStorage.getItem('tableNumber') || '01';
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate(`/menu?table=${savedTableNumber}`)}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#3E2723] text-white px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/menu?table=${order.tableNumber}`)}
            className="p-2 hover:bg-[#4E342E] rounded-lg transition"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg">Trạng thái đơn hàng</h1>
            <p className="text-sm text-[#D7CCC8]">Bàn {order.tableNumber}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Order ID */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
          <p className="text-lg text-[#6D4C41] font-mono">{order.id}</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">Tiến trình</h2>
          <OrderProgress currentStatus={order.status} />
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">Chi tiết đơn hàng</h2>
          <div className="space-y-4 mb-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">x{item.quantity}</p>
                </div>
                <p className="text-[#6D4C41]">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-gray-900">Tổng cộng:</span>
            <span className="text-xl text-[#6D4C41]">
              {order.total.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            onClick={() => navigate(`/menu?table=${order.tableNumber}`)}
            className="w-full"
            size="lg"
          >
            Quay về menu
          </Button>
        </div>
      </div>
    </div>
  );
}
