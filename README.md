# Portfolio Dev

Portfolio Dev adalah website portfolio interaktif berbasis React + Vite untuk menampilkan profil, project case study, experience, tech stack, GitHub stats, dan terminal chat AI.

## Gambaran Singkat

Alur utamanya dibuat sederhana: pengunjung masuk ke halaman utama, membaca profil, melihat project dan detailnya, mengecek experience serta tech stack, lalu bisa mencoba terminal chat untuk navigasi cepat atau membaca konteks project tertentu.

Fitur utamanya:

- Animasi modern dengan GSAP + ScrollTrigger.
- Smooth scrolling dengan Lenis.
- Project gallery dengan detail berbasis route/modal.
- Chat widget gaya terminal dengan command lokal seperti `help`, `ls`, dan `cat <slug>`.
- Section registry terpusat supaya navigasi dan chat tetap konsisten.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis
- React Router

## Prasyarat

- Node.js 22 atau lebih baru
- npm 10 atau lebih baru

## Mulai Dari Nol

### 1. Clone repository

```bash
git clone https://github.com/fernanda894/Portfolio-dev.git
cd Portfolio-dev
```

### 2. Install dependency

```bash
npm install
```

### 3. Tambahkan environment variable untuk AI chat

Buat file `.env` di root project, lalu isi salah satu variabel berikut:

```env
VITE_CEREBRAS_API_KEY=your_key_here
```

Kalau kamu masih memakai format lama, repo ini juga tetap membaca:

```env
REACT_APP_CEREBRAS_API_KEY=your_key_here
```

Catatan:

- Kalau tidak ada API key, command lokal tetap jalan normal.
- AI response hanya aktif kalau salah satu key di atas tersedia.

### 4. Jalankan development server

```bash
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

### 5. Build production

```bash
npm run build
```

Hasil build akan masuk ke folder `build/`.

### 6. Preview hasil build

```bash
npm run preview
```

### 7. Cek sebelum deploy

```bash
npm run check
```

Perintah ini menjalankan build production lalu audit dependency production.

## Script Yang Tersedia

- `npm run dev` untuk menjalankan development server.
- `npm run start` sama seperti `npm run dev`.
- `npm run build` untuk menghasilkan production build.
- `npm run preview` untuk preview hasil build lokal.
- `npm run check` untuk build + audit dependency.

## Struktur Project

```text
.
├── index.html
├── public/
├── src/
│   ├── components/
│   ├── components/projects/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── projectDetails/
│   ├── services/
│   └── utils/
├── tailwind.config.js
├── vite.config.js
└── build/
```

## Cara Kerja Konten

Kalau kamu ingin mengubah isi portfolio tanpa mengutak-atik layout besar, fokus ke file berikut:

- Profile, experience, tech stack, projects, achievements, dan capabilities: `src/data/portfolioData.js`
- Metadata kartu project di gallery: `src/data/projectMeta.js`
- Konten detail project yang dipakai chat `cat <slug>`: `src/data/projectDetailsData.js`
- Daftar section yang bisa di-scroll lewat chat dan navbar: `src/data/sectionRegistry.js`
- Detail route custom per project: `src/projectDetails/projectRegistry.js`

### Menambah project baru

1. Tambahkan metadata project di `src/data/projectMeta.js`.
2. Tambahkan data detail dengan `slug` yang sama di `src/data/projectDetailsData.js`.
3. Jika butuh tampilan detail custom, buat komponen baru di `src/projectDetails/`.
4. Daftarkan komponen tersebut di `src/projectDetails/projectRegistry.js`.

### Menambah section baru

1. Tambahkan section ke `src/data/sectionRegistry.js`.
2. Pastikan komponen memiliki `elementId` yang cocok.
3. Chat widget dan intent router akan ikut membaca section baru itu.

## Chat Widget

Chat widget punya dua mode:

- Command lokal selalu aktif.
- AI response aktif jika API key Cerebras tersedia.

Command yang didukung:

- `help`
- `ls`
- `cat <slug>`
- `history`
- `clear`

Kalau kamu ingin menyesuaikan perilaku AI atau konteks section, cek `src/services/cerebras.js`, `src/services/aiContext.js`, dan `src/data/sectionRegistry.js`.

## Asset Penting

- Foto about: `public/profilee.webp`
- Foto preload hero: `public/profile.webp`
- Gambar OG/Twitter: `public/og-icon.png`
- Galeri hackathon: `public/hackathon-base/`
- CV: `public/cv.pdf`

## Deploy

Deploy hasil folder `build/` ke hosting statis seperti Netlify, Vercel, atau Cloudflare Pages.

Karena ini SPA, pastikan rewrite/fallback route diarahkan ke `index.html` supaya route seperti detail project tetap aman saat dibuka langsung.

## Troubleshooting

- AI tidak merespons: cek `.env`, pastikan API key terisi, lalu restart dev server.
- Command chat jalan tapi AI gagal: biasanya karena key, limit, atau koneksi jaringan.
- Build tidak muncul di folder yang diharapkan: hasilnya ada di `build/`, bukan `dist/`.
- CV tidak sesuai: ganti file `public/cv.pdf`.
- GitHub stats kosong: kemungkinan kena rate limit API publik.

## License

Repository ini belum menyertakan lisensi open-source.
