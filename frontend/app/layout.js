import "./globals.css";

export const metadata = {
  title: "Signalist — web analytics",
  description: "A privacy-first web analytics dashboard"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
