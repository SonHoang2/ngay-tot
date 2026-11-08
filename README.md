# Ngày Tốt

Web chọn ngày tốt theo tuổi: đổi âm lịch Việt Nam, tính Can Chi, ngày Hoàng đạo, Thập nhị Trực, xung hợp tuổi, nạp âm, Kim Lâu, Hoang Ốc, Tam tai.
App chạy hoàn toàn trên trình duyệt (React + Vite), không cần server. Ngày sinh chỉ được lưu trong `localStorage` của máy người dùng.

## Chạy

```bash
npm install
npm run dev      # chạy local
npm test         # chạy test phần tính lịch
npm run build    # build ra dist/ (web tĩnh)
```

## Cấu trúc

| Thư mục / file | Nội dung |
|---|---|
| `src/lich/thienvan.ts` | Tầng 1: JDN, điểm Sóc, kinh độ Mặt Trời, 24 tiết khí |
| `src/lich/amlich.ts` | Tầng 1: đổi dương ⇄ âm (thuật toán Hồ Ngọc Đức) |
| `src/lich/canchi.ts` | Tầng 1: Can Chi năm/tháng/ngày/giờ, nạp âm, ngũ hành |
| `src/lich/ngay.ts` | Tầng 2: Hoàng đạo/Hắc đạo, giờ Hoàng đạo, Trực, Tam nương, Nguyệt kỵ |
| `src/lich/tuoi.ts` | Tầng 2: tuổi, xung/hợp/hình/hại/phá, Tam tai, Kim Lâu, Hoang Ốc |
| `src/lich/chamdiem.ts` | Tầng 3: chấm điểm và xếp hạng ngày |
| `src/lich/quytac/viec.json` | Tầng 3: điểm từng mục, trực hợp/kỵ của từng việc. Sửa ở đây, không cần sửa code |
| `src/components/` | Giao diện React |
| `src/i18n/` | Từ điển tiếng Việt (`vi.ts`) và tiếng Anh (`en.ts`). Thêm chữ mới thì thêm vào cả hai file |
| `src/giaoDien.ts` | Đổi giao diện sáng / tối / theo máy |

`src/lich/` là TypeScript thuần, không phụ thuộc React, nên dùng lại được cho server hoặc app điện thoại. Lý do chấm điểm trả về dạng mã + tham số (`LyDo`), giao diện tự dịch sang ngôn ngữ đang chọn.

## Quy ước đã chọn

Các trang lịch thường ra kết quả khác nhau vì chọn quy ước khác nhau. App này dùng:

1. **Múi giờ UTC+7** khi tính điểm Sóc và tiết khí. Ngày trước 1968 tính theo UTC+8, như lịch miền Bắc thời đó.
2. **Ngày đổi lúc 0h.** Giờ Tý (23h–1h) được ghi là một khung giờ, chưa tách thành giờ Tý đầu ngày và cuối ngày.
3. **Tháng theo tiết khí** cho Thập nhị Trực (luôn luôn) và cho ngày Hoàng đạo (mặc định). Ngày có thời điểm giao tiết được tính sang tháng mới. Trên giao diện có thể chuyển Hoàng đạo sang tính theo tháng âm lịch.
4. **Năm tiết khí đổi ở Lập Xuân** khi tính Can tháng. Năm tuổi, Kim Lâu, Hoang Ốc, Tam tai thì tính theo **năm âm lịch** (đổi lúc Tết).
5. **Loại ngày** nếu xung tuổi (lục xung), thiên khắc địa xung, Tam nương hoặc Nguyệt kỵ. Có thể tắt từng mục trong `viec.json`.
6. **Can xung** gồm Giáp–Canh, Ất–Tân, Bính–Nhâm, Đinh–Quý. Mậu và Kỷ không xung.
7. **Kim Lâu khi cưới hỏi** chỉ xét tuổi cô dâu (người dùng chọn giới tính Nữ). Khi động thổ thì xét Kim Lâu theo tuổi chủ nhà, không phân biệt giới tính.

Chưa làm: Nhị thập bát tú (28 sao) và các sao trong Ngọc Hạp Thông Thư.

## Kiểm tra

`src/lich/__tests__/lich.test.ts` so kết quả với các mốc đã biết:
- Can Chi ngày 1/1/2000.
- Tết 1968, 1985, 2007, 2026.
- Tháng nhuận năm 2023 và 2025.
- Đổi qua lại âm ⇄ dương trong giai đoạn 1990–2040.
- Ngày giao tiết khí, trực lặp lại ở ngày giao tiết.
- Bảng Hoàng đạo, Kim Lâu, Hoang Ốc.
- Kết quả chọn ngày mua vàng cho tuổi Quý Mùi từ 8/11 đến 31/12/2026.

> Kết quả chỉ để tham khảo theo phong tục, không phải lời khuyên tài chính hay đầu tư.
