import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/globals/Navbar";
import Footer from "@/components/globals/Footer";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Bulky - Reliable Bulk Delivery Services for Your Business and Home",
  description: "Bulky provides professional, secure, and efficient delivery services for large items. From furniture to industrial equipment, we handle your bulky logistics with care.",
  keywords: ["bulk delivery", "logistics", "large item transport", "courier services", "furniture delivery"],
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${poppins.variable} font-sans antialiased text-secondary overflow-x-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
