"use client";

import { useState, useCallback } from "react";
import type { Product, ProductData } from "@/data/types";
import productsJson from "@/data/products.json";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostPreview from "@/components/PostPreview";
import ThumbGrid from "@/components/ThumbGrid";
import LoadingOverlay from "@/components/LoadingOverlay";
import Toast from "@/components/Toast";

const data = productsJson as ProductData;

const tmplNames = [
  "",
  "Golden Harvest",
  "Forest Fresh",
  "Sunset Spice",
  "Midnight Luxury",
  "Tropical Burst",
];

export default function Home() {
  const [product, setProduct] = useState<Product>(data.products[0]);
  const [weight, setWeight] = useState("100g");
  const [tmpl, setTmpl] = useState(1);
  const [companyName, setCompanyName] = useState("GT Nutri Bites");
  const [websiteUrl, setWebsiteUrl] = useState("gt-nutri-bites.github.io");
  const [tagline, setTagline] = useState("Fresh. Nutritious. Delicious.");
  const [showNutrition, setShowNutrition] = useState(true);
  const [showBenefits, setShowBenefits] = useState(true);
  const [showOldPrice, setShowOldPrice] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [postFormat, setPostFormat] = useState<"square" | "story">("square");
  const [platform, setPlatform] = useState("instagram");
  const [captionTone, setCaptionTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  }, []);

  const selectProduct = useCallback((p: Product) => {
    setProduct(p);
  }, []);

  // Price computation
  const price =
    product.weightVariants && product.weightVariants[weight]
      ? product.weightVariants[weight].price
      : product.price;
  const oldPrice =
    product.weightVariants && product.weightVariants[weight]
      ? product.weightVariants[weight].oldPrice
      : product.oldPrice;
  const saving = oldPrice - price;

  // Available weights for selected product
  const availableWeights = product.weightVariants
    ? Object.keys(product.weightVariants)
    : data.weightOptions;

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Toast show={toast.show} message={toast.message} />
      <Header />

      <div
        className="layout"
        style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}
      >
        <Sidebar
          products={data.products}
          selectedProduct={product}
          onSelectProduct={selectProduct}
          weight={weight}
          onSelectWeight={setWeight}
          availableWeights={availableWeights}
          tmpl={tmpl}
          onSelectTmpl={setTmpl}
          tmplNames={tmplNames}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          websiteUrl={websiteUrl}
          onWebsiteUrlChange={setWebsiteUrl}
          tagline={tagline}
          onTaglineChange={setTagline}
          showNutrition={showNutrition}
          onShowNutritionChange={setShowNutrition}
          showBenefits={showBenefits}
          onShowBenefitsChange={setShowBenefits}
          showOldPrice={showOldPrice}
          onShowOldPriceChange={setShowOldPrice}
          showQR={showQR}
          onShowQRChange={setShowQR}
          postFormat={postFormat}
          onPostFormatChange={setPostFormat}
          platform={platform}
          onPlatformChange={setPlatform}
          captionTone={captionTone}
          onCaptionToneChange={setCaptionTone}
          setLoading={setLoading}
          showToast={showToast}
          product={product}
          price={price}
          oldPrice={oldPrice}
          saving={saving}
        />

        <PostPreview
          product={product}
          weight={weight}
          tmpl={tmpl}
          companyName={companyName}
          websiteUrl={websiteUrl}
          tagline={tagline}
          showNutrition={showNutrition}
          showBenefits={showBenefits}
          showOldPrice={showOldPrice}
          showQR={showQR}
          price={price}
          oldPrice={oldPrice}
          saving={saving}
          postFormat={postFormat}
          platform={platform}
          captionTone={captionTone}
        />

        <ThumbGrid
          products={data.products}
          selectedProduct={product}
          onSelectProduct={selectProduct}
        />
      </div>
    </>
  );
}

