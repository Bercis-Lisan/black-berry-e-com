import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Reveal from "./common/reveal";
import { useCart } from "../context/CartContext";
import { getProduct } from "../data/products";
import { formatRupees } from "../utils/productDisplay";

import heroVideo from "../assets/home videos/1_performance_chip.mp4";
import heroPoster from "../assets/home videos/1_performance_chip.jpg";
import batteryVideo from "../assets/home videos/2_thermal_battery.mp4";
import batteryPoster from "../assets/home videos/2_thermal_battery.jpg";
import cameraVideo from "../assets/home videos/3_pro_camera.mp4";
import cameraPoster from "../assets/home videos/3_pro_camera.jpg";
import aiVideo from "../assets/home videos/4_ai_assistant.mp4";
import aiPoster from "../assets/home videos/4_ai_assistant.jpg";
import closingVideo from "../assets/home videos/5_closing_brand.mp4";
import closingPoster from "../assets/home videos/5_closing_brand.jpg";

/* ---------- Hero ---------- */

function Hero({ added, onBuy }) {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Dark gradient overlays keep the copy readable over any frame of the video */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <h1 className="text-[44px] font-[600] leading-[1.05] tracking-tight text-white sm:text-[68px]">
            Black Berry 18 Pro
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] font-[300] leading-snug text-[#e5e5e7] sm:text-[21px]">
            The ultimate performance and camera of any Black Berry, with exceptional battery life.
          </p>

          
        </Reveal>
      </div>

      <a
        href="#performance"
        aria-label="Scroll to explore Black Berry 18 Pro features"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}

/* ---------- Reusable alternating feature section ---------- */

function FeatureSection({ id, eyebrow, title, copy, video, poster, reverse }) {
  return (
    <section id={id} className="border-t border-white/10 bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal
            className={`mx-auto max-w-md text-center lg:mx-0 lg:text-left ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <p className="text-[15px] font-[600] tracking-wide text-[#2997ff]">{eyebrow}</p>
            <h2 className="mt-3 text-[34px] font-[600] leading-[1.08] tracking-tight text-white sm:text-[44px]">
              {title}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.6] text-[#a1a1a6]">{copy}</p>
          </Reveal>

          <Reveal delay={120} className={reverse ? "lg:order-1" : "lg:order-2"}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <video
                className="aspect-video w-full object-cover"
                src={video}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing brand section ---------- */

function ClosingSection({ added, onBuy, price }) {
  return (
    <section className="relative h-[70vh] min-h-[440px] w-full overflow-hidden border-t border-white/10 bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        src={closingVideo}
        poster={closingPoster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <h2 className="text-[32px] font-[600] leading-[1.1] tracking-tight text-white sm:text-[48px]">
            Black Berry 18 Pro.
            <br />
            Pro further.
          </h2>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onBuy}
              className={`rounded-[980px] px-8 py-3 text-[15px] font-[500] transition-all duration-200 ${
                added ? "bg-[#1d7a3d] text-white" : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {added ? "Added to Bag ✓" : `Buy · From ${formatRupees(price)}`}
            </button>
            <Link
              to="/products/mobiles"
              className="text-[15px] font-[500] text-white/90 transition-colors hover:text-white"
            >
              Compare models →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Home ---------- */

export default function Home() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const flagship = getProduct("berry-phone-15-pro");

  const handleBuy = () => {
    if (!flagship) return;
    if (!addToCart(flagship)) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="bg-black">
      <Hero added={added} onBuy={handleBuy} />

      <FeatureSection
        id="performance"
        eyebrow="A20 Pro chip"
        title="Engineered for extreme performance."
        copy="A next-generation chip paired with a redesigned vapor chamber keeps everything running fast, cool, and efficient — even under the heaviest workloads."
        video={heroVideo}
        poster={heroPoster}
      />

      <FeatureSection
        id="battery"
        eyebrow="All-day, and then some"
        title="A big leap in battery life."
        copy="Smarter power management and improved thermal design add up to serious battery life — up to 45 hours of video playback on the Pro Max."
        video={batteryVideo}
        poster={batteryPoster}
        reverse
      />

      <FeatureSection
        id="camera"
        eyebrow="Pro camera system"
        title="Variable aperture. Greater creative range."
        copy="A redesigned camera system brings improved low-light photos and video, more impressive depth of field, and custom Pro controls for total creative range."
        video={cameraVideo}
        poster={cameraPoster}
      />

      <FeatureSection
        id="ai"
        eyebrow="Siri, evolved"
        title="Your AI assistant."
        copy="A smarter Siri understands context across your apps — more personal, more powerful, and built right into how you use Black Berry every day."
        video={aiVideo}
        poster={aiPoster}
        reverse
      />

      <ClosingSection added={added} onBuy={handleBuy} price={flagship?.price ?? "999"} />
    </div>
  );
}
