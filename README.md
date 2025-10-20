# Ganapatih Frontend

Aplikasi frontend modern untuk platform Ganapatih, dibangun dengan teknologi terkini untuk performa dan pengalaman pengguna yang optimal.

## 🚀 Teknologi

Proyek ini menggunakan stack teknologi terbaru:

- **[Next.js 15.5.6](https://nextjs.org/)** - React Framework dengan App Router dan Turbopack
- **[React 19.1.0](https://react.dev/)** - Library UI terbaru dengan fitur React Compiler
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework generasi terbaru
- **[ESLint 9](https://eslint.org/)** - Code linting dan quality assurance

## 📋 Prasyarat

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js** versi 18.17 atau lebih tinggi
- **npm**, **yarn**, atau **pnpm** sebagai package manager

## 🛠️ Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd Ganapatih-FE
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Menjalankan Proyek

### Development Mode

Jalankan server development dengan hot-reload:

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

> **Note:** Proyek ini menggunakan Turbopack untuk build yang lebih cepat hingga 700% dibanding webpack!

### Build Production

Build aplikasi untuk production:

```bash
npm run build
```

### Menjalankan Production Build

Setelah build, jalankan aplikasi production:

```bash
npm run start
```

### Linting

Cek code quality dengan ESLint:

```bash
npm run lint
```

## 📁 Struktur Proyek

```
Ganapatih-FE/
├── src/
│   ├── app/                      # App Router (Next.js 15)
│   │   ├── auth/                 # Halaman autentikasi
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Halaman login
│   │   │   └── register/
│   │   │       └── page.tsx      # Halaman register
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard utama
│   │   ├── landing/
│   │   │   └── page.tsx          # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage (redirect ke login)
│   │   ├── globals.css           # Global styles
│   │   └── favicon.ico           # Favicon
│   ├── components/               # Reusable components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── feed-list.tsx
│   │   │   ├── follow-panel.tsx
│   │   │   └── post-form.tsx
│   │   ├── form/                 # Form components
│   │   │   ├── auth-card.tsx
│   │   │   └── auth-layout.tsx
│   │   └── ui/                   # UI primitives
│   │       ├── loading-skeleton.tsx
│   │       ├── spinner.tsx
│   │       └── toast.tsx
│   ├── context/                  # React Context providers
│   │   └── session-context.tsx   # Session management
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuth.ts            # Authentication hook
│   └── lib/                      # Utility libraries
│       └── api.ts                # API client utilities
├── public/                       # Static assets
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies dan scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🎯 Fitur Utama

### Autentikasi
- ✅ Login pengguna
- ✅ Registrasi pengguna baru
- ✅ Session management dengan Context API

### Dashboard
- ✅ Feed/timeline posting
- ✅ Form pembuatan post
- ✅ Panel following/followers
- ✅ Header dengan navigasi

### UI Components
- ✅ Loading skeletons untuk UX yang lebih baik
- ✅ Spinner untuk loading states
- ✅ Toast notifications
- ✅ Auth cards dan layouts

## 🎨 Styling

Proyek ini menggunakan **Tailwind CSS 4** dengan:
- ✨ Custom color scheme (dark mode optimized)
- 🎭 Custom scrollbar styling
- ⚡ Smooth transitions dan animations
- 🔍 Focus-visible styling untuk accessibility
- 📱 Responsive design

### Font
- **Geist Sans** - Font sans-serif modern
- **Geist Mono** - Font monospace untuk code

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env.local` di root project untuk menyimpan environment variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url_here

# Other configurations
# Add your environment variables here
```

> **Warning:** Jangan commit file `.env.local` ke repository!

## 🚦 Routing

Aplikasi ini menggunakan App Router Next.js dengan struktur:

- `/` - Homepage (redirect ke `/auth/login`)
- `/auth/login` - Halaman login
- `/auth/register` - Halaman registrasi
- `/dashboard` - Dashboard utama (protected route)
- `/landing` - Landing page

## 🔐 Authentication Flow

1. User mengakses aplikasi → redirect ke `/auth/login`
2. Login berhasil → session disimpan di context
3. Redirect ke `/dashboard`
4. Session dikelola melalui `SessionProvider`

## 📦 Custom Hooks

### `useAuth`
Hook untuk mengelola autentikasi pengguna dengan fitur:
- Login
- Logout
- Check authentication status
- Get current user data

## 🎯 Best Practices

Proyek ini mengikuti best practices:

- ✅ TypeScript untuk type safety
- ✅ Component-based architecture
- ✅ Separation of concerns (components, hooks, context, lib)
- ✅ ESLint untuk code quality
- ✅ Responsive dan accessible design
- ✅ Performance optimization dengan Turbopack

## 🐛 Troubleshooting

### Port sudah digunakan
Jika port 3000 sudah digunakan, Anda bisa menjalankan di port lain:
```bash
npm run dev -- -p 3001
```

### Error EPERM saat install (Windows)
Jika mengalami error permission di Windows:
```bash
# Hentikan semua proses Node.js
taskkill /F /IM node.exe

# Hapus node_modules dan install ulang
Remove-Item -Recurse -Force node_modules
npm install
```

### Error build atau compile
Pastikan menggunakan Node.js versi 18.17 atau lebih tinggi:
```bash
node --version
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 👥 Contributing

Untuk kontribusi pada proyek ini:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

[Tambahkan informasi lisensi di sini]

## 💬 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Built with ❤️ using Next.js 15 and React 19**
