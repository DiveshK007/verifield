import './globals.css';
import WalletProvider from '../components/WalletProvider';
import Header from '../components/Header';
import { ToastProvider } from '../components/Toast';

export const metadata = {
  title: 'VeriField - Decentralized Research Platform',
  description: 'The GitHub for research datasets. Upload, verify, and monetize your scientific data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <ToastProvider>
          <WalletProvider>
            <Header />
            {children}
          </WalletProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

