import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { fetchUserProfile } from "@/lib/github";

// Lazy initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Groq API key is not configured. Please set GROQ_API_KEY or OPENAI_API_KEY in .env.local"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { profileUrl } = await request.json();

    if (!profileUrl) {
      return NextResponse.json(
        { error: "GitHub profile URL is required" },
        { status: 400 }
      );
    }

    // Initialize Groq client
    const groq = getGroqClient();

    // Fetch user profile data
    const userData = await fetchUserProfile(profileUrl);

    if (!userData) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 404 }
      );
    }

    // Build context for AI
    const { profile, repositories, topLanguages } = userData;

    const reposInfo = repositories.slice(0, 8).map((repo, index) =>
      `${index + 1}. ${repo.name} - ${repo.description || "No description"} (⭐ ${repo.stargazers_count}, 🍴 ${repo.forks_count}) ${repo.language ? `[${repo.language}]` : ""}`
    ).join("\n");

    const context = `
GitHub Profile Information:
- Username: @${profile.login}
- GitHub Username (for URLs): ${profile.login}
- Full Name: ${profile.name || "Not provided"}
- Bio: ${profile.bio || "No bio available"}
- Location: ${profile.location || "Not specified"}
- Company: ${profile.company || "Not specified"}
- Website/Blog: ${profile.blog || "Not provided"}
- Twitter: ${profile.twitter_username ? `@${profile.twitter_username}` : "Not provided"}
- GitHub Member Since: ${new Date(profile.created_at).getFullYear()}
- Public Repositories: ${profile.public_repos}
- Followers: ${profile.followers}
- Following: ${profile.following}

Top Programming Languages: ${topLanguages.join(", ")}

Top Repositories:
${reposInfo}
`.trim();

    // Generate profile README using Groq AI
    const systemPrompt = `You are an expert GitHub profile coach and technical writer specializing in creating **professional and polished** GitHub profile README files.

You write **personal, polished, modern GitHub profile README.md files** that introduce the developer in a clear, attractive, and engaging way.

You will receive structured information about a GitHub user (bio, location, followers, repositories, top languages, etc.).
Using ONLY this information, create a **personal profile README** (NOT a project README) with **clean, professional content**.

### Goals
- Present the person as a **professional developer**
- Highlight their **skills, interests and strengths**
- Show their **tech stack and activity** in a clear and organized way
- Make it easy for others to understand **who they are** and **what they do**
- Use **clean, professional formatting** to make the README stand out

### Required sections (in order)
1. **Hero / Selamlama Bölümü**
   - Büyük bir başlık ile kendini tanıt ("Hi, I'm ..." veya Türkçe karşılığı)
   - **ÖNEMLİ:** İsim formatı profesyonel olmalı - Context'teki Full Name'i kullan, eğer yoksa Username'i Title Case'e çevir (örn: "onur eren ejder" -> "Onur Eren Ejder")
   - Kısa, kişisel bir giriş cümlesi (developer olarak kim, ne yapıyor)

2. **Hakkımda (About Me)**
   - 3–6 madde halinde kendini anlat:
     - Uzmanlık alanları
     - İlgi duyduğu teknolojiler / alanlar
     - Nerede yaşadığı veya uzaktan çalıştığı (varsa)
     - Açık kaynak / topluluk ilgisi (varsa)

3. **Tech Stack / Diller & Araçlar**
   - Kullanıcının **topLanguages** ve repository bilgilerine göre bir tech stack bölümü oluştur
   - **MUTLAKA shields.io badge formatında badge'ler kullan:**
     ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
     ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
     ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
   - **ÖNEMLİ:** Context'teki Top Programming Languages listesindeki TÜM dilleri badge olarak ekle - hiçbirini atlama
   - Frontend / Backend / Data Science / Tools gibi mantıklı alt gruplar oluştur
   - Her dil için doğru badge kullan (shields.io'da mevcut olanlar)
   - Tech stack badge'lerini düzenli bir şekilde göster

4. **Öne Çıkan Projeler (Featured Projects)**
   - Verilen repository listesinden 3–5 tanesini seç
   - Her biri için:
     - Repo adı (link ile)
     - 1–2 satırlık açıklama
     - Yıldız ve fork sayısını badge veya emoji ile göster (⭐, 🍴)

5. **GitHub İstatistikleri (GitHub Stats)**
   - GitHub profil bilgilerini metin olarak göster:
     - Public Repositories sayısı
     - Followers ve Following sayıları
     - GitHub'da aktif olduğu yıl (Member Since)
     - Top Programming Languages listesi
   - İstatistikleri liste veya tablo formatında sun

6. **İletişim & Sosyal Linkler (Connect With Me)**
   - GitHub, website/blog, Twitter/X gibi bilgileri kullan
   - **Badge formatında linkler kullan:**
     [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${profile.login})
     [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${profile.twitter_username || 'username'})

7. **Şu An Ne Üzerinde Çalışıyorum? (Current Focus)**
   - Top diller ve repo açıklamalarından yola çıkarak,
     şu anda neler üzerine odaklandığına dair 2–4 maddelik bir bölüm yaz


### Stil Kuralları
- **DAİMA birinci tekil şahısla yaz (ben dili: \"Ben\", \"yapıyorum\", \"öğreniyorum\")**
- Ton: profesyonel, pozitif, samimi ve özgüvenli
- Emojileri kullan ama abartma (her başlıkta en fazla 1 emoji)
- Markdown başlık hiyerarşisine dikkat et (H1, H2, H3, listeler, code block'lar)
- **HTML tag'leri KULLANMA - sadece saf Markdown kullan (div, img, vb. hiçbir HTML tag'i)**
- **Tüm görseller için Markdown image syntax kullan: ![alt text](url) - HTML img tag'leri çalışmaz**
- Gereksiz derecede uzun yazma; net, dolu ve okunabilir olsun

### Dil
- Kullanıcının adı, bio'su veya lokasyonu Türkçe ise README'yi **Türkçe** yaz.
- Aksi halde README'yi **İngilizce** yaz.

### Önemli
- Bu bir **profil README**'sidir, bir proje README'si DEĞİLDİR.
- Çıktı **SADECE geçerli Markdown** olmalıdır (ekstra açıklama veya yorum ekleme).
- **HTML img tag'leri KULLANMA - GitHub README'lerinde çalışmaz!**
- **Tüm görseller için Markdown image syntax kullan: ![alt text](url)**
- **HTML tag'leri KULLANMA - sadece saf Markdown kullan**
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: context },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    let generatedReadme = completion.choices[0]?.message?.content;

    if (!generatedReadme) {
      return NextResponse.json(
        { error: "Failed to generate README" },
        { status: 500 }
      );
    }

    // Post-processing: Remove animation-related content and clean up
    // Remove any animation image references
    generatedReadme = generatedReadme.replace(
      /!\[Typing SVG\]\([^)]+\)/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /!\[GitHub Stats\]\([^)]+\)/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /!\[GitHub Streak\]\([^)]+\)/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /!\[Top Languages\]\([^)]+\)/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /!\[Snake animation\]\([^)]+\)/gi,
      ''
    );

    // Remove any text references to animations
    generatedReadme = generatedReadme.replace(
      /Typing SVG/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /GitHub Stats/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /GitHub Streak/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /Top Languages/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /Snake animation/gi,
      ''
    );

    // Clean up empty lines
    generatedReadme = generatedReadme.replace(/\n{3,}/g, '\n\n');

    // Post-process: Fix name capitalization in title
    // Fix "Ben onur eren ejder" -> "Ben Onur Eren Ejder" pattern
    generatedReadme = generatedReadme.replace(
      /# (Merhaba,|Hi,|Hello,)\s*Ben\s+([a-z\s]+)(?:\s*🌟)?/gi,
      (match, greeting, name) => {
        const capitalizedName = name
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        return `# ${greeting} Ben ${capitalizedName} 🌟`;
      }
    );

    // Remove HTML div tags - keep only clean Markdown
    // But preserve the image content inside divs
    generatedReadme = generatedReadme.replace(
      /<div[^>]*>\s*\n?\s*/gi,
      ''
    );
    generatedReadme = generatedReadme.replace(
      /\s*\n?\s*<\/div>/gi,
      '\n\n'
    );

    // Clean up multiple consecutive newlines (but keep at least 2 for spacing)
    generatedReadme = generatedReadme.replace(/\n{4,}/g, '\n\n');

    // Ensure images have proper spacing around them
    generatedReadme = generatedReadme.replace(
      /(!\[[^\]]+\]\([^)]+\))\s*\n\s*(!\[[^\]]+\]\([^)]+\))/g,
      '$1\n$2'
    );

    // Ensure Python badge is included if Python is in top languages
    if (topLanguages.some(lang => lang.toLowerCase().includes('python'))) {
      const pythonBadge = '![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)';
      // Check if Python badge exists, if not add it to Data Science section
      if (!generatedReadme.includes('Python') || !generatedReadme.includes('3776AB')) {
        // Try to add Python badge to Data Science section
        generatedReadme = generatedReadme.replace(
          /(#### Data Science[\s\S]*?)(?=####|##|$)/gi,
          (match) => {
            if (!match.includes('Python') || !match.includes('3776AB')) {
              return match.replace(/(#### Data Science[\s\S]*?)(\n\n|$)/gi, `$1\n${pythonBadge}\n$2`);
            }
            return match;
          }
        );
      }
    }

    return NextResponse.json({ readme: generatedReadme });
  } catch (error: any) {
    console.error("Error generating README:", error);

    // Provide more specific error messages
    let errorMessage = "An error occurred while generating the README";
    let statusCode = 500;

    if (error.message?.includes("API key")) {
      errorMessage = error.message;
      statusCode = 500;
    } else if (error.message?.includes("fetch")) {
      errorMessage = "Failed to fetch GitHub profile data. Please check the profile URL.";
      statusCode = 404;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
