export default function Home() {
  return (
    <main className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">VeriField</h1>
        <p className="opacity-80 mt-2">BNB Greenfield + BSC • Climate & Research datasets</p>
        <div className="mt-6 flex gap-3">
          <a className="px-4 py-2 rounded bg-emerald-400 text-black" href="/upload">Upload dataset</a>
          <a className="px-4 py-2 rounded border border-neutral-700 bg-neutral-900/40" href="/dataset/1">View example dataset</a>
        </div>
      </div>
    </main>
  );
}
