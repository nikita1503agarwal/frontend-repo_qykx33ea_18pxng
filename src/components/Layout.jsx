export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">PERMA</a>
        <nav className="text-sm text-gray-600 flex items-center gap-4">
          <a href="/" className="hover:text-indigo-600">Hjem</a>
          <a href="#indsigter" className="hover:text-indigo-600">Indsigter</a>
          <a href="#maal" className="hover:text-indigo-600">Mål</a>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {children}
      </main>
      <footer className="text-center text-xs text-gray-500 py-8">PERMA companion • privat og enkelt</footer>
    </div>
  )
}
