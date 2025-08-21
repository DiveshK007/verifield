export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">VeriField</h1>
      <p className="opacity-80 mt-2">BNB Greenfield + BSC • Climate & Research datasets</p>
      <div className="mt-6 flex gap-4">
        <a className="underline" href="/upload">Upload dataset</a>
        <a className="underline" href="/dataset/1">View example dataset</a>
      </div>
    </main>
  );
}
