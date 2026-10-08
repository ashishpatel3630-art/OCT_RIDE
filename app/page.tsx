import LoadingScreen from "../components/loading/LoadingScreen";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/Hero/Hero";
export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <div id="home">
        <Hero />
    
        
      </div>
    </>
  );
}