import Link from "next/link";

export default function Home() {
  return (
    <main className="w-[calc(100vw-2rem)] mx-auto">
      <div className="flex flex-col items-center justify-center space-y-4 text-center h-[100vh] gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-gray-50">
            Rabin-Karp Algorithm
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Your go-to solution for accurate and efficient document comparison.
            Dive deeper into the algorithm that matches your curiosity.
          </p>
        </div>
        <div className="flex flex-col gap-6 min-[500px]:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl border  border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50  dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:text-gray-50"
            href="/naive-rka"
          >
            Naive Rabin-Karp
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/enhanced-rka"
          >
            Enhanced Rabin-Karp
          </Link>
        </div>
      </div>
    </main>
  );
}
