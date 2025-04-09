import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ecommerce App',
    description: 'A multilingual ecommerce platform',
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    let messages;
    let localee;
    try {
        const { locale } = await params;
        localee = locale;
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        console.error('Error loading messages:', error);
        notFound();
    }

    const direction = localee === 'ar' ? 'rtl' : 'ltr';

    return (
        <NextIntlClientProvider locale={localee} messages={messages}>
            <html lang={localee} dir={direction}   bbai-tooltip-injected="true">
                <body className={inter.className}>
                    <Header />
                    <main className="">{children}</main> {/* Added pt-[80px] to avoid overlap */}
                    <Footer />
                </body>
            </html>
        </NextIntlClientProvider>
    );
}