import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { useMenu } from '../../contexts/MenuContext';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

export function EditItemPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { menuItems, updateMenuItem } = useMenu();

  const item = menuItems.find(i => i.id === itemId);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Đồ uống',
    available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        image: item.image,
        category: item.category || 'Đồ uống',
        available: item.available,
      });
    }
  }, [item]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image || !formData.category || !itemId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await updateMenuItem(itemId, {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        available: formData.available,
      });

      toast.success('Cập nhật món thành công!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật món. Vui lòng thử lại.');
      console.error(error);
    }
  };

  if (!item) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Không tìm thấy món</p>
        <Button onClick={() => navigate('/admin/dashboard')}>Quay lại</Button>
      </div>
    );
  }

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
          <h1 className="text-3xl text-gray-900">Chỉnh sửa món</h1>
          <p className="text-gray-600">Cập nhật thông tin món ăn/đồ uống</p>
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
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
