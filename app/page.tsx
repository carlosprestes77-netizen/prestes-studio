import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import AgendaBanner from "@/components/sections/AgendaBanner";
import Portfolio from "@/components/sections/Portfolio";
import FlashGallery from "@/components/sections/FlashGallery";
import Simulator from "@/components/sections/Simulator";
import Studio from "@/components/sections/Studio";
import QuoteForm from "@/components/sections/QuoteForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AgendaBanner />
        <Portfolio />
        <FlashGallery />
        <Simulator />
        <Studio />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
