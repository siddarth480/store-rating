export default function HomePage() {
  return (
    <section className="flex-1 flex items-center justify-center px-6 py-12 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Discover & Rate <span className="text-blue-600">Local Stores</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Find the best shops near you, share your experience, and help others
          make informed choices.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/stores"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Browse Stores
          </a>
          <a
            href="/auth/signup"
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
