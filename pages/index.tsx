import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8">
        <section className="bg-white p-12 rounded shadow text-center">
          <h1 className="text-3xl font-bold mb-2">Mini Student Task Tracker</h1>
          <p className="text-gray-600 mb-6">Track assignments, deadlines, and priorities — lightweight and local.</p>
          <Link href="/dashboard"><a className="inline-block bg-blue-600 text-white px-6 py-3 rounded">Get Started</a></Link>
        </section>

        <section className="mt-8 text-center text-sm text-gray-500">
          Built with Next.js and Tailwind — saves tasks to your browser.
        </section>
      </div>
    </main>
  )
}
