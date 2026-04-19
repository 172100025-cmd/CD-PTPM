import { useNavigate } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../components/Button';
import { ArrowLeft, Download, Printer } from 'lucide-react';

export function QRCodesPage() {
  const navigate = useNavigate();
  const tables = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'));
  const adminQRUrl = `${window.location.origin}/admin`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (tableNumber: string) => {
    const canvas = document.createElement('canvas');
    const svg = document.getElementById(`qr-${tableNumber}`) as unknown as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `qr-table-${tableNumber}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#3E2723] text-white px-6 py-4 sticky top-0 z-10 shadow-md print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-[#4E342E] rounded-lg transition"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg">Mã QR các bàn</h1>
              <p className="text-sm text-[#D7CCC8]">Quản lý mã QR</p>
            </div>
          </div>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2 bg-white text-[#3E2723] hover:bg-gray-100"
          >
            <Printer className="w-5 h-5" />
            In tất cả
          </Button>
        </div>
      </header>

      {/* QR Codes Grid */}
      <div className="p-6">
        {/* Mobile Testing Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg text-blue-900 mb-2 flex items-center gap-2">
            📱 Test QR Code trên điện thoại
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Cách 1 - Ngrok (Khuyến nghị):</strong>
            </p>
            <pre className="bg-blue-100 rounded p-3 overflow-x-auto text-xs mb-2">
ngrok http 5173
            </pre>
            <p>
              <strong>Cách 2 - Local Network:</strong>
            </p>
            <pre className="bg-blue-100 rounded p-3 overflow-x-auto text-xs mb-2">
pnpm dev --host
# Truy cập: http://[your-local-ip]:5173
            </pre>
            <p className="text-xs text-blue-600 mt-2">
              ⚠️ QR code chỉ hoạt động với URL công khai (không phải localhost)
            </p>
          </div>
        </div>

        {/* Admin QR Code */}
        <div className="mb-8 bg-gradient-to-br from-[#3E2723] to-[#4E342E] rounded-2xl shadow-xl p-8 text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-2 text-center">🔐 Quản trị viên</h2>
            <p className="text-[#D7CCC8] text-sm mb-6 text-center">
              Quét QR này để vào trang quản lý trên điện thoại
            </p>

            <div className="flex justify-center mb-6 bg-white rounded-xl p-4">
              <QRCodeSVG
                id="qr-admin"
                value={adminQRUrl}
                size={250}
                level="M"
                includeMargin
              />
            </div>

            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-xs text-[#D7CCC8] mb-1">URL đăng nhập</p>
              <p className="text-sm font-mono break-all">{adminQRUrl}</p>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-200">
                <strong>Lưu ý:</strong> Đăng nhập với tài khoản <strong>admin</strong> / <strong>admin</strong>
              </p>
            </div>

            <Button
              onClick={() => handleDownload('admin')}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-white text-[#3E2723] hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
              Tải QR quản trị viên
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-900 mb-2">📱 QR Code các bàn</h2>
          <p className="text-gray-600">Khách hàng quét QR để đặt món tại bàn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map(tableNumber => (
            <div
              key={tableNumber}
              className="bg-white rounded-xl shadow-md p-6 text-center print:break-inside-avoid"
            >
              <h3 className="text-xl text-[#3E2723] mb-1">Bàn {tableNumber}</h3>
              <p className="text-sm text-gray-600 mb-4">Coffee House</p>

              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  id={`qr-${tableNumber}`}
                  value={`${window.location.origin}/menu?table=${tableNumber}`}
                  size={200}
                  level="M"
                  includeMargin
                />
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Quét để đặt món tại bàn {tableNumber}
              </p>

              <Button
                onClick={() => handleDownload(tableNumber)}
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 print:hidden"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
