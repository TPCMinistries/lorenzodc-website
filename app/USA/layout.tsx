import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "United States of Africa Website v0",
  description: "Building a unified, prosperous, and self-determined Africa through collaboration, innovation, and sustainable development. The United States of Africa movement for continental transformation.",
  openGraph: {
    title: "United States of Africa Website v0",
    description: "Building a unified, prosperous, and self-determined Africa through collaboration, innovation, and sustainable development.",
    type: "website",
    url: "https://lorenzodc.com/USA",
    siteName: "United States of Africa Movement",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "United States of Africa"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "United States of Africa Website v0",
    description: "Building a unified, prosperous, and self-determined Africa through collaboration, innovation, and sustainable development.",
    images: ["/favicon.ico"]
  }
};

export default function USALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}