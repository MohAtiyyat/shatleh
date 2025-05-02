import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { AuthProvider } from "../../../lib/AuthContext";
import { ProductProvider } from "../../../lib/ProductContext";

const inter = Inter({ subsets: ["latin"] });

// Generate dynamic metadata based on locale
export async function generateMetadata({
    params,
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const { locale } = await params;
    let t;

    try {
        t = await getTranslations({ locale, namespace: "metadata" });
    } catch (error) {
        console.error("Error loading translations for metadata:", error);
        return {
            title: "Shatleh",
            description: "A multilingual ecommerce platform",
            icons: {
                icon: "/logo shatleh.png",

            },


        };
    }

    return {
        title: t("title") || "Shatleh",
        description: t("description") || "A multilingual ecommerce platform",
        icons: {
            icon: "/logo shatleh.png", // Path to favicon in public/

        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    let messages;
    const localee = locale;

    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        console.error("Error loading messages:", error);
        notFound();
    }

    const direction = localee === "ar" ? "rtl" : "ltr";

    return (
        <NextIntlClientProvider locale={localee} messages={messages}>
            <html lang={localee} dir={direction} bbai-tooltip-injected="true">
                <body className={inter.className}>
                    <AuthProvider>
                        <ProductProvider>
                            <Header />
                            <main>{children}</main>
                            <Footer />
                        </ProductProvider>
                    </AuthProvider>
                </body>
            </html>
        </NextIntlClientProvider>
    );
}