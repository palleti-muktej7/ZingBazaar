// Mock catalogs for ShopZone, FoodRush, StyleHub, and Deals.
// Image URLs use loremflickr keyword endpoint with a deterministic lock seed
// so each item gets a unique, name-matched photo (no repeats).

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  gallery: string[];
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  eta: string;
  priceForTwo: number;
  image: string;
  offer?: string;
  menu: { section: string; items: { id: string; name: string; price: number; veg: boolean; desc: string; image?: string }[] }[];
};

export type Fashion = {
  id: string;
  title: string;
  brand: string;
  price: number;
  mrp: number;
  image: string;
  gallery: string[];
  category: "Men" | "Women" | "Kids" | "Sports" | "Beauty";
  sizes: string[];
  colors: string[];
};

export type Deal = {
  id: string;
  title: string;
  source: "ShopZone" | "FoodRush" | "StyleHub";
  image: string;
  price: number;
  mrp: number;
  endsAt: number;
};

const img = (keywords: string, seed: string, w = 800, h = 800) =>
  `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keywords)}?lock=${encodeURIComponent(seed)}`;

// Guaranteed-unique images per seed (used for gallery slots so every angle differs).
// We still hint with keywords by using a hash-blended seed for stability.
const altImg = (seed: string, w = 800, h = 800) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

// ──────────────────────────────────────────────────────────────
// SHOPZONE — expanded catalog with phones, kitchen, bags, gym, etc.
// ──────────────────────────────────────────────────────────────
type RawProduct = { title: string; brand: string; category: string; keywords: string };

const rawProducts: RawProduct[] = [
  // Phones & Mobiles
  { title: "Pro Smartphone 5G 256GB", brand: "Orbit", category: "Phones", keywords: "smartphone,phone,mobile" },
  { title: "Lite Smartphone 128GB", brand: "Helix", category: "Phones", keywords: "phone,android,mobile" },
  { title: "Foldable Phone Ultra", brand: "Nimbus", category: "Phones", keywords: "foldable,phone,smartphone" },
  { title: "Phone Case Leather", brand: "Aurora", category: "Phones", keywords: "phonecase,leather,accessory" },
  { title: "Power Bank 20000mAh", brand: "Helix", category: "Phones", keywords: "powerbank,battery,charger" },
  { title: "USB-C Fast Charger", brand: "Orbit", category: "Phones", keywords: "charger,usbc,cable" },

  // Electronics
  { title: "Wireless Noise-Cancelling Headphones", brand: "Nimbus", category: "Electronics", keywords: "headphones,wireless,audio" },
  { title: "Ultra-thin Mechanical Keyboard", brand: "Kavi", category: "Electronics", keywords: "keyboard,mechanical,computer" },
  { title: "4K HDR Streaming Stick", brand: "Orbit", category: "Electronics", keywords: "tv,streaming,remote" },
  { title: "Wireless Charging Pad", brand: "Helix", category: "Electronics", keywords: "wireless,charger,phone" },
  { title: "Bluetooth Bookshelf Speakers", brand: "Orbit", category: "Electronics", keywords: "speaker,bluetooth,audio" },
  { title: "Smart Fitness Watch", brand: "Orbit", category: "Electronics", keywords: "smartwatch,fitness,wearable" },
  { title: "DSLR Camera Kit", brand: "Nimbus", category: "Electronics", keywords: "camera,dslr,photography" },
  { title: "Gaming Mouse RGB", brand: "Helix", category: "Electronics", keywords: "gaming,mouse,rgb" },
  { title: "Bluetooth Earbuds Pro", brand: "Nimbus", category: "Electronics", keywords: "earbuds,wireless,audio" },
  { title: "Laptop 14\" Slim", brand: "Aurora", category: "Electronics", keywords: "laptop,notebook,computer" },
  { title: "Tablet 11\" Pro", brand: "Orbit", category: "Electronics", keywords: "tablet,ipad,screen" },
  { title: "Smart TV 55\" 4K", brand: "Helix", category: "Electronics", keywords: "smarttv,television,4k" },

  // Kitchen Items
  { title: "Smart Espresso Machine", brand: "Aurora", category: "Kitchen", keywords: "espresso,machine,coffee" },
  { title: "Stainless Steel Cookware Set", brand: "Nimbus", category: "Kitchen", keywords: "cookware,kitchen,pots" },
  { title: "Cast-Iron Skillet", brand: "Orbit", category: "Kitchen", keywords: "skillet,castiron,kitchen" },
  { title: "Ceramic Pour-Over Kettle", brand: "Lumen", category: "Kitchen", keywords: "kettle,pourover,coffee" },
  { title: "Chef's Knife 8\"", brand: "Kavi", category: "Kitchen", keywords: "knife,chef,kitchen" },
  { title: "Digital Air Fryer 5L", brand: "Aurora", category: "Kitchen", keywords: "airfryer,kitchen,appliance" },
  { title: "Hand Blender 800W", brand: "Helix", category: "Kitchen", keywords: "blender,handblender,kitchen" },
  { title: "Glass Storage Jars Set", brand: "Lumen", category: "Kitchen", keywords: "jars,storage,glass" },
  { title: "Bamboo Cutting Board", brand: "Verde", category: "Kitchen", keywords: "cuttingboard,bamboo,kitchen" },
  { title: "Microwave Oven 25L", brand: "Orbit", category: "Kitchen", keywords: "microwave,oven,appliance" },

  // Home
  { title: "Ergonomic Mesh Office Chair", brand: "Helix", category: "Home", keywords: "office,chair,ergonomic" },
  { title: "Linen Throw Blanket", brand: "Lumen", category: "Home", keywords: "blanket,linen,bedroom" },
  { title: "Aroma Diffuser Lamp", brand: "Aurora", category: "Home", keywords: "diffuser,aroma,wellness" },
  { title: "Memory Foam Pillow", brand: "Lumen", category: "Home", keywords: "pillow,bedroom,sleep" },
  { title: "Air Purifier with HEPA", brand: "Nimbus", category: "Home", keywords: "air,purifier,appliance" },
  { title: "Compact Robot Vacuum", brand: "Aurora", category: "Home", keywords: "robot,vacuum,cleaner" },
  { title: "LED Desk Lamp", brand: "Helix", category: "Home", keywords: "desk,lamp,light" },
  { title: "Smart LED Bulb Pack", brand: "Lumen", category: "Home", keywords: "lightbulb,led,smart" },
  { title: "Indoor Plant Pot Set", brand: "Lumen", category: "Home", keywords: "plant,pot,indoor" },
  { title: "Wall Art Canvas Print", brand: "Verde", category: "Home", keywords: "wallart,canvas,decor" },

  // Bags
  { title: "Leather Backpack", brand: "Aurora", category: "Bags", keywords: "backpack,leather,bag" },
  { title: "Travel Duffel 50L", brand: "Helix", category: "Bags", keywords: "duffel,travel,bag" },
  { title: "Laptop Sleeve 15\"", brand: "Kavi", category: "Bags", keywords: "laptopbag,sleeve,case" },
  { title: "Crossbody Sling Bag", brand: "North & Co.", category: "Bags", keywords: "slingbag,crossbody,bag" },
  { title: "Trolley Suitcase 24\"", brand: "Orbit", category: "Bags", keywords: "suitcase,trolley,luggage" },
  { title: "Canvas Tote Bag", brand: "Verde", category: "Bags", keywords: "tote,canvas,bag" },

  // Gym Equipment
  { title: "Adjustable Dumbbells 24kg", brand: "Helix", category: "Gym", keywords: "dumbbell,gym,weights" },
  { title: "Yoga Mat Pro", brand: "Kavi", category: "Gym", keywords: "yogamat,yoga,fitness" },
  { title: "Resistance Bands Set", brand: "Aurora", category: "Gym", keywords: "resistanceband,fitness,gym" },
  { title: "Foldable Treadmill", brand: "Orbit", category: "Gym", keywords: "treadmill,gym,cardio" },
  { title: "Kettlebell 16kg", brand: "Nimbus", category: "Gym", keywords: "kettlebell,gym,weights" },
  { title: "Foam Roller", brand: "Verde", category: "Gym", keywords: "foamroller,recovery,fitness" },
  { title: "Skipping Rope Pro", brand: "Helix", category: "Gym", keywords: "jumprope,skipping,fitness" },

  // Sports
  { title: "Glass Water Bottle", brand: "Kavi", category: "Sports", keywords: "waterbottle,bottle,glass" },
  { title: "Stainless Travel Mug", brand: "Orbit", category: "Sports", keywords: "travelmug,mug,coffee" },
  { title: "Cycling Helmet", brand: "Helix", category: "Sports", keywords: "helmet,cycling,bike" },
  { title: "Football Size 5", brand: "Aurora", category: "Sports", keywords: "football,soccer,ball" },
  { title: "Cricket Bat English Willow", brand: "Verde", category: "Sports", keywords: "cricket,bat,sport" },

  // Books
  { title: "Hardcover Notebook Set", brand: "Kavi", category: "Books", keywords: "notebook,journal,stationery" },
  { title: "Bestseller Novel Bundle", brand: "Kavi", category: "Books", keywords: "books,novel,reading" },
  { title: "Cookbook — Modern Indian", brand: "Verde", category: "Books", keywords: "cookbook,recipes,book" },
  { title: "Self-Help Reading Pack", brand: "Lumen", category: "Books", keywords: "selfhelp,books,reading" },

  // Beauty
  { title: "Skincare Essentials Kit", brand: "Aurora", category: "Beauty", keywords: "skincare,beauty,cosmetics" },
  { title: "Hair Dryer Ionic 1800W", brand: "Helix", category: "Beauty", keywords: "hairdryer,beauty,grooming" },
  { title: "Perfume Eau de Parfum 100ml", brand: "Studio Lume", category: "Beauty", keywords: "perfume,fragrance,bottle" },

  // Toys
  { title: "Building Blocks Mega Set", brand: "Helix", category: "Toys", keywords: "lego,blocks,toys" },
  { title: "Remote Control Car", brand: "Orbit", category: "Toys", keywords: "rccar,toy,car" },
  { title: "Plush Teddy Bear XL", brand: "Verde", category: "Toys", keywords: "teddybear,plush,toy" },
];

export const products: Product[] = rawProducts.map((p, i) => {
  const price = 1499 + ((i * 317) % 9000);
  return {
    id: `p${i + 1}`,
    title: p.title,
    brand: p.brand,
    price,
    mrp: Math.round(price * 1.4),
    rating: 3.6 + ((i * 13) % 14) / 10,
    reviews: 120 + ((i * 47) % 4000),
    image: img(p.keywords, `shop-${i}`),
    category: p.category,
    description:
      "A thoughtfully designed product that blends form and function. Crafted from premium materials and engineered for daily delight.",
    gallery: [
      img(p.keywords, `shop-${i}-front`),
      img(`${p.keywords},detail`, `shop-${i}-detail`),
      img(`${p.keywords},lifestyle`, `shop-${i}-life`),
      img(`${p.keywords},closeup`, `shop-${i}-zoom`),
    ],
  };
});

export const shopCategories = [
  { id: "phones", label: "Phones", image: img("smartphone,phone", "cat-phones") },
  { id: "electronics", label: "Electronics", image: img("electronics,gadgets", "cat-elec") },
  { id: "kitchen", label: "Kitchen", image: img("kitchen,utensils", "cat-kitchen") },
  { id: "home", label: "Home", image: img("home,interior", "cat-home") },
  { id: "bags", label: "Bags", image: img("backpack,bag", "cat-bags") },
  { id: "gym", label: "Gym", image: img("gym,fitness,equipment", "cat-gym") },
  { id: "beauty", label: "Beauty", image: img("beauty,cosmetics", "cat-beauty") },
  { id: "books", label: "Books", image: img("books,library", "cat-books") },
  { id: "toys", label: "Toys", image: img("toys,kids", "cat-toys") },
  { id: "sports", label: "Sports", image: img("sports,fitness", "cat-sports") },
];

export const shopBrands = [
  { name: "Nimbus", logo: img("logo,brand", "brand-nimbus", 200, 200) },
  { name: "Aurora", logo: img("logo,minimal", "brand-aurora", 200, 200) },
  { name: "Helix", logo: img("logo,tech", "brand-helix", 200, 200) },
  { name: "Kavi", logo: img("logo,modern", "brand-kavi", 200, 200) },
  { name: "Orbit", logo: img("logo,space", "brand-orbit", 200, 200) },
  { name: "Lumen", logo: img("logo,light", "brand-lumen", 200, 200) },
  { name: "Verde", logo: img("logo,green", "brand-verde", 200, 200) },
  { name: "North & Co.", logo: img("logo,compass", "brand-north", 200, 200) },
];

// ──────────────────────────────────────────────────────────────
// FOODRUSH
// ──────────────────────────────────────────────────────────────
type RawRestaurant = { name: string; cuisine: string[]; keywords: string };

const rawRestaurants: RawRestaurant[] = [
  { name: "Saffron Lane", cuisine: ["Indian", "Mughlai"], keywords: "indian,curry,biryani" },
  { name: "Tokyo Bowl", cuisine: ["Japanese", "Sushi"], keywords: "sushi,japanese,ramen" },
  { name: "Pizzeria Lume", cuisine: ["Italian", "Pizza"], keywords: "pizza,italian,cheese" },
  { name: "The Burger Atelier", cuisine: ["American", "Burgers"], keywords: "burger,fries,american" },
  { name: "Curry Republic", cuisine: ["Indian", "South Indian"], keywords: "dosa,southindian,curry" },
  { name: "Noodle Nest", cuisine: ["Chinese", "Pan-Asian"], keywords: "noodles,chinese,wok" },
  { name: "Tandoor & Co.", cuisine: ["North Indian", "Tandoor"], keywords: "tandoor,kebab,indian" },
  { name: "Green Fork", cuisine: ["Healthy", "Salads"], keywords: "salad,healthy,bowl" },
  { name: "Smoke House", cuisine: ["BBQ", "Grills"], keywords: "bbq,grill,ribs" },
  { name: "Sweet Crust", cuisine: ["Bakery", "Desserts"], keywords: "bakery,dessert,cake" },
  { name: "Taco Fiesta", cuisine: ["Mexican", "Tacos"], keywords: "taco,mexican,burrito" },
  { name: "Bangkok Street", cuisine: ["Thai", "Street Food"], keywords: "thai,padthai,streetfood" },
  { name: "Pho Saigon", cuisine: ["Vietnamese", "Noodles"], keywords: "pho,vietnamese,noodlesoup" },
  { name: "Mediterraneo", cuisine: ["Mediterranean", "Greek"], keywords: "mediterranean,greek,gyros" },
  { name: "Biryani House", cuisine: ["Hyderabadi", "Biryani"], keywords: "biryani,rice,hyderabadi" },
  { name: "Sushi Zen", cuisine: ["Japanese", "Sushi"], keywords: "sushi,nigiri,japanese" },
  { name: "Pasta Bella", cuisine: ["Italian", "Pasta"], keywords: "pasta,italian,spaghetti" },
  { name: "Wrap & Roll", cuisine: ["Lebanese", "Wraps"], keywords: "shawarma,wrap,lebanese" },
  { name: "Coffee Hub", cuisine: ["Cafe", "Coffee"], keywords: "coffee,latte,cafe" },
  { name: "Ice Cream Island", cuisine: ["Desserts", "Ice Cream"], keywords: "icecream,dessert,scoop" },
];

const dishImg = (n: string, seed: string) => img(n, seed, 400, 400);

export const restaurants: Restaurant[] = rawRestaurants.map((r, i) => ({
  id: `r${i + 1}`,
  name: r.name,
  cuisine: r.cuisine,
  rating: 3.9 + ((i * 11) % 11) / 10,
  eta: `${20 + (i % 4) * 5}-${30 + (i % 4) * 5} min`,
  priceForTwo: 300 + (i % 6) * 100,
  image: img(r.keywords, `food-${i}`, 900, 600),
  offer: i % 2 === 0 ? "50% OFF up to ₹100" : "Free delivery",
  menu: [
    {
      section: "Recommended",
      items: [
        { id: `r${i + 1}-rec-0`, name: "House Special", price: 199, veg: true, desc: "A house favorite with seasonal ingredients.", image: dishImg(r.keywords, `f${i}-r0`) },
        { id: `r${i + 1}-rec-1`, name: "Chef's Pick", price: 259, veg: false, desc: "Hand-picked by the chef this week.", image: dishImg(r.keywords, `f${i}-r1`) },
        { id: `r${i + 1}-rec-2`, name: "Signature Bowl", price: 319, veg: true, desc: "Layered flavors in a single bowl.", image: dishImg(r.keywords, `f${i}-r2`) },
        { id: `r${i + 1}-rec-3`, name: "Classic Combo", price: 379, veg: false, desc: "Best-seller combo plate.", image: dishImg(r.keywords, `f${i}-r3`) },
      ],
    },
    {
      section: "Mains",
      items: [
        { id: `r${i + 1}-main-0`, name: "Spice Route", price: 249, veg: true, desc: "Bold, generous, and made to share.", image: dishImg(r.keywords, `f${i}-m0`) },
        { id: `r${i + 1}-main-1`, name: "Garden Plate", price: 299, veg: true, desc: "Fresh seasonal produce.", image: dishImg("salad,veggies", `f${i}-m1`) },
        { id: `r${i + 1}-main-2`, name: "Smoked Slab", price: 349, veg: false, desc: "Slow-smoked over hardwood.", image: dishImg("grill,bbq", `f${i}-m2`) },
        { id: `r${i + 1}-main-3`, name: "Noodle Wok", price: 399, veg: false, desc: "Wok-tossed with house sauce.", image: dishImg("noodles,wok", `f${i}-m3`) },
        { id: `r${i + 1}-main-4`, name: "Tandoor Trio", price: 449, veg: false, desc: "Three tandoor classics.", image: dishImg("tandoor,kebab", `f${i}-m4`) },
      ],
    },
    {
      section: "Desserts",
      items: [
        { id: `r${i + 1}-des-0`, name: "Molten Cake", price: 149, veg: true, desc: "Warm, gooey, decadent.", image: dishImg("chocolate,cake", `f${i}-d0`) },
        { id: `r${i + 1}-des-1`, name: "Saffron Kulfi", price: 189, veg: true, desc: "Indian frozen dessert.", image: dishImg("kulfi,dessert", `f${i}-d1`) },
        { id: `r${i + 1}-des-2`, name: "Berry Pavlova", price: 229, veg: true, desc: "Crisp meringue, fresh berries.", image: dishImg("pavlova,berries", `f${i}-d2`) },
      ],
    },
  ],
}));

export const foodCategories = [
  { name: "Biryani", img: img("biryani,rice", "fc-biryani", 300, 300) },
  { name: "Pizza", img: img("pizza,cheese", "fc-pizza", 300, 300) },
  { name: "Burgers", img: img("burger,fries", "fc-burger", 300, 300) },
  { name: "Sushi", img: img("sushi,japanese", "fc-sushi", 300, 300) },
  { name: "Healthy", img: img("salad,healthy", "fc-healthy", 300, 300) },
  { name: "Desserts", img: img("dessert,cake", "fc-dessert", 300, 300) },
  { name: "Tandoor", img: img("tandoor,kebab", "fc-tandoor", 300, 300) },
  { name: "Chinese", img: img("noodles,chinese", "fc-chinese", 300, 300) },
  { name: "South Indian", img: img("dosa,idli", "fc-southindian", 300, 300) },
  { name: "Coffee", img: img("coffee,latte", "fc-coffee", 300, 300) },
  { name: "Tacos", img: img("taco,mexican", "fc-tacos", 300, 300) },
  { name: "Ice Cream", img: img("icecream,scoop", "fc-icecream", 300, 300) },
];

// ──────────────────────────────────────────────────────────────
// STYLEHUB — every item gets a UNIQUE keyword combo (no repeats).
// ──────────────────────────────────────────────────────────────
type RawFashion = { title: string; brand: string; category: Fashion["category"]; keywords: string };

const rawFashion: RawFashion[] = [
  // MEN
  { title: "Relaxed Linen Shirt", brand: "Maison K", category: "Men", keywords: "linen,shirt,menswear" },
  { title: "Tailored Wool Trousers", brand: "ROHE", category: "Men", keywords: "wool,trousers,formalwear" },
  { title: "Oversized Cotton Tee", brand: "Atelier 9", category: "Men", keywords: "tshirt,cotton,streetwear" },
  { title: "Brown Leather Belt", brand: "North & Co.", category: "Men", keywords: "leatherbelt,brown,accessory" },
  { title: "Suede Penny Loafers", brand: "Studio Lume", category: "Men", keywords: "loafers,suede,menshoes" },
  { title: "Hooded Down Parka", brand: "Verde", category: "Men", keywords: "parka,winter,jacket" },
  { title: "Flannel Check Overshirt", brand: "Verde", category: "Men", keywords: "flannel,checks,overshirt" },
  { title: "Slim Fit Denim Jeans", brand: "Atelier 9", category: "Men", keywords: "denim,jeans,blue" },
  { title: "Polo T-Shirt Pique", brand: "Maison K", category: "Men", keywords: "polo,pique,collar" },
  { title: "Bomber Jacket Olive", brand: "ROHE", category: "Men", keywords: "bomber,jacket,olive" },
  { title: "Linen Drawstring Shorts", brand: "Verde", category: "Men", keywords: "shorts,linen,summer" },
  { title: "Crew Neck Sweatshirt", brand: "Atelier 9", category: "Men", keywords: "sweatshirt,crewneck,grey" },

  // WOMEN
  { title: "Cropped Denim Jacket", brand: "Atelier 9", category: "Women", keywords: "denimjacket,cropped,women" },
  { title: "Black Silk Slip Dress", brand: "North & Co.", category: "Women", keywords: "slipdress,silk,black" },
  { title: "Cashmere Crewneck Knit", brand: "Verde", category: "Women", keywords: "cashmere,knit,sweater" },
  { title: "Pleated Midi Skirt", brand: "Maison K", category: "Women", keywords: "midiskirt,pleated,beige" },
  { title: "Floral Summer Dress", brand: "Maison K", category: "Women", keywords: "floraldress,summer,sundress" },
  { title: "Wide Leg Pleated Trousers", brand: "ROHE", category: "Women", keywords: "wideleg,trousers,beige" },
  { title: "Tencel Shirt Dress", brand: "Atelier 9", category: "Women", keywords: "shirtdress,tencel,olive" },
  { title: "Velvet Black Blazer", brand: "Studio Lume", category: "Women", keywords: "blazer,velvet,evening" },
  { title: "Classic Beige Trench Coat", brand: "ROHE", category: "Women", keywords: "trenchcoat,beige,outerwear" },
  { title: "Leather Tote Handbag", brand: "North & Co.", category: "Women", keywords: "totebag,leather,handbag" },
  { title: "Knit Long Cardigan", brand: "Maison K", category: "Women", keywords: "cardigan,longknit,beige" },
  { title: "Strappy Heeled Sandals", brand: "Studio Lume", category: "Women", keywords: "sandals,heels,strappy" },
  { title: "Pleated A-line Mini Skirt", brand: "Atelier 9", category: "Women", keywords: "miniskirt,aline,denim" },
  { title: "Striped Boatneck Top", brand: "Verde", category: "Women", keywords: "stripedtop,boatneck,nautical" },
  { title: "Wrap Maxi Dress", brand: "ROHE", category: "Women", keywords: "wrapdress,maxi,floral" },

  // KIDS
  { title: "Kids Hooded Sweatshirt", brand: "Verde", category: "Kids", keywords: "kidshoodie,children,sweatshirt" },
  { title: "Kids Denim Overalls", brand: "Verde", category: "Kids", keywords: "kidsoveralls,denim,children" },
  { title: "Kids Rainbow Tee", brand: "Atelier 9", category: "Kids", keywords: "kidstshirt,rainbow,colorful" },
  { title: "Kids Sneakers Pastel", brand: "Studio Lume", category: "Kids", keywords: "kidssneakers,pastel,shoes" },
  { title: "Kids Puffer Jacket", brand: "Maison K", category: "Kids", keywords: "kidsjacket,puffer,winter" },
  { title: "Kids Pajama Set", brand: "Verde", category: "Kids", keywords: "kidspajamas,sleepwear,cotton" },

  // SPORTS / ATHLEISURE
  { title: "White Court Sneakers", brand: "Studio Lume", category: "Sports", keywords: "sneakers,whiteshoes,court" },
  { title: "Performance Joggers", brand: "ROHE", category: "Sports", keywords: "joggers,athletic,sportswear" },
  { title: "Running Shorts Lite", brand: "North & Co.", category: "Sports", keywords: "runningshorts,athletic,sport" },
  { title: "Yoga Sports Bra", brand: "Verde", category: "Sports", keywords: "sportsbra,yoga,activewear" },
  { title: "Trail Running Shoes", brand: "Helix", category: "Sports", keywords: "runningshoes,trail,athletic" },
  { title: "Compression Leggings", brand: "ROHE", category: "Sports", keywords: "leggings,compression,activewear" },
  { title: "Gym Tank Top Mens", brand: "Atelier 9", category: "Sports", keywords: "tanktop,gym,mens" },
  { title: "Track Jacket Retro", brand: "Studio Lume", category: "Sports", keywords: "trackjacket,retro,sportswear" },

  // BEAUTY / ACCESSORIES
  { title: "Aviator Sunglasses Gold", brand: "Atelier 9", category: "Beauty", keywords: "aviator,sunglasses,gold" },
  { title: "Matte Lipstick Set", brand: "Studio Lume", category: "Beauty", keywords: "lipstick,matte,makeup" },
  { title: "Chronograph Wrist Watch", brand: "North & Co.", category: "Beauty", keywords: "chronograph,wristwatch,steel" },
  { title: "Silk Scarf Floral", brand: "Maison K", category: "Beauty", keywords: "silkscarf,floral,accessory" },
  { title: "Pearl Drop Earrings", brand: "Studio Lume", category: "Beauty", keywords: "pearlearrings,jewelry,drop" },
  { title: "Eau de Parfum 100ml", brand: "ROHE", category: "Beauty", keywords: "perfumebottle,fragrance,glass" },
  { title: "Leather Card Wallet", brand: "North & Co.", category: "Beauty", keywords: "wallet,leather,cardholder" },
];

export const fashion: Fashion[] = rawFashion.map((f, i) => {
  const price = 899 + ((i * 251) % 6000);
  return {
    id: `f${i + 1}`,
    title: f.title,
    brand: f.brand,
    price,
    mrp: Math.round(price * 1.6),
    image: img(f.keywords, `style-${i}`, 700, 900),
    gallery: [
      img(f.keywords, `style-${i}-front`, 700, 900),
      img(`${f.keywords},back`, `style-${i}-back`, 700, 900),
      img(`${f.keywords},detail,fabric`, `style-${i}-detail`, 700, 900),
      img(`${f.keywords},model,portrait`, `style-${i}-model`, 700, 900),
      img(`${f.keywords},lifestyle,street`, `style-${i}-life`, 700, 900),
      img(`${f.keywords},closeup,texture`, `style-${i}-zoom`, 700, 900),
    ],
    category: f.category,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ink", "Cream", "Olive", "Crimson"],
  };
});

export const styleBrands = ["Maison K", "ROHE", "Atelier 9", "North & Co.", "Studio Lume", "Verde"];

export const styleCategories = [
  { name: "T-Shirts", k: "tshirt,cotton" },
  { name: "Shirts", k: "shirt,linen" },
  { name: "Jeans", k: "jeans,denim" },
  { name: "Trousers", k: "trousers,formal" },
  { name: "Dresses", k: "dress,women" },
  { name: "Skirts", k: "skirt,pleated" },
  { name: "Jackets", k: "jacket,outerwear" },
  { name: "Sweaters", k: "sweater,knit" },
  { name: "Sneakers", k: "sneakers,shoes" },
  { name: "Heels", k: "heels,sandals" },
  { name: "Bags", k: "handbag,tote" },
  { name: "Watches", k: "watch,chronograph" },
  { name: "Sunglasses", k: "sunglasses,fashion" },
  { name: "Jewelry", k: "jewelry,earrings" },
  { name: "Activewear", k: "activewear,athleisure" },
  { name: "Innerwear", k: "innerwear,loungewear" },
];

// ──────────────────────────────────────────────────────────────
// DEALS
// ──────────────────────────────────────────────────────────────
const now = Date.now();
export const deals: Deal[] = [
  ...products.slice(0, 8).map((p, i) => ({
    id: `d-shop-${p.id}`,
    title: p.title,
    source: "ShopZone" as const,
    image: p.image,
    price: Math.round(p.price * 0.7),
    mrp: p.mrp,
    endsAt: now + 1000 * 60 * 60 * (3 + i),
  })),
  ...restaurants.slice(0, 6).map((r, i) => ({
    id: `d-food-${r.id}`,
    title: r.name + " — Combo",
    source: "FoodRush" as const,
    image: r.image,
    price: 199 + i * 30,
    mrp: 399 + i * 30,
    endsAt: now + 1000 * 60 * 60 * (1 + i),
  })),
  ...fashion.slice(0, 8).map((f, i) => ({
    id: `d-style-${f.id}`,
    title: f.title,
    source: "StyleHub" as const,
    image: f.image,
    price: Math.round(f.price * 0.6),
    mrp: f.mrp,
    endsAt: now + 1000 * 60 * 60 * (2 + i),
  })),
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
export const findRestaurant = (id: string) => restaurants.find((r) => r.id === id);
export const findFashion = (id: string) => fashion.find((f) => f.id === id);
