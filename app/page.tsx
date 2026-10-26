
"use client";

import React, { useCallback, useState } from "react";

import LoadingScreen from "../components/loading/LoadingScreen";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/Hero/Hero";
import Gallery from "../components/Hero/Gallery";
import HowItWorks from "../components/Hero/HowItWorks";
import Footer from "../components/layout/Footer";
import Faq from "../components/Hero/Faq";
import TrackingIntro from "../components/Hero/TrackingIntro";
import BottomGallery from "@/components/Hero/BottomGallery";
export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const finishLoading = useCallback(() => setIsLoading(false), []);

  return (
    <main className="min-h-screen bg-white">
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={finishLoading} />
      )}

      {/* Main Website */}
      <Navbar />

      <Hero />

      <Gallery />

      <HowItWorks />
      <TrackingIntro />
      <BottomGallery/>
      <Faq />
      <Footer />
    </main>
  );
}
