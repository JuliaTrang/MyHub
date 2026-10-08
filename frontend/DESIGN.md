# DESIGN.md — MyHub UI Design System
> Phân tích từ ảnh tham chiếu `idea.jpg`. Các mục có ghi **(giả định)** là suy luận từ phong cách chung, không thể hiện rõ trong ảnh.

---

## 1. Bố cục (Layout)

### Vùng theo chiều dọc (top → bottom)

| Thứ tự | Vùng | Mô tả |
|--------|------|--------|
| 1 | **Navbar / Header** | Thanh điều hướng nằm ngang, cao ~56px. Trái: icon avatar + nút `+`. Giữa: các liên kết nav (Home, Search, Message). Phải: nút Log In (outline) + Sign Up (filled). |
| 2 | **Hero Banner / Carousel** | Ảnh bìa lớn chiếm toàn bề rộng nội dung, cao ~280–320px. Có overlay text phía trên ảnh, và mũi tên điều hướng trái/phải hai bên. Tên chủ trang + bio hiện dưới ảnh theo dạng overlay mờ. |
| 3 | **Content Grid** | Lưới 4 cột không đều, phân chia thành các khu vực chức năng khác nhau (xem bên dưới). |
| 4 | **Footer** | Dòng nhỏ `( Made with Carrd )`, căn giữa, màu muted. |

### Lưới nội dung (Content Grid) — 4 cột

```
[ Social Media ] [ Recent Searches ] [ Photo Gallery ] [ Profile Card ]
     ~20%               ~25%               ~25%               ~30%
```

- **Cột 1 – Social Media Acc**: lưới 2×2 thẻ ảnh link mạng xã hội.
- **Cột 2 – Recent Searches**: danh sách các pill/chip tìm kiếm gần đây, có icon 🔍.
- **Cột 3 – Photo Gallery**: 2 ảnh xếp dọc.
- **Cột 4 – Profile Card**: thông tin cá nhân (tên, pronoun, MBTI, quốc tịch, likes, dislikes) kèm icon nhân vật hoạt hình.

### Độ rộng nội dung

- Container tổng: ~900–1000px, căn giữa.
- Nền ngoài container: màu xanh lá rất nhạt (sage/mint), tạo cảm giác "frame" nền.
- Toàn trang có padding ngoài ~16–24px hai bên.

---

## 2. Màu sắc (Color Palette)

| Vai trò | Tên gợi ý | Hex ước lượng |
|---------|-----------|---------------|
| **Background (trang)** | Sage Cream | `#E8EDE3` |
| **Background (card/surface)** | Warm White | `#F5F3EE` |
| **Background (search pill)** | Muted Sage | `#A8B99A` |
| **Primary Accent** | Forest Green | `#4A7C4E` |
| **Primary Accent (dark)** | Deep Moss | `#2F5C33` |
| **Text (heading)** | Dark Charcoal | `#2B2B2B` |
| **Text (body / bio)** | Warm Gray | `#5A5A5A` |
| **Text (muted / footer)** | Light Gray | `#9B9B9B` |
| **Text on accent (nút Sign Up)** | White | `#FFFFFF` |
| **Border / Divider** | Soft Sage Border | `#C5D1BC` |
| **Nút Log In (outline)** | Outline stroke | `#4A7C4E` + nền trong suốt |
| **Error (giả định)** | Muted Red | `#C0544A` |
| **Link hover (giả định)** | Moss hover | `#3A6B3E` |

> **Nhận xét**: Toàn bộ palette xoay quanh tone **sage green + cream**. Không có màu sắc sặc sỡ hay tương phản cao. Cảm giác dịu nhẹ, gần gũi thiên nhiên.

---

## 3. Chữ (Typography)

### Kiểu font

- **Navbar links & Headings** (`SOCIAL MEDIA ACC`, `RECENT SEARCHES`, `LEENA`...): **Sans-serif, không chân**, đậm vừa đến đậm (weight 600–700). Trông gần với **Nunito**, **Poppins**, hoặc **DM Sans**.
- **Hero title** (`welcome to my love maze`): Sans-serif, weight nhẹ–vừa (400–500), cỡ lớn (~32–40px), toàn chữ thường (lowercase), có thể dùng thêm **Indie Flower** hoặc **Caveat** nếu muốn nét chữ viết tay — **(giả định nếu dùng font đặc biệt)**.
- **Bio text** (tên người, caption): Sans-serif nhỏ, weight regular (400).
- **Search pill text**: Sans-serif, đậm vừa (500–600), màu trắng trên nền xanh.

### Thang cỡ chữ (Type Scale)

| Tên | Cỡ ước lượng | Dùng ở đâu |
|-----|-------------|------------|
| `--text-xs` | 10px | Footer, caption ảnh |
| `--text-sm` | 12px | Bio, meta info (pronoun, MBTI) |
| `--text-base` | 14px | Nội dung card, nav link |
| `--text-md` | 16px | Section heading (SOCIAL MEDIA...) |
| `--text-lg` | 20–22px | Tên người (LELE / NANA, LEENA) |
| `--text-hero` | 32–40px | Hero title |

---

## 4. Khoảng cách, Bo góc, Viền, Bóng

### Khoảng cách (Spacing — bội số 4/8px)

| Token | Giá trị | Dùng ở đâu |
|-------|---------|------------|
| `--space-1` | 4px | Padding nội tuyến nhỏ |
| `--space-2` | 8px | Gap giữa các icon nhỏ, padding pill |
| `--space-3` | 12px | Padding card nội dung |
| `--space-4` | 16px | Gap cột, padding section |
| `--space-6` | 24px | Margin giữa các vùng lớn |
| `--space-8` | 32px | Margin trên/dưới hero |

### Bo góc (Border Radius)

| Thành phần | Radius ước lượng |
|-----------|-----------------|
| Navbar tổng thể | `0px` (phẳng) |
| Card (social, profile) | `12–16px` |
| Search pill | `999px` (pill tròn hoàn toàn) |
| Nút Log In / Sign Up | `999px` (pill) |
| Ảnh trong gallery/social | `8–12px` |
| Avatar icon navbar | `8px` |

### Viền (Border)

- Card: `1px solid #C5D1BC` — viền rất nhẹ.
- Nút Log In: `1.5–2px solid #4A7C4E`.
- Search pill: không viền (nền đặc màu thay viền).
- **(Giả định)** Input field khi focus: `2px solid #4A7C4E`.

### Bóng (Shadow)

- Card bóng rất nhẹ: `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` — **(giả định, ảnh không thể hiện rõ)**.
- Hero banner: không bóng, fullwidth.
- Nút Sign Up: **(giả định)** `0 2px 6px rgba(74,124,78,0.3)`.

---

## 5. Thành phần UI (Components)

### Nút (Buttons)

| Variant | Nền | Chữ | Bo góc | Ví dụ |
|---------|-----|-----|--------|-------|
| **Primary (filled)** | `#4A7C4E` | `#FFFFFF` | `999px` | Sign Up |
| **Secondary (outline)** | Trong suốt | `#4A7C4E` | `999px` | Log In |
| **Hover Primary (giả định)** | `#2F5C33` | `#FFFFFF` | `999px` | — |
| **Hover Secondary (giả định)** | `#E8EDE3` | `#2F5C33` | `999px` | — |
| **Disabled (giả định)** | `#C5D1BC` | `#9B9B9B` | `999px` | — |

Padding ước lượng: `8px 20px`.

---

### Ô tìm kiếm / Search Pill

- Nền: `#A8B99A` (muted sage).
- Chữ: `#FFFFFF`, bold.
- Icon 🔍 bên trái, chữ căn giữa/trái.
- Bo góc: `999px`.
- Padding: `8px 16px`.
- Width: ~100% cột.
- **(Giả định)** Hover: nền đậm hơn `#8DA882`, con trỏ pointer.

---

### Thẻ mạng xã hội (Social Card)

- Ảnh thumbnail hình vuông/chữ nhật bo góc `8px`.
- Label overlay phía dưới ảnh: chữ nhỏ, màu trắng, nền tối mờ (gradient đen nhẹ từ dưới lên).
- Hover **(giả định)**: scale nhẹ `transform: scale(1.03)`, transition 200ms.

---

### Thẻ Profile (Profile Card)

- Nền: `#F5F3EE` (warm white) hoặc `#E8EDE3`.
- Bo góc: `12px`.
- Icon nhân vật (avatar hoạt hình) bên trái, text bên phải.
- Phân cấp rõ ràng: **Tên (bold lớn)** → meta nhỏ (pronoun, tuổi, quốc tịch).
- Có thể có divider hoặc spacing giữa các mục (LEENA / LIKES / DISLIKES).

---

### Bảng / Danh sách

- Không thấy bảng dữ liệu truyền thống trong ảnh.
- Danh sách Recent Searches là dạng **stack pill** dọc, gap `8px`.
- **(Giả định)** Nếu cần bảng: dùng border `1px solid #C5D1BC`, nền dòng xen kẽ `#F5F3EE` / `#FFFFFF`, không có bóng nặng.

---

### Carousel / Hero

- Mũi tên `<` `>` hai bên, màu `#4A7C4E`, nền tròn mờ.
- Ảnh lấp đầy toàn bề rộng container.
- Overlay text: chữ trắng, `text-shadow` nhẹ để dễ đọc.
- Dots indicator **(giả định)**: nhỏ, màu trắng/xanh mờ phía dưới hero.

---

## 6. Cảm giác chung

**3 từ mô tả**: `Dịu dàng · Tự nhiên · Cá nhân`

*(Soft · Organic · Personal)*

---

## 7. Ba thứ nên tránh để không lệch phong cách

| # | Nên tránh | Lý do |
|---|-----------|-------|
| 1 | **Màu sắc tương phản cao / sặc sỡ** (đỏ chói, xanh dương đậm, cam điện) | Phá vỡ tone sage cream hiền lành, biến trang thành mạng xã hội thương mại |
| 2 | **Font chữ có chân (serif) hoặc monospace** | Tạo cảm giác học thuật / kỹ thuật, không khớp với aesthetic cá nhân ấm áp |
| 3 | **Shadow nặng, border dày, góc vuông cứng** | Giao diện trở nên cứng nhắc, "doanh nghiệp", mất đi sự mềm mại hand-crafted |

---

## 8. Ghi chú — Giả định

| Yếu tố | Lý do giả định |
|--------|---------------|
| Hover state tất cả nút & card | Ảnh tĩnh, không thể hiện |
| Trạng thái lỗi (error, validation) | Không có form input trong ảnh |
| Responsive / màn nhỏ (mobile) | Ảnh chỉ hiển thị desktop layout |
| Dark mode | Không có dấu hiệu hỗ trợ dark mode |
| Animation / transition timing | Không thể đánh giá từ ảnh tĩnh |
| Focus state (accessibility) | Không rõ, nên dùng `outline: 2px solid #4A7C4E` |
| Scrollbar style | Không hiện trong ảnh — **(giả định)** custom scrollbar màu sage |

---

*Tài liệu này là cơ sở cho việc xây dựng design token và component library của MyHub.*
