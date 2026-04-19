import { memo } from 'react';
import { MenuItem } from '../types';
import { Button } from './Button';
import { Plus, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuCard = memo(function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-900">Hết hàng</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg mb-1 text-gray-900">{item.name}</h3>
        <p className="text-[#6D4C41] mb-3">
          {item.price.toLocaleString('vi-VN')}₫
        </p>
        
        <Button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
});
