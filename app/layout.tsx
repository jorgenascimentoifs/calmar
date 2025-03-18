import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Carregando a fonte Nunito para títulos
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

// Carregando a fonte Inter para texto
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calmar - Criando Hábitos Positivos",
  description: "Plataforma dedicada ao bem-estar mental através de criação de hábitos positivos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${nunito.variable} ${inter.variable} antialiased bg-[#FAF9F2]`}
      >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#39555C',
              border: '1px solid #F5EFE0',
              padding: '16px',
              borderRadius: '12px',
              fontFamily: 'var(--font-inter)',
            },
            success: {
              duration: 4000,
              style: {
                background: '#EDF7F6',
                border: '1px solid #478E89',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#FEF2F2',
                border: '1px solid #EF4444',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
