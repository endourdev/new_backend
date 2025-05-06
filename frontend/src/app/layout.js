import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Erisium PVP',
  description: 'Le site de la communauté Erisium PVP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        <div className="flex flex-col min-h-screen">
          {/* <header className="bg-gray-900 p-4">
            <h1 className="text-3xl font-bold">Erisium PVP</h1>
          </header> */}
          <main className="flex-grow">{children}</main>
          <footer className="p-4 text-center">
            &copy; 2025 Erisium PVP. Tous droits réservés.
          </footer>
        </div>
      </body>
      {/* <style jsx global>{`
        :root {
          --geist-font: ${geistSans.style.fontFamily};
          --geist-mono-font: ${geistMono.style.fontFamily};
        }
      `}</style> */}
    </html>
  );
}
