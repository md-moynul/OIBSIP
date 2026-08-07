const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const defaultInventory = [
  // Bases
  { name: "Thin Crust", category: "base", quantity: 100, unit: "pcs", minThreshold: 10, price: 0, createdAt: new Date(), updatedAt: new Date() },
  { name: "Classic Hand-Tossed", category: "base", quantity: 100, unit: "pcs", minThreshold: 10, price: 0, createdAt: new Date(), updatedAt: new Date() },
  { name: "Deep Dish", category: "base", quantity: 50, unit: "pcs", minThreshold: 10, price: 60, createdAt: new Date(), updatedAt: new Date() },
  { name: "Whole Wheat", category: "base", quantity: 80, unit: "pcs", minThreshold: 10, price: 30, createdAt: new Date(), updatedAt: new Date() },
  { name: "Cheese Burst", category: "base", quantity: 60, unit: "pcs", minThreshold: 10, price: 90, createdAt: new Date(), updatedAt: new Date() },

  // Sauces
  { name: "Classic Tomato", category: "sauce", quantity: 50, unit: "L", minThreshold: 5, price: 0, createdAt: new Date(), updatedAt: new Date() },
  { name: "BBQ", category: "sauce", quantity: 30, unit: "L", minThreshold: 5, price: 20, createdAt: new Date(), updatedAt: new Date() },
  { name: "Alfredo (White Sauce)", category: "sauce", quantity: 25, unit: "L", minThreshold: 5, price: 30, createdAt: new Date(), updatedAt: new Date() },
  { name: "Pesto", category: "sauce", quantity: 20, unit: "L", minThreshold: 5, price: 35, createdAt: new Date(), updatedAt: new Date() },
  { name: "Spicy Peri-Peri", category: "sauce", quantity: 35, unit: "L", minThreshold: 5, price: 25, createdAt: new Date(), updatedAt: new Date() },

  // Cheeses
  { name: "Mozzarella", category: "cheese", quantity: 40, unit: "kg", minThreshold: 5, price: 0, createdAt: new Date(), updatedAt: new Date() },
  { name: "Cheddar", category: "cheese", quantity: 30, unit: "kg", minThreshold: 5, price: 20, createdAt: new Date(), updatedAt: new Date() },
  { name: "Parmesan", category: "cheese", quantity: 20, unit: "kg", minThreshold: 5, price: 40, createdAt: new Date(), updatedAt: new Date() },
  { name: "Vegan Cheese", category: "cheese", quantity: 15, unit: "kg", minThreshold: 2, price: 50, createdAt: new Date(), updatedAt: new Date() },
  { name: "Four Cheese Blend", category: "cheese", quantity: 25, unit: "kg", minThreshold: 5, price: 80, createdAt: new Date(), updatedAt: new Date() },

  // Toppings (Vegetables & Meats)
  { name: "Onion", category: "topping", quantity: 50, unit: "kg", minThreshold: 10, price: 10, createdAt: new Date(), updatedAt: new Date() },
  { name: "Capsicum", category: "topping", quantity: 30, unit: "kg", minThreshold: 5, price: 10, createdAt: new Date(), updatedAt: new Date() },
  { name: "Mushroom", category: "topping", quantity: 25, unit: "kg", minThreshold: 5, price: 20, createdAt: new Date(), updatedAt: new Date() },
  { name: "Olives", category: "topping", quantity: 15, unit: "kg", minThreshold: 3, price: 20, createdAt: new Date(), updatedAt: new Date() },
  { name: "Corn", category: "topping", quantity: 20, unit: "kg", minThreshold: 5, price: 15, createdAt: new Date(), updatedAt: new Date() },
  { name: "Jalapeño", category: "topping", quantity: 15, unit: "kg", minThreshold: 3, price: 15, createdAt: new Date(), updatedAt: new Date() },
  { name: "Tomato", category: "topping", quantity: 40, unit: "kg", minThreshold: 10, price: 10, createdAt: new Date(), updatedAt: new Date() },
  { name: "Spinach", category: "topping", quantity: 20, unit: "kg", minThreshold: 5, price: 15, createdAt: new Date(), updatedAt: new Date() },
  
  { name: "Pepperoni", category: "topping", quantity: 30, unit: "kg", minThreshold: 5, price: 40, createdAt: new Date(), updatedAt: new Date() },
  { name: "Chicken Sausage", category: "topping", quantity: 25, unit: "kg", minThreshold: 5, price: 35, createdAt: new Date(), updatedAt: new Date() },
  { name: "Grilled Chicken", category: "topping", quantity: 35, unit: "kg", minThreshold: 5, price: 45, createdAt: new Date(), updatedAt: new Date() },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db("pizzapoint-db");
    const inventoryCollection = db.collection("inventory");
    
    // Clear existing inventory to avoid duplicates (optional, but good for a fresh start)
    await inventoryCollection.deleteMany({});
    
    const result = await inventoryCollection.insertMany(defaultInventory);
    console.log(`Successfully inserted ${result.insertedCount} inventory items!`);
  } catch (err) {
    console.error("Error seeding inventory:", err);
  } finally {
    await client.close();
  }
}

seed();
