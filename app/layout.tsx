import { bizFont } from './ui/fonts'  // Primero importa la fuente
import './ui/global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bizFont.className} antialiased`}>{children}</body>
    </html>
  );
}
