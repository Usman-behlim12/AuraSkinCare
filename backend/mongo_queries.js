// ==============================================================================
// Aura Skincare — MongoDB Shell (mongosh) Queries
// Copy and Paste these queries directly into your open mongosh terminal:
// ==============================================================================

// 1. Switch to Aura Skincare Database:
use aura_skincare;

// 2. Drop existing collections to start fresh:
db.orders.drop();
db.products.drop();

// 3. Insert Aura Skincare Orders:
db.orders.insertMany([
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
]);

// 4. Insert Aura Skincare Products:
db.products.insertMany([
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
]);

// 5. Verify the data:
print("Total Orders in MongoDB:");
db.orders.countDocuments();

print("Total Products in MongoDB:");
db.products.countDocuments();

// 6. View all products:
db.products.find({}, { name: 1, formatted_price: 1, category: 1, _id: 0 }).pretty();
