# Affiliate Platform

ระบบ Affiliate Marketing ที่พัฒนาด้วย Next.js, Prisma, และ SQLite

## วิธีใช้งาน (How to enable)

1.  **ติดตั้งโปรแกรมเสริม (Install dependencies):**
    ```bash
    npm install
    ```

2.  **สร้างฐานข้อมูลในเครื่อง (Setup database):**
    ```bash
    npx prisma db push
    # หากต้องการข้อมูลตัวอย่างให้รัน: npx prisma db seed
    ```

3.  **รันโปรแกรม (Start server):**
    ```bash
    npm run dev
    ```
    เปิดหน้าเว็บที่ [http://localhost:3000](http://localhost:3000)

## การเข้าใช้งาน (Access Info)
- **หน้าหลัก (Storefront):** [http://localhost:3000](http://localhost:3000)
- **แดชบอร์ด (Affiliate Dashboard):** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (จะเปลี่ยนเส้นทางไปหน้า Login หากยังไม่ได้เข้าสู่ระบบ)
- **ระบบหลังบ้าน (Admin Dashboard):** [http://localhost:3000/admin](http://localhost:3000/admin) (ต้องเข้าสู่ระบบด้วยบัญชี Admin)
- **หน้าเข้าสู่ระบบ (Login):** [http://localhost:3000/login](http://localhost:3000/login)

## บัญชีทดสอบ (Test Accounts)
- **Admin:** `admin@example.com` / `password123`
- **User:** สมัครใหม่ได้ที่หน้า Register หรือใช้ `user@example.com` / `password123` (หากมีข้อมูล Seed)
