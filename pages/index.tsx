import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="max-w-2xl mx-auto w-full">
        <section className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Mini Student Task Tracker</h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8">Track assignments, deadlines, and priorities — lightweight and local.</p>
          <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-full text-sm sm:text-base">Get Started</Link>
        </section>

        <section className="mt-8 text-center text-sm text-gray-500">
          Built with Next.js and Tailwind — saves tasks to your browser.
        </section>
      </div>
    </main>
  )
}
