"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Github, Loader2, Download, Copy, Check, Sparkles, Zap, Code2, Star } from "lucide-react";

export default function Home() {
  const [profileUrl, setProfileUrl] = useState("");
  const [readme, setReadme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!profileUrl.trim()) {
      setError("Lütfen bir GitHub profil URL&apos;si girin");
      return;
    }

    setIsLoading(true);
    setError("");
    setReadme("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileUrl: profileUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate README");
      }

      setReadme(data.readme);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (readme) {
      await navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (readme) {
      const blob = new Blob([readme], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-50"></div>
                <Github className="h-8 w-8 relative text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  GitHub Profil README AI
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Profile Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium hidden sm:inline">Powered by Groq AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI Destekli Profil Oluşturucu</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Profesyonel GitHub Profil
              </span>
              <span className="block mt-2 text-slate-900 dark:text-slate-100">
                README Oluşturucu
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              GitHub profil bilgilerinizden yola çıkarak, AI destekli profesyonel ve kişisel bir profil README&apos;si oluşturun. 
              <span className="font-semibold text-slate-900 dark:text-slate-100"> Saniyeler içinde hazır!</span>
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Hızlı</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                <Code2 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Profesyonel</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">AI Destekli</span>
              </div>
            </div>
          </div>

          {/* Input Card */}
          <Card className="mb-8 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Github className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                GitHub Profil URL
              </CardTitle>
              <CardDescription className="text-base">
                Profil URL&apos;nizi girin (örn: <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">github.com/username</code> veya sadece <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">username</code>)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="GitHub profil URL&apos;sini yapıştırın..."
                    value={profileUrl}
                    onChange={(e) => {
                      setProfileUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading && profileUrl.trim()) {
                        handleGenerate();
                      }
                    }}
                    className="h-12 text-base pr-4 pl-12 border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                    disabled={isLoading}
                  />
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !profileUrl.trim()}
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">Oluşturuluyor...</span>
                      <span className="sm:hidden">İşleniyor</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Oluştur
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                    <span className="font-semibold">Hata:</span> {error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {readme && (
            <Card className="shadow-2xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      Oluşturulan README.md
                    </CardTitle>
                    <CardDescription className="mt-1">
                      İstediğiniz gibi düzenleyip kopyalayabilir veya indirebilirsiniz
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleCopy}
                      className="flex-1 sm:flex-none border-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 dark:hover:border-green-500 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="hidden sm:inline">Kopyalandı!</span>
                          <span className="sm:hidden">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Kopyala
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleDownload}
                      className="flex-1 sm:flex-none border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">İndir</span>
                      <span className="sm:hidden">İndir</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Markdown Editor (Left) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        Markdown Kaynağı
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono">
                        {readme.length} karakter
                      </span>
                    </div>
                    <textarea
                      value={readme}
                      onChange={(e) => setReadme(e.target.value)}
                      className="w-full h-[600px] p-4 border-2 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all"
                      placeholder="README içeriği burada görünecek..."
                    />
                  </div>

                  {/* Preview (Right) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Canlı Önizleme
                    </h3>
                    <div className="border-2 rounded-lg p-6 h-[600px] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-inner">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-code:text-purple-600 dark:prose-code:text-purple-400 max-w-none"
                      >
                        {readme}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 relative" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Profil analiz ediliyor...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      GitHub profil bilgileriniz toplanıyor ve AI README oluşturuyor
                    </p>
                  </div>
                  <div className="w-64 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>Made with</p>
              <span className="text-red-500">❤️</span>
              <p>using</p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Next.js</span>
              <span className="text-muted-foreground">,</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">Groq AI</span>
              <span className="text-muted-foreground">,</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">GitHub API</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2025 GitHub Profil README AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
