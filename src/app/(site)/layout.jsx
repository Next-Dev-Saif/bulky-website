import Navbar from "@/components/globals/Navbar";
import Footer from "@/components/globals/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
