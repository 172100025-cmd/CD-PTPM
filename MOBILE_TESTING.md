# 📱 Hướng dẫn test QR Code trên điện thoại

## 🎯 Mục đích
Test tính năng quét QR code để:
- **Khách hàng**: Đặt món tại bàn
- **Quản trị viên**: Quản lý menu trên mobile

---

## 🚀 Cách 1: Sử dụng ngrok (Khuyến nghị)

### Bước 1: Cài đặt ngrok
```bash
# Tải ngrok từ: https://ngrok.com/download
# Hoặc cài qua npm
npm install -g ngrok
```

### Bước 2: Chạy dev server
```bash
pnpm dev
# Server chạy tại http://localhost:5173
```

### Bước 3: Tạo tunnel công khai
```bash
# Mở terminal mới
ngrok http 5173
```

Bạn sẽ nhận được URL công khai như:
```
https://xxxx-yyyy-zzzz.ngrok-free.app
```

### Bước 4: Test trên điện thoại
1. Mở trang admin QR codes: `https://xxxx.ngrok-free.app/admin/dashboard/qr-codes`
2. Đăng nhập: `admin` / `admin`
3. Quét QR code bằng camera điện thoại

---

## 🔧 Cách 2: Sử dụng Local Network IP

### Bước 1: Tìm IP local của máy tính

**Windows:**
```bash
ipconfig
# Tìm IPv4 Address (ví dụ: 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Hoặc
ip addr show
```

### Bước 2: Chạy dev server với host
```bash
pnpm dev --host
# Server sẽ chạy tại http://0.0.0.0:5173
```

### Bước 3: Truy cập từ điện thoại
- Đảm bảo điện thoại và máy tính cùng WiFi
- Truy cập: `http://192.168.1.100:5173` (thay IP của bạn)

⚠️ **Lưu ý:** QR code vẫn trỏ đến `localhost`, cần sửa thủ công hoặc dùng ngrok

---

## 🌐 Cách 3: Deploy lên hosting

### Deploy lên Vercel (Miễn phí)
```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy lên Netlify
```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy
```

Sau khi deploy, bạn sẽ có URL công khai như:
- `https://your-app.vercel.app`
- `https://your-app.netlify.app`

---

## 📋 Test Checklist

### ✅ Khách hàng (Customer Flow)
- [ ] Quét QR bàn 01 → Mở menu với "Bàn 01"
- [ ] Số bàn hiển thị đúng và KHÔNG thể thay đổi (chỉ đọc)
- [ ] Thêm món vào giỏ
- [ ] Xem giỏ hàng → Tổng tiền chính xác
- [ ] Đặt món → Hiển thị "Đặt món thành công"
- [ ] Xem trạng thái đơn → Progress bar cập nhật
- [ ] Quay về menu → Giữ nguyên số bàn đã quét
- [ ] UI responsive tốt trên mobile
- [ ] Touch-friendly (buttons đủ lớn)

### ✅ Quản trị viên (Admin Flow)
- [ ] Quét QR admin → Mở trang login
- [ ] Đăng nhập `admin`/`admin`
- [ ] Xem danh sách món
- [ ] Thêm món mới
- [ ] Sửa món
- [ ] Xóa món (có confirm)
- [ ] Toggle trạng thái còn/hết hàng
- [ ] Kéo thả sắp xếp món
- [ ] UI responsive tốt trên mobile

---

## 🎨 Mobile UI Optimizations

Ứng dụng đã được tối ưu cho mobile:

### Layout
- ✅ Responsive design (Tailwind breakpoints)
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Sticky headers
- ✅ Bottom navigation/actions

### Performance
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimistic updates
- ✅ Real-time sync

### UX
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Pull to refresh (real-time)

---

## 🐛 Troubleshooting

### QR code không quét được
- Đảm bảo URL công khai (không phải localhost)
- Kiểm tra camera có quyền truy cập
- Thử app quét QR khác nếu camera mặc định không hoạt động

### Điện thoại không kết nối được
- Kiểm tra cùng WiFi (nếu dùng local IP)
- Tắt firewall tạm thời
- Dùng ngrok nếu local IP không hoạt động

### UI bị vỡ trên mobile
- Xóa cache browser
- Thử chế độ ẩn danh
- Check responsive trong DevTools trước

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Console log (F12 → Console)
2. Network tab (kiểm tra API calls)
3. Application → Local Storage (xem table number)

---

## 🎉 Kết quả mong đợi

Sau khi test thành công:
- **Khách**: Quét QR → Đặt món → Nhận thông báo thành công trong 30 giây
- **Admin**: Quét QR → Đăng nhập → Quản lý menu mượt mà như desktop
- **Real-time**: Thay đổi từ admin hiển thị ngay trên app khách hàng
