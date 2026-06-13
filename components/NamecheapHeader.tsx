type NamecheapHeaderProps = {
  breadcrumb?: string
  badge?: string
}

export default function NamecheapHeader({ breadcrumb, badge }: NamecheapHeaderProps) {
  return (
    <>
      {/* Utility bar */}
      <div className="bg-nc-bg-utility border-b border-nc-border text-xs text-nc-text-muted">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-nc-orange transition-colors">Contact us</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Sign up</a>
            <a href="#" className="hover:text-nc-orange transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Sign in
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-nc-orange transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </a>
            <span className="text-nc-text-muted">$ USD</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="bg-white border-b border-nc-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nc-orange rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">N</span>
            </div>
            <span className="text-nc-text font-semibold text-xl tracking-tight">namecheap</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-nc-text">
            <a href="#" className="hover:text-nc-orange transition-colors">Domains</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Hosting</a>
            <a href="#" className="hover:text-nc-orange transition-colors">WordPress</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Email</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Marketing Tools</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Security</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Transfer to Us</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Help Center</a>
            <a href="#" className="hover:text-nc-orange transition-colors">Account</a>
          </nav>
          {badge && (
            <span className="text-sm text-nc-text-muted font-medium">{badge}</span>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="bg-nc-bg-subtle border-b border-nc-border">
          <div className="max-w-6xl mx-auto px-4 py-2 text-xs text-nc-text-muted">
            {breadcrumb}
          </div>
        </div>
      )}
    </>
  )
}
