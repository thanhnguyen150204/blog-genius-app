const STORAGE_KEY = "bloggenius_image_library";

export const INITIAL_IMAGE_LIBRARY = [
  {
    id: "img-1",
    filename: "Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg",
    title: "Liquid Board Gear",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:00:00Z",
  },
  {
    id: "img-2",
    filename: "Picture1-1791291642914.png",
    title: "SEO Ranking Chart",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:05:00Z",
  },
  {
    id: "img-3",
    filename: "1786981692487215689799304799269892308752-1791291655117.jpg",
    title: "Handwritten Signature Note",
    url: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:10:00Z",
  },
  {
    id: "img-4",
    filename: "29dda851640537764f78bbdb53e22b85-1791291680442.jpg",
    title: "Cat Outdoors Grass",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:15:00Z",
  },
  {
    id: "img-5",
    filename: "29dda851640537764f78bbdb53e22b85-1791291755059.jpg",
    title: "Cat Portrait Close Up",
    url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:20:00Z",
  },
  {
    id: "img-6",
    filename: "VietNamvchimage-1791291893725.png",
    title: "Vietnam Champions Festival",
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:25:00Z",
  },
  {
    id: "img-7",
    filename: "postoftestimage-1791293027873.png",
    title: "Lake Bird on Wooden Post",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:30:00Z",
  },
  {
    id: "img-8",
    filename: "ecommerce-product-leather-bag.jpg",
    title: "Premium Leather Backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    uploadedAt: "2026-10-06T13:35:00Z",
  },
];

export function getImageLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read image library from localStorage:", e);
  }
  return INITIAL_IMAGE_LIBRARY;
}

export function addImageToLibrary({ url, filename, title }) {
  try {
    const current = getImageLibrary();
    const cleanFilename =
      filename ||
      url.split("/").pop()?.split("?")[0] ||
      `upload-${Date.now()}.png`;

    const newImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      filename: cleanFilename,
      title: title || cleanFilename,
      url,
      uploadedAt: new Date().toISOString(),
    };

    // Avoid duplicate URLs at top
    const filtered = current.filter((item) => item.url !== url);
    const updated = [newImage, ...filtered];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newImage;
  } catch (e) {
    console.error("Failed to save image to library in localStorage:", e);
    return null;
  }
}

export function getRandomLibraryImage() {
  const list = getImageLibrary();
  if (!list.length) return INITIAL_IMAGE_LIBRARY[0];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}
