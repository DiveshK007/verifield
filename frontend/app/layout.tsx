import WalletProvider from '../components/WalletProvider';
import Header from '../components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <WalletProvider>
          <Header />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}

