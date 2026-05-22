import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../assets/style.css'




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        
        <main>{children}</main>
          
        

        
      </body>
    </html>
  );
}
