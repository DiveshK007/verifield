'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('Air Quality Sample');
  const [licenseUri, setLicense] = useState('https://opendatacommons.org/licenses/by/');
  const [domain, setDomain] = useState('climate');
  const [tags, setTags] = useState('air-quality,pm2.5,india');

  const onSubmit = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('licenseUri', licenseUri);
    form.append('domain', domain);
    form.append('tags', tags);
    const res = await axios.post('/api/webhook', form);
    alert(res.data?.message || 'Uploaded');
  };

  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Upload dataset</h2>
      <div className="mt-4 grid gap-3 max-w-xl">
        <input type="text" className="bg-neutral-800 p-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input type="text" className="bg-neutral-800 p-2 rounded" value={licenseUri} onChange={e=>setLicense(e.target.value)} placeholder="License URL" />
        <input type="text" className="bg-neutral-800 p-2 rounded" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="Domain e.g. climate" />
        <input type="text" className="bg-neutral-800 p-2 rounded" value={tags} onChange={e=>setTags(e.target.value)} placeholder="Comma-separated tags" />
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button onClick={onSubmit} className="bg-emerald-500 text-black px-4 py-2 rounded">Upload (sponsored)</button>
      </div>
    </main>
  );
}
