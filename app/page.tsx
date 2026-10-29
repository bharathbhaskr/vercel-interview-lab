import { Suspense } from "react";
import { cookies } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";

async function CachedContent() {
  "use cache";

  cacheLife("minutes");
  cacheTag("posts");

  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  if (!response.ok) {
    throw new Error("Could not fetch the sample post");
  }

  const post = await response.json();

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">2. Cached content</h2>
      <p className="mt-3">{post.title}</p>
      <p className="mt-3 text-sm">
        Generated: {new Date().toISOString()}
      </p>
    </section>
  );
}

async function RequestContent() {
  const cookieStore = await cookies();

  // Deliberate delay so streaming is easier to observe.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">3. Request-time content</h2>
      <p className="mt-3">
        Demo preference: {cookieStore.get("lab-preference")?.value ?? "Not set"}
      </p>
      <p className="mt-3 text-sm">
        Generated: {new Date().toISOString()}
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">
          Bharath’s Rendering Lab
        </h1>
        <p className="mt-3">
          Environment: {process.env.NEXT_PUBLIC_LAB_ENV ?? "Not configured"}
        </p>
      </header>

      <section className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">1. Static content</h2>
        <p className="mt-3">
          This heading and description can be prepared ahead of a request.
        </p>
      </section>

      <CachedContent />

      <Suspense fallback={<p>Loading request-time content…</p>}>
        <RequestContent />
      </Suspense>
    </main>
  );
}
