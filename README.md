<div align="center">

# 🚀 GitHub Profil README AI

**AI destekli profesyonel GitHub profil README oluşturucu**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3-purple?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[✨ Özellikler](#-özellikler) • [🚀 Kurulum](#-kurulum) • [📖 Kullanım](#-kullanım) • [🛠️ Tech Stack](#️-tech-stack) • [📝 Lisans](#-lisans)

</div>

---

## ✨ Özellikler

### 🤖 AI Destekli Oluşturma
- **Groq AI (Llama 3.3 70B)** ile güçlü ve hızlı README oluşturma
- GitHub profil bilgilerinizden otomatik analiz ve içerik üretimi
- Profesyonel, kişisel ve görsel olarak çekici README'ler

### 🎨 Modern ve Kullanıcı Dostu Arayüz
- **Gradient tasarım** ve modern UI
- **Canlı önizleme** ile gerçek zamanlı markdown render
- **Responsive tasarım** - tüm cihazlarda mükemmel görünüm
- **Dark mode** desteği

### ⚡ Hızlı ve Verimli
- Saniyeler içinde profesyonel README oluşturma
- GitHub API ile otomatik profil analizi
- En popüler projelerinizi otomatik vurgulama
- Teknoloji stack'inizi otomatik algılama

### 📋 Kullanışlı Özellikler
- **Kopyala** butonu ile tek tıkla kopyalama
- **İndir** butonu ile README.md dosyası indirme
- **Düzenlenebilir** markdown editör
- **Canlı önizleme** ile anında görüntüleme

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** 18+ ([İndir](https://nodejs.org/))
- **npm** veya **yarn** paket yöneticisi
- **Groq API** anahtarı ([Ücretsiz alın](https://console.groq.com/keys))
- **GitHub Token** (opsiyonel, daha yüksek rate limit için)

### Adım Adım Kurulum

#### 1️⃣ Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/github-readme-generator.git
cd github-readme-generator
```

#### 2️⃣ Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

#### 3️⃣ Environment Variables Ayarlayın

`.env.local` dosyası oluşturun (veya `env.example` dosyasını kopyalayın):

```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# Groq API Key (Zorunlu)
GROQ_API_KEY=your_groq_api_key_here

# GitHub Token (Opsiyonel - daha yüksek rate limit için)
GITHUB_TOKEN=your_github_token_here
```

> 💡 **Groq API Key Nasıl Alınır?**
> 1. [Groq Console](https://console.groq.com/) adresine gidin
> 2. Hesap oluşturun veya giriş yapın
> 3. "API Keys" bölümünden yeni bir key oluşturun
> 4. Key'i `.env.local` dosyasına ekleyin

#### 4️⃣ Development Server'ı Başlatın

```bash
npm run dev
# veya
yarn dev
```

#### 5️⃣ Tarayıcıda Açın

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

---

## 📖 Kullanım

### Temel Kullanım

1. **GitHub Profil URL'sini Girin**
   - Tam URL: `github.com/username`
   - Veya sadece kullanıcı adı: `username`

2. **"Oluştur" Butonuna Tıklayın**
   - AI profilinizi analiz edecek
   - Birkaç saniye içinde README hazır olacak

3. **README'yi İnceleyin ve Düzenleyin**
   - Sol panelde markdown kaynağını düzenleyebilirsiniz
   - Sağ panelde canlı önizlemeyi görebilirsiniz

4. **Kopyalayın veya İndirin**
   - "Kopyala" butonu ile panoya kopyalayın
   - "İndir" butonu ile README.md dosyası indirin

5. **GitHub Profilinizde Kullanın**
   - GitHub'da `username/username` adında bir repository oluşturun
   - README.md dosyasını bu repository'ye yükleyin
   - Profil sayfanızın üst kısmında görünecektir

### Örnek Kullanım

```bash
# GitHub profil URL'si
github.com/octocat

# veya sadece kullanıcı adı
octocat
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework (App Router)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown renderer

### Backend & AI
- **[Groq AI](https://groq.com/)** - Llama 3.3 70B Versatile model
- **[GitHub REST API](https://docs.github.com/en/rest)** - Octokit client
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Server-side API

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes

---

## 📁 Proje Yapısı

```
github-readme-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                 # Main page
├── components/
│   └── ui/                      # UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── github.ts                # GitHub API client
│   └── utils.ts                 # Utility functions
├── .env.local                   # Environment variables (gitignore)
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind config
└── package.json                 # Dependencies
```

---

## 🎯 Özellikler Detayı

### AI Özellikleri
- ✅ Otomatik profil analizi
- ✅ Teknoloji stack algılama
- ✅ Popüler projeleri vurgulama
- ✅ Kişisel ve profesyonel ton
- ✅ Emoji ve badge desteği
- ✅ Türkçe ve İngilizce dil desteği

### UI/UX Özellikleri
- ✅ Modern gradient tasarım
- ✅ Temiz ve profesyonel arayüz
- ✅ Smooth transitions
- ✅ Responsive layout
- ✅ Dark mode desteği
- ✅ Loading states
- ✅ Error handling

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- [Groq](https://groq.com/) - Güçlü AI API'si için
- [Next.js](https://nextjs.org/) - Harika framework için
- [Shadcn](https://ui.shadcn.com/) - Güzel UI component'leri için
- [GitHub](https://github.com/) - API desteği için

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ using Next.js, Groq AI, and GitHub API

</div>
