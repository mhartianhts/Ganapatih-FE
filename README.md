# Ganapatih-FE

Aplikasi Frontend Ganapatih menggunakan Next.js 14 dengan TypeScript dan Tailwind CSS.

## Teknologi

- **Next.js 14** - React Framework dengan App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Build untuk Production

```bash
npm run build
```

### Menjalankan Production Build

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Struktur Folder

```
Ganapatih-FE/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Homepage
│       └── globals.css     # Global styles
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Pengembangan

Proyek ini menggunakan App Router dari Next.js 14. Semua halaman dan komponen berada di folder `src/app/`.

Untuk membuat halaman baru, buat folder baru di `src/app/` dengan file `page.tsx`.

## Learn More

- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Dokumentasi Tailwind CSS](https://tailwindcss.com/docs)
- [Dokumentasi TypeScript](https://www.typescriptlang.org/docs)
