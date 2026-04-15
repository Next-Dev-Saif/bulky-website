import ContactHero from "@/components/page-sections/contact/ContactHero";
import ContactForm from "@/components/page-sections/contact/ContactForm";
import ContactMap from "@/components/page-sections/contact/ContactMap";

export const metadata = {
  title: "Contact Us | Bulky - Expert Logistics & Moving Solutions",
  description: "Get in touch with the Bulky team for any inquiries about our heavy lifting and delivery services. We're here to help you move bulk with ease.",
};

export default function ContactUsPage() {
  return (
    <main className="bg-white pb-24">
      <ContactHero />
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </main>
  );
}
