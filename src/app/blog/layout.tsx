import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafbfc] via-white to-[#f5f7fa]">
      {/* Elegant Glass Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/ycjgt.png" 
                alt="YCJGT" 
                className="w-10 h-10 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300" 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#4FC3F7]/20 to-[#039BE5]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-semibold text-lg tracking-tight">YCJGT</span>
              <span className="text-slate-400 text-xs font-medium tracking-wide uppercase">Blog</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[#039BE5] after:transition-all"
            >
              Articles
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#039BE5] to-[#4FC3F7] text-white text-sm font-semibold shadow-lg shadow-[#039BE5]/25 hover:shadow-xl hover:shadow-[#039BE5]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Try YCJGT
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <main className="relative">
        {/* Subtle decorative gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#4FC3F7]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-[#039BE5]/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative">{children}</div>
      </main>

      {/* Elegant Footer */}
      <footer className="bg-slate-900 mt-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/ycjgt.png" alt="YCJGT" className="w-8 h-8 rounded-lg opacity-80" />
              <div>
                <p className="text-slate-300 text-sm font-medium">You Can Just Generate Things</p>
                <p className="text-slate-500 text-xs">AI-powered video generation</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
                Blog
              </Link>
              <span className="text-slate-600">
                &copy; {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
