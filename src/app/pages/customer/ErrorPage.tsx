import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorPage() {
  const navigate = useNavigate();
  const tableNumber = localStorage.getItem('tableNumber') || '01';

  const handleRetry = () => {
    // In a real app, this would retry the failed operation
    navigate(`/menu?table=${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
        
        <h1 className="text-2xl text-gray-900 mb-2">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-6">
          Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.
        </p>

        <div className="bg-[#FFF3CD] border border-[#FFECB5] rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-[#664D03]">
            <strong>Lưu ý:</strong> Giỏ hàng của bạn vẫn được lưu trữ và sẽ không bị mất dữ liệu.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Thử lại
          </Button>
          
          <Button
            onClick={() => navigate(`/menu?table=${tableNumber}`)}
            variant="outline"
            className="w-full"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
