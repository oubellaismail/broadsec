import Navbar           from "@/components/layout/navbar";
import Hero             from "@/components/sections/hero";
import Stats            from "@/components/sections/stats";
import HowItWorks       from "@/components/sections/how-it-works";
import Features         from "@/components/sections/features";
import LeaderboardPreview from "@/components/sections/leaderboard-preview";
import TrustedBy        from "@/components/sections/trusted-by";
import Footer           from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="zellige-divider" aria-hidden="true" />
        <Stats />
        <div className="zellige-divider" aria-hidden="true" />
        <HowItWorks />
        <div className="zellige-divider" aria-hidden="true" />
        <Features />
        <div className="zellige-divider" aria-hidden="true" />
        <LeaderboardPreview />
        <div className="zellige-divider" aria-hidden="true" />
        <TrustedBy />
      </main>
      <Footer />
    </>
  );
}
