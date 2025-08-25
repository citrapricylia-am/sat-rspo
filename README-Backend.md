# SAT RSPO PADI - Node.js Backend

Backend API untuk aplikasi SAT RSPO PADI menggunakan Node.js dengan MySQL database dan deployment di Vercel Serverless Functions.

## 🚀 Fitur

- ✅ ES Module (import/export) - kompatibel dengan Vercel Serverless
- ✅ MySQL database dengan mysql2/promise
- ✅ Password hashing menggunakan bcrypt
- ✅ CORS headers untuk frontend https://sat-rspo.vercel.app
- ✅ Error handling lengkap dengan JSON response
- ✅ TypeScript support
- ✅ Ready untuk deployment di Vercel

## 📋 Endpoint API

### POST /api/register
Mendaftarkan user baru ke database.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789",
  "address": "Jl. Contoh No. 123",
  "role": "Employee",
  "password": "securepassword"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Contoh No. 123",
    "role": "Employee"
  }
}
```

**Response Error (400/409/500):**
```json
{
  "error": "Email already registered"
}
```

### POST /api/login
Login user dengan email dan password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Contoh No. 123",
    "role": "Employee",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (400/401/500):**
```json
{
  "error": "Invalid email or password"
}
```

## 🗄️ Database Schema

Tabel `users` akan dibuat otomatis saat pertama kali endpoint dipanggil:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  role VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Setup Development

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
Buat file `.env.local` dengan konfigurasi database:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sat_rspo_padi
NODE_ENV=development
```

3. **Setup MySQL Database:**
- Pastikan MySQL server berjalan
- Buat database `sat_rspo_padi`
- Tabel akan dibuat otomatis saat endpoint pertama kali dipanggil

4. **Run development server:**
```bash
npm run dev
```

## 🚀 Deployment di Vercel

### 1. Persiapan Database
- Setup MySQL database di hosting provider (contoh: PlanetScale, Railway, atau hosting lainnya)
- Catat credential database: host, port, username, password, database name

### 2. Deploy ke Vercel

1. **Connect repository ke Vercel:**
   - Login ke [vercel.com](https://vercel.com)
   - Import project dari GitHub/GitLab
   - Pilih repository project ini

2. **Set Environment Variables di Vercel Dashboard:**
   - Masuk ke Project Settings > Environment Variables
   - Tambahkan variabel berikut:
   ```
   DB_HOST=your-mysql-host.com
   DB_PORT=3306
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=sat_rspo_padi
   NODE_ENV=production
   ```

3. **Deploy:**
   - Klik "Deploy" di Vercel dashboard
   - Tunggu proses deployment selesai
   - Endpoint akan tersedia di: `https://your-project.vercel.app/api/`

### 3. Test Endpoint

Test dengan curl atau Postman:

```bash
# Test Register
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "08123456789",
    "address": "Test Address",
    "role": "Employee",
    "password": "password123"
  }'

# Test Login
curl -X POST https://your-project.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Features

- **Password Hashing:** Menggunakan bcrypt dengan salt rounds 12
- **CORS Protection:** Hanya mengizinkan request dari https://sat-rspo.vercel.app
- **Input Validation:** Validasi email format dan required fields
- **SQL Injection Prevention:** Menggunakan prepared statements
- **Error Handling:** Error details hanya tampil di development mode

## 📁 File Structure

```
api/
├── lib/
│   └── db.ts          # Database configuration dan operations
├── login.ts           # Login endpoint
└── register.ts        # Register endpoint
.env.example           # Template environment variables
```

## 🛠️ Dependencies

### Production Dependencies
- `bcrypt`: Password hashing
- `mysql2`: MySQL database driver
- `cors`: CORS handling (sudah ada)

### Development Dependencies
- `@types/bcrypt`: TypeScript types untuk bcrypt
- `@vercel/node`: TypeScript types untuk Vercel

## 🐛 Troubleshooting

### Database Connection Error
```json
{
  "error": "Database connection failed"
}
```
**Solusi:**
- Periksa environment variables database
- Pastikan database server aktif dan dapat diakses
- Periksa firewall/security group settings

### Email Already Registered
```json
{
  "error": "Email already registered"
}
```
**Solusi:**
- Gunakan email yang berbeda
- Atau hapus user dari database jika testing

### CORS Error di Browser
**Solusi:**
- Pastikan frontend diakses dari https://sat-rspo.vercel.app
- Atau update CORS origin di kode jika menggunakan domain berbeda

## 📝 Notes

- Backend ini siap production dan dapat langsung di-copy ke folder `/api` untuk deployment Vercel
- Database tabel akan dibuat otomatis saat pertama kali endpoint dipanggil
- Password di-hash menggunakan bcrypt sebelum disimpan ke database
- Semua response dalam format JSON sesuai spesifikasi
- Error handling lengkap dengan status code yang sesuai