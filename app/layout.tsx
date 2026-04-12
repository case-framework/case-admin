import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from 'next-intl';

import { ConfirmDialogProvider } from "@/components/c-ui/confirm-provider";
import { AlertDialogProvider } from "@/components/c-ui/alert";
import { getLocale } from "@/i18n/actions";

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
        default: process.env.NEXT_PUBLIC_APP_NAME || 'CASE Admin',
        template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'CASE Admin'} `,
    },
    description: 'This is the CASE admin tool, to manage studies, surveys, messages and participants.'
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <TRPCReactProvider>
                    <NuqsAdapter>
                        <NextIntlClientProvider>
                            <ConfirmDialogProvider>
                                <AlertDialogProvider>
                                    {children}
                                    <Toaster position="bottom-center" />
                                </AlertDialogProvider>
                            </ConfirmDialogProvider>
                        </NextIntlClientProvider>
                    </NuqsAdapter>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
