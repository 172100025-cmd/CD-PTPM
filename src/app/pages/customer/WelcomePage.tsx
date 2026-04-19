import { useNavigate, useSearchParams } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../components/Button';
import { Coffee, Sparkles } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '01';

  const handleViewMenu = () => {
    navigate(`/menu?table=${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3E2723] via-[#4E342E] to-[#3E2723] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Coffee Icon with Animation */}
        <div className="text-center mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#D7CCC8] rounded-full mb-4 shadow-xl">
            <Coffee className="w-12 h-12 text-[#3E2723]" />
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#6D4C41]" />
            <h1 className="text-3xl text-[#3E2723]">Chào mừng!</h1>
            <Sparkles className="w-5 h-5 text-[#6D4C41]" />
          </div>

          <p className="text-lg text-gray-600 mb-2">Coffee House</p>
          <p className="text-sm text-gray-500 mb-8">Bàn số {tableNumber}</p>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-inner">
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={`${window.location.origin}/menu?table=${tableNumber}`}
                size={200}
                level="M"
                includeMargin
              />
              <p className="text-sm text-gray-600 mt-3">Quét mã QR để bắt đầu</p>
            </div>
          </div>

          <Button
            onClick={handleViewMenu}
            className="w-full mb-4"
            size="lg"
          >
            <Coffee className="w-5 h-5 mr-2" />
            Xem thực đơn
          </Button>

          <p className="text-xs text-gray-500">
            Hoặc nhấn nút phía trên để xem menu
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-[#D7CCC8]">
            Trải nghiệm đặt món nhanh chóng & tiện lợi
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-[#8D6E63] hover:text-[#D7CCC8] transition opacity-60 hover:opacity-100"
          >
            Quản trị viên
          </button>
        </div>
      </div>
    </div>
  );
}
