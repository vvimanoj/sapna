
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 text-center p-6">
      <h1 className="text-5xl font-bold text-pink-700 mb-6 animate-bounce">
        Hey Love 💖
      </h1>
      <p className="text-xl mb-8 text-pink-900">
        I made something special just for you...
      </p>
      <a
        href="/game"
        className="bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-500 transition"
      >
        Start the Surprise ✨
      </a>
    </main>
  );
}
