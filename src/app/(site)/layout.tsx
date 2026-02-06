import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import NextTopLoader from 'nextjs-toploader';
import ToasterContext from '../context/ToastContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='isolate'>
        <NextTopLoader
          color='#8646F4'
          crawlSpeed={300}
          showSpinner={false}
          shadow='none'
        />

        <Header />
        {children}
        <Footer />

        <ToasterContext />
      </div>

      <ScrollToTop />
    </>
  );
}
