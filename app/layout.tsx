import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import LightRays from "@/components/LightRays";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "Just a project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="absolute inset-0 top-0 -z-1 min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.6}
            rayLength={2}
            followMouse={true}
            mouseInfluence={0.05}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
