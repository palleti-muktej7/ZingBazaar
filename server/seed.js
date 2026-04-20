/**
 * Seed script — generates products / restaurants / fashion items
 * matching the frontend's mock-data shapes.
 *
 * Run: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const Restaurant = require("./models/Restaurant");
const FashionItem = require("./models/FashionItem");

const img = (seed, w = 800, h = 800) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const productTitles = [
  "Wireless Noise-Cancelling Headphones", "Smart Espresso Machine",
  "Ergonomic Mesh Office Chair", "Ultra-thin Mechanical Keyboard",
  "4K HDR Streaming Stick", "Linen Throw Blanket",
  "Stainless Steel Cookware Set", "Aroma Diffuser Lamp",
  "Wireless Charging Pad", "Hardcover Notebook Set",
  "Bluetooth Bookshelf Speakers", "Memory Foam Pillow",
  "Air Purifier with HEPA", "Compact Robot Vacuum",
  "LED Desk Lamp", "Glass Water Bottle",
  "Cast-Iron Skillet", "Ceramic Pour-Over Kettle",
];
const productBrands = ["Nimbus", "Aurora", "Helix", "Kavi", "Orbit", "Lumen"];
const productCats = ["Electronics", "Home", "Books", "Beauty", "Toys", "Sports"];

const fashionTitles = [
  "Relaxed Linen Shirt", "Tailored Wool Trousers", "Cropped Denim Jacket",
  "Silk Slip Dress", "Court Sneakers", "Cashmere Crewneck",
  "Pleated Midi Skirt", "Performance Joggers", "Oversized Tee",
  "Leather Belt", "Suede Loafers", "Hooded Parka",
  "Knit Cardigan", "Pleated Trousers", "Tencel Shirt Dress",
  "Running Shorts", "Velvet Blazer", "Flannel Overshirt",
];
const fashionBrands = ["Maison K", "ROHE", "Atelier 9", "North & Co.", "Studio Lume", "Verde"];
const fashionCats = ["Men", "Women", "Kids", "Sports", "Beauty"];

const restaurantNames = [
  "Saffron Lane", "Tokyo Bowl", "Pizzeria Lume", "The Burger Atelier",
  "Curry Republic", "Noodle Nest", "Tandoor & Co.", "Green Fork",
  "Smoke House", "Sweet Crust",
];
const cuisinesList = [
  ["Indian", "Mughlai"], ["Japanese", "Sushi"], ["Italian", "Pizza"],
  ["American", "Burgers"], ["Indian", "South Indian"], ["Chinese", "Pan-Asian"],
  ["North Indian", "Tandoor"], ["Healthy", "Salads"], ["BBQ", "Grills"],
  ["Bakery", "Desserts"],
];

async function seed() {
  await connectDB();
  console.log("🧹 Clearing existing data...");
  await Promise.all([
    Product.deleteMany({}),
    Restaurant.deleteMany({}),
    FashionItem.deleteMany({}),
  ]);

  console.log("🛒 Seeding products...");
  const products = productTitles.map((title, i) => {
    const price = 1499 + ((i * 317) % 9000);
    const isDeal = i < 6;
    return {
      name: title,
      brand: productBrands[i % productBrands.length],
      category: productCats[i % productCats.length],
      price,
      originalPrice: Math.round(price * 1.4),
      discount: 28,
      images: [img(`shop-${i}`), img(`shop-${i}-a`), img(`shop-${i}-b`)],
      rating: 3.6 + ((i * 13) % 14) / 10,
      numReviews: 120 + ((i * 47) % 4000),
      stock: 50 + (i % 30),
      description:
        "A thoughtfully designed product that blends form and function. Crafted from premium materials and engineered for daily delight.",
      isFeatured: i < 4,
      isDeal,
      dealEndsAt: isDeal ? new Date(Date.now() + 24 * 3600 * 1000) : undefined,
    };
  });
  await Product.insertMany(products);

  console.log("🍔 Seeding restaurants...");
  const restaurants = restaurantNames.map((name, i) => ({
    name,
    image: img(`food-${i}`, 900, 600),
    cuisine: cuisinesList[i],
    rating: 3.9 + ((i * 11) % 11) / 10,
    deliveryTime: `${20 + (i % 4) * 5}-${30 + (i % 4) * 5} min`,
    priceForTwo: 300 + (i % 6) * 100,
    offers: [i % 2 === 0 ? "50% OFF up to ₹100" : "Free delivery"],
    category: cuisinesList[i][0].toLowerCase(),
    isDeal: i % 3 === 0,
    menu: [
      {
        category: "Recommended",
        items: ["House Special", "Chef's Pick", "Signature Bowl", "Classic Combo"].map((n, j) => ({
          name: n,
          price: 199 + j * 60,
          isVeg: j % 2 === 0,
          description: "A house favorite with seasonal ingredients.",
          image: img(`food-${i}-rec-${j}`, 400, 400),
        })),
      },
      {
        category: "Mains",
        items: ["Spice Route", "Garden Plate", "Smoked Slab", "Noodle Wok", "Tandoor Trio"].map((n, j) => ({
          name: n,
          price: 249 + j * 50,
          isVeg: j % 3 !== 0,
          description: "Bold, generous, and made to share.",
          image: img(`food-${i}-main-${j}`, 400, 400),
        })),
      },
      {
        category: "Desserts",
        items: ["Molten Cake", "Saffron Kulfi", "Berry Pavlova"].map((n, j) => ({
          name: n,
          price: 149 + j * 40,
          isVeg: true,
          description: "Sweet finish, lovingly plated.",
          image: img(`food-${i}-des-${j}`, 400, 400),
        })),
      },
    ],
  }));
  await Restaurant.insertMany(restaurants);

  console.log("👗 Seeding fashion items...");
  const fashion = fashionTitles.map((title, i) => {
    const price = 899 + ((i * 251) % 6000);
    return {
      name: title,
      brand: fashionBrands[i % fashionBrands.length],
      category: fashionCats[i % fashionCats.length],
      price,
      originalPrice: Math.round(price * 1.6),
      discount: 38,
      images: [
        img(`style-${i}`, 700, 900),
        img(`style-${i}-a`, 700, 900),
        img(`style-${i}-b`, 700, 900),
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Ink", "Cream", "Olive", "Crimson"],
      description: "Modern essentials with a quiet, considered point of view.",
      rating: 4 + ((i * 7) % 10) / 10,
      numReviews: 50 + (i * 17) % 800,
      stock: 80,
      isDeal: i % 4 === 0,
    };
  });
  await FashionItem.insertMany(fashion);

  console.log(`✅ Done. ${products.length} products, ${restaurants.length} restaurants, ${fashion.length} fashion items.`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
