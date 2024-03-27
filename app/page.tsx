import DataSection from "@/components/DataSection";

export default function Home() {
  return (
    <main className="mx-auto w-[calc(100vw-3rem)] sm:w-[93vw] md:w-[90vw]">
      <section className="flex h-fit py-10 lg:py-0 lg:h-[100dvh] justify-center items-center">
        <div className="flex flex-col w-full">
          <div className="mb-8 flex w-full flex-col">
            <h1 className="text-xl font-semibold">
              Document Similarity Checker
            </h1>
            <p className="text-sm font-light">
              Analyze the content using the Enhanced Rabin-Karp Algorithm
            </p>
          </div>

          <DataSection />
        </div>
      </section>
    </main>
  );
}
