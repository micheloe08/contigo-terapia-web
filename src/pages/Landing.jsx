import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/layout/WhatsAppButton";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Specialties from "../components/landing/Specialties";
import Therapists from "../components/landing/Therapists";
import WhyUs from "../components/landing/WhyUs";
import Testimonials from "../components/landing/Testimonials";
import FAQ from "../components/landing/FAQ";
import CTAFinal from "../components/landing/CTAFinal";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Specialties />
      <Therapists />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
