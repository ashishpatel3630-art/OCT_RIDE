import Find from "../../components/Find/Find";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

export default function FindPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Find />
      <Footer />
    </main>
  );
}
