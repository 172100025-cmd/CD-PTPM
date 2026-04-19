import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { DraggableRow } from '../../components/DraggableRow';
import { useMenu } from '../../contexts/MenuContext';
import { MenuItem } from '../../types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { menuItems, deleteMenuItem, toggleAvailability, reorderMenuItems, loading } = useMenu();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Sort menu items by order
  const sortedMenuItems = [...menuItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteMenuItem(itemToDelete);
        toast.success('Xóa món thành công!');
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa món.');
        console.error(error);
      }
    }
  };

  const handleToggle = async (id: string) => {
    await toggleAvailability(id);
  };

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = sortedMenuItems[dragIndex];
    const newItems = [...sortedMenuItems];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    reorderMenuItems(newItems);
  }, [sortedMenuItems, reorderMenuItems]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Quản lý Menu</h1>
          <p className="text-gray-600">Quản lý các món ăn và đồ uống</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/admin/dashboard/qr-codes')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Mã QR
          </Button>
          <Button
            onClick={() => navigate('/admin/dashboard/add-item')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm món mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#6D4C41]"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6">Chưa có món nào trong menu</p>
            <Button onClick={() => navigate('/admin/dashboard/add-item')}>
              <Plus className="w-5 h-5 mr-2" />
              Thêm món đầu tiên
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3E2723] text-white">
                <tr>
                  <th className="px-4 py-4 text-center w-12"></th>
                  <th className="px-6 py-4 text-left">Hình ảnh</th>
                  <th className="px-6 py-4 text-left">Tên món</th>
                  <th className="px-6 py-4 text-left">Danh mục</th>
                  <th className="px-6 py-4 text-left">Giá</th>
                  <th className="px-6 py-4 text-left">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedMenuItems.map((item, index) => (
                  <DraggableRow key={item.id} id={item.id} index={index} moveRow={moveRow}>
                    <td className="px-4 py-4 text-center touch-manipulation">
                      <GripVertical className="w-6 h-6 text-gray-400 md:w-5 md:h-5" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.category === 'Cà phê' ? 'Đồ uống' : item.category}
                    </td>
                    <td className="px-6 py-4 text-[#6D4C41]">
                      {item.price.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          item.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {item.available ? 'Còn hàng' : 'Hết hàng'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => navigate(`/admin/dashboard/edit-item/${item.id}`)}
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" />
                          Sửa
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(item.id)}
                          variant="danger"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </DraggableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Xác nhận xóa"
      >
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa món này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="outline"
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="danger"
            className="flex-1"
          >
            Xóa
          </Button>
        </div>
      </Modal>
      </div>
    </DndProvider>
  );
}
