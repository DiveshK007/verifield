export default function DatasetPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Dataset #{id}</h2>
      <div className="mt-4 space-y-2">
        <p>Title: Example Air Quality Dataset</p>
        <p>License: CC-BY-4.0</p>
        <p>Tags: air-quality, pm2.5, india</p>
        <button className="bg-indigo-400 text-black px-4 py-2 rounded">Buy & Download</button>
      </div>
    </main>
  );
}
