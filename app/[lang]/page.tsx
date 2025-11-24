import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import Mechanism from "@/app/components/Mechanism";
import Examples from "@/app/components/Examples";
import Guide from "@/app/components/Guide";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Mechanism />
        <Examples />
        <Guide />
      </main>
      <Footer />
    </>
  );
}
