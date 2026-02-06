import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/animate.css';
import '@/styles/prism-vsc-dark-plus.css';
import '@/styles/star.css';
import '@/styles/tailwind.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={plusJakarta.className}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}