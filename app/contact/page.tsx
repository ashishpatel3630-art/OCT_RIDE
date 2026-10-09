import ContactHelp from "../../components/Hero/ContactHelp";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ContactHelp />
      <Footer />
    </main>
  );
}
