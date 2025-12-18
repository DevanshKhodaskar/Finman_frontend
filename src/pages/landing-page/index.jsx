import { useEffect } from "react";

import InteractiveSectionNavigator from "../../components/ui/InteractiveSectionNavigator";
import FloatingDualCTA from "../../components/ui/FloatingDualCTA";
import TrustSignalSidebar from "../../components/ui/TrustSignalSidebar";
// import ProgressConversionTracker from "../../components/ui/ProgressConversionTracker";

import Hero3D from "./components/Hero3D";
import ProblemAgitation from "./components/ProblemAgitation";
import DualPlatformDemo from "./components/DualPlatformDemo";
import BenefitsGrid from "./components/BenefitsGrid";
import TrustMetrics from "./components/TrustMetrics";
import ComparisonTable from "./components/ComparisonTable";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

const LandingPage = () => {
  useEffect(() => {
    document.title = "FinMan – Smart AI Expense Manager";

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Track expenses instantly using AI. Text, upload bills, or scan products and get insights in seconds."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Global UI helpers */}
      <InteractiveSectionNavigator />
      {/* <ProgressConversionTracker /> */}
      <TrustSignalSidebar />

      {/* Main landing content */}
      <main>
        <Hero3D />
        <ProblemAgitation />
        <DualPlatformDemo />
        <BenefitsGrid />
        
        <TrustMetrics />
        <ComparisonTable />
        <PricingSection />
        <FAQSection />
      </main>

      <Footer />
      <FloatingDualCTA />
    </div>
  );
};

export default LandingPage;
