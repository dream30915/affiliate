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

## บัญชีทดสอบ (Test Accounts)
- **Admin:** `admin@example.com` / `password123`
- **User:** สมัครใหม่ได้ที่หน้า Register
