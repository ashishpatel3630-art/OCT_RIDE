
"use client";

import React, { useState } from "react";

import LoadingScreen from "../components/loading/LoadingScreen";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/Hero/Hero";
import Gallery from "../components/Hero/Gallery";
import HowItWorks from "../components/Hero/HowItWorks";
import Footer from "../components/layout/Footer";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="min-h-screen bg-white">
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Main Website */}
      <Navbar />

      <Hero />

      <Gallery />

      <HowItWorks />

      <Footer />
    </main>
  );
}

