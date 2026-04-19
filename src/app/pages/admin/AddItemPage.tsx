import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useMenu } from '../../contexts/MenuContext';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

export function AddItemPage() {
  const navigate = useNavigate();
  const { addMenuItem } = useMenu();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Đồ uống',
    available: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await addMenuItem({
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        available: formData.available,
      });

      toast.success('Thêm món thành công!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm món. Vui lòng thử lại.');
      console.error(error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl text-gray-900">Thêm món mới</h1>
          <p className="text-gray-600">Nhập thông tin món ăn/đồ uống</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-900 mb-2">
              Tên món <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent"
              placeholder="Nhập tên món"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 mb-2">
              Danh mục <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent bg-white"
              required
            >
              <option value="Đồ uống">Đồ uống</option>
              <option value="Bánh ngọt">Bánh ngọt</option>
              <option value="Đồ ăn">Đồ ăn</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-900 mb-2">
              Giá (VNĐ) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent"
              placeholder="Nhập giá"
              min="0"
              step="1000"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 mb-2">
              URL hình ảnh <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 text-[#6D4C41] border-gray-300 rounded focus:ring-[#6D4C41]"
            />
            <label htmlFor="available" className="text-gray-900 cursor-pointer">
              Còn hàng
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              variant="outline"
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Lưu món
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
