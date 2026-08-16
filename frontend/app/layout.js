// app/layout.js
import './globals.css'

export const metadata = {
  title: 'RoadChain - Transparent Road Governance',
  description: 'Transparent Road Governance for All',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}