import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AboutPath from "../../components/About/AboutPath";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <AboutPath />
      </main>

      <Footer />
    </>
  );
}