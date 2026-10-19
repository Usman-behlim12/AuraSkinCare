import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_skincare';

export const INITIAL_ORDERS = [
  {
    order_id: "ORD-101",
    customer: "Priya Sharma",
    product: "Vitamin C Serum (30ml)",
    value: 699,
    formatted_value: "₹699",
    status: "Out for Delivery",
    courier: "BlueDart",
    tracking_number: "BD-982103",
    notes: "BlueDart — BD-982103. Expected by 6 PM today.",
    delivered_days_ago: null,
    is_cancellable: false,
    cancellation_note: "Cannot be cancelled as it is Out for Delivery. Customer may refuse delivery at doorstep."
  },
  {
    order_id: "ORD-102",
    customer: "Rahul Verma",
    product: "Hydrating Sunscreen SPF 50",
    value: 499,
    formatted_value: "₹499",
    status: "Delivered",
    courier: "Delhivery",
    tracking_number: "DL-441029",
    notes: "Delhivery — DL-441029. Delivered 14 days ago.",
    delivered_days_ago: 14,
    is_cancellable: false,
    cancellation_note: "Already delivered."
  },
  {
    order_id: "ORD-103",
    customer: "Ananya Patel",
    product: "Green Tea Face Wash + Toner",
    value: 850,
    formatted_value: "₹850",
    status: "Processing",
    courier: "Pending Allocation",
    tracking_number: "TBD",
    notes: "Ordered 3 hours ago. Eligible for cancellation.",
    delivered_days_ago: null,
    is_cancellable: true,
    cancellation_note: "Eligible for immediate cancellation."
  }
];

export const INITIAL_PRODUCTS = [
  {
    product_id: "PROD-001",
    name: "Vitamin C Serum (30ml)",
    category: "Serums & Treatments",
    price: 699,
    formatted_price: "₹699",
    description: "Pure organic botanical Vitamin C serum enriched with Kakadu plum and hyaluronic acid for radiant, glowing skin and dark spot reduction.",
    key_ingredients: ["Kakadu Plum", "15% L-Ascorbic Acid", "Hyaluronic Acid", "Ferulic Acid"],
    in_stock: true
  },
  {
    product_id: "PROD-002",
    name: "Hydrating Sunscreen SPF 50 (50ml)",
    category: "Sun Protection",
    price: 499,
    formatted_price: "₹499",
    description: "Lightweight, non-greasy matte finish sunscreen formulated with organic aloe and niacinamide, designed specifically for Indian climate with zero white cast.",
    key_ingredients: ["Zinc Oxide", "Organic Aloe Vera", "Niacinamide", "Vitamin E"],
    in_stock: true
  },
  {
    product_id: "PROD-003",
    name: "Green Tea Face Wash + Toner Combo",
    category: "Cleansers & Toners",
    price: 850,
    formatted_price: "₹850",
    description: "Gentle foaming cleanser and alcohol-free clarifying toner infused with organic green tea and witch hazel to unclog pores and balance natural oils.",
    key_ingredients: ["Organic Green Tea", "Tea Tree Oil", "Witch Hazel", "Salicylic Acid"],
    in_stock: true
  },
  {
    product_id: "PROD-004",
    name: "Kumkumadi Radiance Night Facial Oil (20ml)",
    category: "Facial Oils",
    price: 799,
    formatted_price: "₹799",
    description: "Traditional Ayurvedic beauty elixir infused with pure Kashmiri saffron and sandalwood to rejuvenate dull skin and impart a luminous golden glow overnight.",
    key_ingredients: ["Kashmiri Saffron", "Red Sandalwood", "Manjistha", "Cold-Pressed Almond Oil"],
    in_stock: true
  },
  {
    product_id: "PROD-005",
    name: "Ceramide Barrier Repair Moisturizer (50g)",
    category: "Moisturizers",
    price: 599,
    formatted_price: "₹599",
    description: "Intense 24-hour hydration cream fortified with 5 essential ceramides and Centella Asiatica to restore damaged skin barriers and calm irritation.",
    key_ingredients: ["Ceramide Complex", "Centella Asiatica (Cica)", "Shea Butter", "Oat Extract"],
    in_stock: true
  }
];

export async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    // Seed Orders
    await Order.deleteMany({});
    const ordersCreated = await Order.insertMany(INITIAL_ORDERS);
    console.log(`✅ Seeded ${ordersCreated.length} orders into MongoDB.`);

    // Seed Products
    await Product.deleteMany({});
    const productsCreated = await Product.insertMany(INITIAL_PRODUCTS);
    console.log(`✅ Seeded ${productsCreated.length} products into MongoDB:`);
    productsCreated.forEach(p => console.log(`   - [${p.product_id}] ${p.name} (${p.formatted_price})`));

    await mongoose.disconnect();
    console.log('MongoDB seed completed successfully.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

// Run directly if called via node
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
