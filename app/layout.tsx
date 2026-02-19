import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ConfirmDialogProvider } from "@/components/c-ui/confirm-provider";
import { AlertDialogProvider } from "@/components/c-ui/alert";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <TRPCReactProvider>
                    <NuqsAdapter>
                        <ConfirmDialogProvider>
                            <AlertDialogProvider>
                                {children}
                                <Toaster
                                    position="bottom-center"
                                />
                            </AlertDialogProvider>
                        </ConfirmDialogProvider>
                    </NuqsAdapter>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
