import {
  Smartphone,
  Tv,
  Laptop,
  Watch,
  
  Refrigerator,
} from "lucide-react";
import { ensureProductColors } from "../utils/productDisplay";

// Mobiles
import mobileIphone5 from "../assets/mobile/Iphone-5.png";
import mobileShopping1 from "../assets/mobile/shopping (1).webp";
import mobileShopping2 from "../assets/mobile/shopping (2).webp";
import mobileShopping3 from "../assets/mobile/shopping (3).webp";

// TV & Monitors
import tvAppleTv from "../assets/tv and moniters/apple-tv-og-202210.jpg";
import tvImages from "../assets/tv and moniters/images.jpg";
import tvOriginal from "../assets/tv and moniters/-original-imagzhaetx5zmgqz.webp";

// Appliances
import applImages from "../assets/appl/images.jpg";
import applImages1 from "../assets/appl/images (1).jpg";
import applImages2 from "../assets/appl/images (2).jpg";

// Computers
import macImages from "../assets/mac/images.jpg";
import macImages1 from "../assets/mac/images (1).jpg";
import macImages2 from "../assets/mac/images (2).jpg";

// Wearables
import wearImages from "../assets/wearables/images.jpg";
import wearImages1 from "../assets/wearables/images (1).jpg";
import wearImages2 from "../assets/wearables/images (2).jpg";
import wearImages3 from "../assets/wearables/images (3).jpg";

export const categories = [
  {
    slug: "mobiles",
    name: "Mobiles",
    tagline: "Speed that fits in your pocket",
    icon: Smartphone,
    gradient: "from-[#4B2FE0] to-[#8A6CFF]",
  },
  {
    slug: "tv-monitors",
    name: "TV & Monitors",
    tagline: "Every pixel, exactly right",
    icon: Tv,
    gradient: "from-[#0E0E12] to-[#3A3A45]",
  },
  {
    slug: "appliances",
    name: "Appliances",
    tagline: "The home, working smarter",
    icon: Refrigerator,
    gradient: "from-[#0E7C6B] to-[#3FBF9A]",
  },
  {
    slug: "computers",
    name: "Computers",
    tagline: "Power for every workflow",
    icon: Laptop,
    gradient: "from-[#1B1F5C] to-[#4B2FE0]",
  },
  {
    slug: "wearables",
    name: "Wearables & Accessories",
    tagline: "Small things, big difference",
    icon: Watch,
    gradient: "from-[#C22A6D] to-[#FF6F9C]",
  },
];

export const getCategory = (slug) =>
  categories.find((c) => c.slug === slug);

const productCatalog = [
  // Mobiles
  {
    id: "berry-phone-15-pro",
    name: "Berry Phone 15 Pro",
    category: "mobiles",
    price: 1099,
    originalPrice: null,
    tag: "New",
    rating: 4.8,
    reviews: 214,
    colors: ["#1D1D1F", "#E3D9C6", "#3A5DFF", "#5B5F66"],
    variants: ["128GB", "256GB", "512GB"],
    image: mobileIphone5,
    description:
      "The most advanced Berry Phone yet, with a titanium frame, a pro camera system, and all-day battery life built for how you actually use your phone.",
    specs: [
      { label: "Display", value: "6.7\" Super Retina, 120Hz" },
      { label: "Chip", value: "B18 Pro, 6-core" },
      { label: "Camera", value: "Triple 48MP system" },
      { label: "Battery", value: "Up to 29 hours video" },
      { label: "Build", value: "Titanium frame, IP68" },
    ],
  },
  {
    id: "berry-phone-15",
    name: "Berry Phone 15",
    category: "mobiles",
    price: 799,
    originalPrice: null,
    tag: "New",
    rating: 4.6,
    reviews: 158,
    colors: ["#1D1D1F", "#FF6F9C", "#3A5DFF", "#F5F5F7"],
    variants: ["128GB", "256GB"],
    image: mobileShopping1,
    description:
      "A big leap for the lineup — a brighter display, a faster chip, and a more durable design, in five colors made to be seen.",
    specs: [
      { label: "Display", value: "6.1\" Super Retina, 60Hz" },
      { label: "Chip", value: "B17, 6-core" },
      { label: "Camera", value: "Dual 48MP system" },
      { label: "Battery", value: "Up to 20 hours video" },
      { label: "Build", value: "Aerospace aluminum" },
    ],
  },
  {
    id: "berry-phone-14e",
    name: "Berry Phone 14e",
    category: "mobiles",
    price: 549,
    originalPrice: 599,
    tag: "Sale",
    rating: 4.4,
    reviews: 96,
    colors: ["#1D1D1F", "#F5F5F7"],
    variants: ["128GB", "256GB"],
    image: mobileShopping2,
    description:
      "All the essentials in a compact, affordable design — the easiest way into the Berry ecosystem.",
    specs: [
      { label: "Display", value: "6.1\" Liquid Retina" },
      { label: "Chip", value: "B16" },
      { label: "Camera", value: "Single 48MP system" },
      { label: "Battery", value: "Up to 18 hours video" },
      { label: "Build", value: "Aluminum, IP67" },
    ],
  },
  {
    id: "berry-air",
    name: "Berry air",
    category: "mobiles",
    price: 1799,
    originalPrice: null,
    tag: "New",
    rating: 4.7,
    reviews: 61,
    colors: ["#1D1D1F", "#3A5DFF"],
    variants: ["256GB", "512GB"],
    image: mobileShopping3,
    description:
      "One device, two forms. A pocketable phone that unfolds into a full tablet display for work, streaming, and everything between.",
    specs: [
      { label: "Cover display", value: "6.3\" Dynamic AMOLED" },
      { label: "Main display", value: "7.6\"  AMOLED" },
      { label: "Chip", value: "B18 Pro" },
      { label: "Camera", value: "Triple 50MP system" },
      { label: "Build", value: "Armor glass, hinge-protected" },
    ],
  },

  // TV & Monitors
  {
    id: "berry-oled-65",
    name: "Berry OLED 65",
    category: "tv-monitors",
    price: 2199,
    originalPrice: 2499,
    tag: "Sale",
    rating: 4.9,
    reviews: 132,
    colors: ["#1D1D1F"],
    variants: ["55\"", "65\"", "77\""],
    image: tvAppleTv,
    description:
      "Self-lit pixels, perfect black, and a processor tuned for film, sport, and everything you play — a home theater that disappears into any room.",
    specs: [
      { label: "Panel", value: "4K OLED, 144Hz" },
      { label: "HDR", value: "Dolby Vision, HDR10+" },
      { label: "Sound", value: "60W, Dolby Atmos" },
      { label: "Ports", value: "4x HDMI 2.1" },
      { label: "Smart platform", value: "Berry OS TV" },
    ],
  },
  {
    id: "berry-studio-display",
    name: "Berry Studio Display 27",
    category: "tv-monitors",
    price: 899,
    originalPrice: null,
    tag: "New",
    rating: 4.7,
    reviews: 74,
    colors: ["#F5F5F7"],
    variants: ["Standard glass", "Nano-texture glass"],
    image: tvImages,
    description:
      "A 5K display built for people who look at pixels all day — accurate color, a wide viewing angle, and a stand that adjusts to how you sit.",
    specs: [
      { label: "Panel", value: "27\" 5K Retina" },
      { label: "Color", value: "P3 wide color, 600 nits" },
      { label: "Camera", value: "12MP ultra-wide" },
      { label: "Audio", value: "6-speaker sound system" },
      { label: "Stand", value: "Tilt + height adjustable" },
    ],
  },
  {
    id: "berry-gaming-monitor",
    name: "Berry Curve 34 Ultrawide",
    category: "tv-monitors",
    price: 749,
    originalPrice: null,
    tag: null,
    rating: 4.5,
    reviews: 88,
    colors: ["#1D1D1F"],
    variants: ["165Hz", "240Hz"],
    image: tvOriginal,
    description:
      "A curved ultrawide built for competitive play and creative work alike — immersive, fast, and easy on the eyes across long sessions.",
    specs: [
      { label: "Panel", value: "34\" QHD curved VA" },
      { label: "Refresh rate", value: "Up to 240Hz" },
      { label: "Response time", value: "1ms GtG" },
      { label: "Ports", value: "HDMI 2.1, DP 1.4, USB-C" },
      { label: "Adaptive sync", value: "FreeSync Premium Pro" },
    ],
  },

  // Appliances
  {
    id: "berry-fridge-french",
    name: "Berry FrontLoad Washer",
    category: "appliances",
    price: 999,
    originalPrice: 1099,
    tag: "Sale",
    rating: 4.5,
    reviews: 63,
    colors: ["#F5F5F7"],
    variants: ["4.5 cu.ft", "5.2 cu.ft"],
    image: applImages1,
    description:
      "Deep-clean cycles that use less water and less time, with a drum designed to be gentle on every fabric you own.",
    specs: [
      { label: "Capacity", value: "5.2 cu. ft." },
      { label: "Spin speed", value: "1,400 RPM" },
      { label: "Cycles", value: "14 wash programs" },
      { label: "Efficiency", value: "Energy Star certified" },
      { label: "Smart features", value: "Remote start, diagnostics" },
    
    ],
  },
  {
    id: "berry-washer",
    name: "Berry French Door Refrigerator",
    category: "appliances",
    price: 2399,
    originalPrice: null,
    tag: "New",
    rating: 4.6,
    reviews: 47,
    colors: ["#C6C7CC", "#1D1D1F"],
    variants: ["24 cu.ft", "28 cu.ft"],
    image: applImages,
    description:
      "Smart cooling that adapts to what's inside, a quiet compressor, and a layout designed around how families actually shop and cook.",
    specs: [
      { label: "Capacity", value: "28 cu. ft." },
      { label: "Cooling", value: "Dual independent zones" },
      { label: "Noise", value: "38 dB" },
      { label: "Smart features", value: "Berry Home app control" },
      { label: "Finish", value: "Fingerprint-resistant steel" },
    
    ],
  },
  {
    id: "berry-microwave",
    name: "Berry AC",
    category: "appliances",
    price: 329,
    originalPrice: null,
    tag: null,
    rating: 4.3,
    reviews: 39,
    colors: ["#1D1D1F", "#F5F5F7"],
    variants: ["1.2 cu.ft", "1.6 cu.ft"],
    image: applImages2,
    description:
      "Microwave, convection, and air-fry in one countertop footprint — one-touch presets tuned for the way you actually cook.",
    specs: [
      { label: "Capacity", value: "1.6 cu. ft." },
      { label: "Power", value: "1200W" },
      { label: "Modes", value: "Microwave, convection, air-fry" },
      { label: "Presets", value: "12 one-touch programs" },
      { label: "Interior", value: "Ceramic-enamel, easy clean" },
    ],
  },

  // Computers
  {
    id: "berry-book-air",
    name: "Berry Book Air 15",
    category: "computers",
    price: 1299,
    originalPrice: null,
    tag: "New",
    rating: 4.9,
    reviews: 187,
    colors: ["#1D1D1F", "#E3D9C6", "#5B5F66", "#F5F5F7"],
    variants: ["8GB/256GB", "16GB/512GB", "24GB/1TB"],
    image: macImages,
    description:
      "Impossibly thin, silent, and fast enough for real work — a 15-inch canvas with all-day battery life and zero fan noise.",
    specs: [
      { label: "Display", value: "15.3\" Liquid Retina" },
      { label: "Chip", value: "B4 chip, 10-core GPU" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Weight", value: "1.51 kg" },
      { label: "Ports", value: "2x Thunderbolt, MagSafe" },
    ],
  },
  {
    id: "berry-book-pro",
    name: "Berry Book Pro 16",
    category: "computers",
    price: 2499,
    originalPrice: null,
    tag: "New",
    rating: 4.8,
    reviews: 121,
    colors: ["#1D1D1F", "#5B5F66"],
    variants: ["16GB/512GB", "36GB/1TB", "48GB/2TB"],
    image: macImages1,
    description:
      "The most capable Berry Book yet — built for video, code, and everything that needs real sustained performance, without ever plugging in a fan.",
    specs: [
      { label: "Display", value: "16.2\" Liquid Retina XDR" },
      { label: "Chip", value: "B4 Pro / B4 Max" },
      { label: "Battery", value: "Up to 22 hours" },
      { label: "Memory", value: "Up to 48GB unified" },
      { label: "Ports", value: "3x Thunderbolt 5, HDMI, SD" },
    ],
  },
  {
    id: "berry-desktop-studio",
    name: "Berry Studio Desktop",
    category: "computers",
    price: 1999,
    originalPrice: null,
    tag: null,
    rating: 4.7,
    reviews: 54,
    colors: ["#C6C7CC"],
    variants: ["512GB", "1TB", "2TB"],
    image: macImages2,
    description:
      "Compact enough for any desk, powerful enough for the studio — built for creators who move between video, design, and code all day.",
    specs: [
      { label: "Chip", value: "B4 Max, 16-core CPU" },
      { label: "Memory", value: "Up to 64GB unified" },
      { label: "Ports", value: "6x Thunderbolt, 10GbE" },
      { label: "Cooling", value: "Dual blower, near-silent" },
      { label: "Size", value: "19.7 x 19.7 x 9.5 cm" },
    ],
  },

  // Wearables & Accessories
  {
    id: "berry-watch-ultra",
    name: "Berry Watch Ultra",
    category: "wearables",
    price: 799,
    originalPrice: null,
    tag: "New",
    rating: 4.8,
    reviews: 143,
    colors: ["#1D1D1F", "#E3D9C6"],
    variants: ["49mm"],
    image: wearImages,
    description:
      "Titanium-cased and built for the edge cases — depth, altitude, and multi-day battery life, without giving up everyday polish.",
    specs: [
      { label: "Case", value: "49mm titanium" },
      { label: "Display", value: "3000 nit always-on retina" },
      { label: "Battery", value: "Up to 72 hours" },
      { label: "Water resistance", value: "100m, EN13319" },
      { label: "Sensors", value: "Dual-frequency GPS, depth" },
    ],
  },
  {
    id: "berry-watch-se",
    name: "Berry Watch SE",
    category: "wearables",
    price: 279,
    originalPrice: 329,
    tag: "Sale",
    rating: 4.5,
    reviews: 201,
    colors: ["#1D1D1F", "#3A5DFF", "#F5F5F7"],
    variants: ["40mm", "44mm"],
    image: wearImages1,
    description:
      "Everything you need to start tracking your day — activity, sleep, and notifications, in the lightest Berry Watch case.",
    specs: [
      { label: "Case", value: "Aluminum, 40mm / 44mm" },
      { label: "Display", value: "Retina LTPO OLED" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Water resistance", value: "50m" },
      { label: "Sensors", value: "Heart rate, accelerometer" },
    ],
  },
  {
    id: "berry-buds-pro",
    name: "Berry Buds Pro",
    category: "wearables",
    price: 249,
    originalPrice: null,
    tag: "New",
    rating: 4.7,
    reviews: 176,
    colors: ["#1D1D1F", "#F5F5F7"],
    variants: ["Standard"],
    image: wearImages2,
    description:
      "Adaptive noise cancellation that adjusts to your environment in real time, with a case that charges as fast as you can grab it.",
    specs: [
      { label: "Noise cancelling", value: "Adaptive ANC + transparency" },
      { label: "Battery", value: "6h buds, 30h with case" },
      { label: "Chip", value: "Berry H3 audio chip" },
      { label: "Water resistance", value: "IPX4" },
      { label: "Charging", value: "USB-C, wireless" },
    ],
  },
  {
    id: "berry-band",
    name: "Berry Head Pods",
    category: "wearables",
    price: 89,
    originalPrice: null,
    tag: null,
    rating: 4.2,
    reviews: 68,
    colors: ["#1D1D1F", "#FF6F9C", "#3A5DFF"],
    variants: ["Small/Medium", "Medium/Large"],
    image: wearImages3,
    description:
      "A light, all-week fitness band with sleep tracking and heart-rate monitoring, for people who don't want another screen on their wrist.",
    specs: [
      { label: "Display", value: "AMOLED, always-on option" },
      { label: "Battery", value: "Up to 14 days" },
      { label: "Water resistance", value: "5 ATM" },
      { label: "Tracking", value: "Heart rate, SpO2, sleep" },
      { label: "Compatibility", value: "iOS & Android" },
    ],
  },
];

export const products = productCatalog.map((product) => ({
  ...product,
  colors: ensureProductColors(product.colors),
}));

export const getProduct = (id) => products.find((p) => p.id === id);

export const getRelated = (product, count = 4) =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);

export const newArrivals = products.filter((p) => p.tag === "New").slice(0, 8);
