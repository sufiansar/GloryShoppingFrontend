// utils/brand-slug-mapping.ts
// This maps URL slugs to brand names and IDs

interface BrandMapping {
  name: string;
  id?: string; // This will be populated from API response
  logo?: string;
}

const BRAND_SLUG_MAPPING: Record<string, BrandMapping> = {
  abib: { name: "Abib" },
  acwell: { name: "Acwell" },
  anua: { name: "Anua" },
  aplb: { name: "APLB" },
  aromatica: { name: "Aromatica" },
  "axis-y": { name: "Axis-Y" },
  "banila-co": { name: "Banila Co." },
  "beauty-of-joseon": { name: "Beauty of Joseon" },
  benton: { name: "Benton" },
  bonajour: { name: "Bonajour" },
  "cos-de-baha": { name: "Cos de Baha" },
  torriden: { name: "Torriden" },
  "haruharu-wonder": { name: "HaruHaru Wonder" },
  nineless: { name: "Nineless" },
  apieu: { name: "A'PIEU" },
  nacific: { name: "Nacific" },
  medicube: { name: "Medicube" },
  cosrx: { name: "Cosrx" },
  "etude-house": { name: "Etude House" },
  heimish: { name: "Heimish" },
  innisfree: { name: "Innisfree" },
  isntree: { name: "ISNTREE" },
  illyoon: { name: "Illyoon" },
  iunik: { name: "Iunik" },
  jumiso: { name: "Jumiso" },
  "pyunkang-yul": { name: "Pyunkang Yul" },
  goodal: { name: "Goodal" },
  "dear-klairs": { name: "Dear Klairs" },
  "b-lab": { name: "B.Lab" },
  "skin-miso": { name: "Skin Miso" },
  "dr-ceuracle": { name: "Dr. Ceuracle" },
  "japanese-cosmetics": { name: "Japanese Cosmetics" },
  vt: { name: "VT" },
  laneige: { name: "Laneige" },
  missha: { name: "Missha" },
  mielle: { name: "Mielle" },
  neutrogena: { name: "Neutrogena" },
  numbuzin: { name: "Numbuzin" },
  panoxyl: { name: "Panoxyl" },
  "paulas-choice": { name: "Paula's Choice" },
  purito: { name: "Purito" },
  "round-lab": { name: "Round Lab" },
  karine: { name: "Karine" },
  "be-the-skin": { name: "Be the Skin" },
  bioderma: { name: "Bioderma" },
  "mary-and-may": { name: "Mary & May" },
  "the-derma-co": { name: "The Derma Co" },
  simple: { name: "Simple" },
  "dr-forhair": { name: "Dr.ForHair" },
  "some-by-mi": { name: "Some By Mi" },
  skin1004: { name: "Skin1004" },
  tiam: { name: "Tiam" },
  tocobo: { name: "Tocobo" },
  "3w-clinic": { name: "3w Clinic" },
  "the-face-shop": { name: "The Face Shop" },
  "the-inkey-list": { name: "The Inkey List" },
  "the-ordinary": { name: "The Ordinary" },
  "cera-ve": { name: "Cera Ve" },
  garnier: { name: "Garnier" },
  "i-am-from": { name: "I am From" },
  belief: { name: "Belief" },
  mixsoon: { name: "Mixsoon" },
  tirtir: { name: "TIRTIR" },
  "dr-althea": { name: "Dr. Althea" },
};

// Helper functions
export function getBrandNameFromSlug(slug: string): string {
  const mapping = BRAND_SLUG_MAPPING[slug];
  if (mapping) return mapping.name;

  // Fallback: convert slug to readable name
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\./g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSlugFromBrandName(brandName: string): string {
  // Find the slug for this brand name
  const entry = Object.entries(BRAND_SLUG_MAPPING).find(
    ([_, value]) => value.name === brandName,
  );

  if (entry) return entry[0];

  // Fallback: convert brand name to slug
  return brandName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();
}

export function getAllBrandSlugs(): string[] {
  return Object.keys(BRAND_SLUG_MAPPING);
}

export function updateBrandMappingWithApiData(brandsFromApi: any[]) {
  // Update our mapping with IDs from the API
  brandsFromApi.forEach((brand) => {
    const slug = getSlugFromBrandName(brand.name);
    if (BRAND_SLUG_MAPPING[slug]) {
      BRAND_SLUG_MAPPING[slug].id = brand.id;
      BRAND_SLUG_MAPPING[slug].logo = brand.logo;
    } else {
      // Add new brand if not in mapping
      BRAND_SLUG_MAPPING[slug] = {
        name: brand.name,
        id: brand.id,
        logo: brand.logo,
      };
    }
  });
}

export function getBrandIdFromSlug(slug: string): string | null {
  return BRAND_SLUG_MAPPING[slug]?.id || null;
}

export function getBrandInfoFromSlug(slug: string): BrandMapping | null {
  return BRAND_SLUG_MAPPING[slug] || null;
}
