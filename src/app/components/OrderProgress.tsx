import { OrderStatus } from '../types';
import { Check } from 'lucide-react';

interface OrderProgressProps {
  currentStatus: OrderStatus;
}

const statusSteps: { key: OrderStatus; label: string }[] = [
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'preparing', label: 'Đang chuẩn bị' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'served', label: 'Đã phục vụ' },
];

export function OrderProgress({ currentStatus }: OrderProgressProps) {
  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus);

  return (
    <div className="py-6">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-[#6D4C41] transition-all duration-500"
            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#6D4C41] border-[#6D4C41]'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isCompleted && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    isCurrent ? 'text-[#6D4C41]' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
