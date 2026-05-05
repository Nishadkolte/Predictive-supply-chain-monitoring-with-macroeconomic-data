export const metadata = { title: 'Meridian · Supply Chain Intelligence' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07090f' }}>
        {children}
      </body>
    </html>
  );
}
