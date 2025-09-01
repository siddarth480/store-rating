"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Oops! Something went wrong 😢
      </h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
