import './globals.css';
import Toaster from '@/components/Toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <div className="pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <main className="space-y-8">{children}</main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
