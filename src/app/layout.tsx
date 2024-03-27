import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Vhio Shop",
  description: "Simple shopping platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  // console.log("session user", session);

  return (
    <html >
      <body className="bg-purple-50 ">
        <SessionProvider session={session}>
            <Toaster position="top-center" />
            <main className="">
              <div className="container mx-auto ">
                {children}
              </div>
            </main>
        </SessionProvider>
      </body>
    </html>
  );
}
