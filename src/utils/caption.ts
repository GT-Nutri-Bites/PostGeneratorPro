import type { Product } from "@/data/types";

const HASHTAGS: Record<string, string> = {
  nuts: "#almonds #nuts #healthysnacks #organicnuts #premium",
  seeds: "#seeds #healthyfood #superfood #nutrients #wellness",
  dried_fruits: "#driedfruits #healthysnack #natural #organic",
  mix: "#mixednuts #healthy #snack #premium #organic",
};

export function generateCaption(
  product: Product,
  price: number,
  weight: string,
  website: string,
  company: string,
  platform: string,
  tone: string
): string {
  const ht = HASHTAGS[product.type] || "#healthyfood #natural #organic";
  const companyTag = `#${company.replace(/\s+/g, "").toLowerCase()}`;
  const benefits = product.benefits
    .slice(0, 3)
    .map((b) => `• ${b}`)
    .join("\n");

  const useHashtags = platform !== "whatsapp";
  const hashtagBlock = useHashtags
    ? `\n\n${ht} ${companyTag} #srilanka #nutrisri`
    : "";

  if (tone === "friendly") {
    return `Hey there! 👋 Looking for a healthy snack? 🌟\n\n${product.name} is here! 🥳\n\n${product.description}\n\nWhy you'll love it:\n${benefits}\n\n💰 Just Rs. ${price.toLocaleString()} / ${weight}\n\n🛒 Grab yours: ${website}\n📦 Island-wide delivery${hashtagBlock}`;
  }
  if (tone === "promotional") {
    return `🔥 LIMITED TIME OFFER! 🔥\n\n${product.name}\n\n${product.description}\n\n✅ Benefits:\n${benefits}\n\n💥 Special Price: Rs. ${price.toLocaleString()} / ${weight}\nDon't miss out! Order NOW 👇\n🛒 ${website}\n📦 Fast Delivery Island-wide${hashtagBlock}`;
  }
  // professional (default)
  return `✨ ${product.name} — Now Available!\n\n${product.description}\n\n🌟 Key Benefits:\n${benefits}\n\n💰 Price: Rs. ${price.toLocaleString()} / ${weight}\n\n🛒 Order Now: ${website}\n📦 Fast Delivery Island-wide${hashtagBlock}`;
}
