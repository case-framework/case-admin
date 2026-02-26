import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from 'next-intl';

import { ConfirmDialogProvider } from "@/components/c-ui/confirm-provider";
import { AlertDialogProvider } from "@/components/c-ui/alert";
import { LocaleSwitcher } from "@/components/locale-switcher";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: process.env.NEXT_PUBLIC_APP_NAME || 'Case Admin',
        template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Case Admin'} `,
    },
    description: 'This is the CASE admin tool, to manage studies, surveys, messages and participants.'
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const store = await cookies();
    const locale = store.get('locale')?.value || 'en';

    return (
        <html
            lang={locale}
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <TRPCReactProvider>
                    <NuqsAdapter>
                        <NextIntlClientProvider>
                            <ConfirmDialogProvider>
                                <AlertDialogProvider>
                                    <div className="fixed right-4 top-4 z-50">
                                        <LocaleSwitcher />
                                    </div>
                                    {children}
                                    <Toaster
                                        position="bottom-center"
                                    />
                                </AlertDialogProvider>
                            </ConfirmDialogProvider>
                        </NextIntlClientProvider>
                    </NuqsAdapter>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
