import { CartItem } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-gray-900">{item.name}</h4>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-700 p-1"
            aria-label="Xóa món"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-[#6D4C41]">
            {item.price.toLocaleString('vi-VN')}₫
          </p>
          
          <div className="flex items-center gap-3 bg-[#FAF8F5] rounded-lg px-2 py-1">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="text-[#6D4C41] hover:text-[#3E2723] p-1"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center text-gray-900">{item.quantity}</span>
            
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="text-[#6D4C41] hover:text-[#3E2723] p-1"
              aria-label="Tăng số lượng"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
