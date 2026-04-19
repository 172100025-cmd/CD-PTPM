import { useNavigate, useParams } from 'react-router';
import { useOrder } from '../../contexts/OrderContext';
import { Button } from '../../components/Button';
import { CheckCircle2 } from 'lucide-react';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders } = useOrder();
  const order = orderId ? orders.find(o => o.id === orderId) : undefined;
  const tableNumber = order?.tableNumber || localStorage.getItem('tableNumber') || '01';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl text-gray-900 mb-2">Đặt món thành công!</h1>
          <p className="text-gray-600">Đơn hàng của bạn đã được ghi nhận</p>
        </div>

        <div className="bg-[#FAF8F5] rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
          <p className="text-xl text-[#6D4C41] font-mono">{orderId}</p>
        </div>

        <div className="bg-[#FAF8F5] rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Bàn số</p>
          <p className="text-xl text-gray-900">{tableNumber}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/order-status/${orderId}`)}
            className="w-full"
          >
            Theo dõi đơn hàng
          </Button>
          
          <Button
            onClick={() => navigate(`/menu?table=${tableNumber}`)}
            variant="outline"
            className="w-full"
          >
            Quay về menu
          </Button>
        </div>
      </div>
    </div>
  );
}
