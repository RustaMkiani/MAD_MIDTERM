    import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

try {
  await mongoose.connect("mongodb+srv://Zagham:8593@zagham.8lz5mgv.mongodb.net/coffee_shop_db?retryWrites=true&w=majority");
  console.log("✅ Connected to MongoDB Atlas");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err);
}

// ✅ Define Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});

const MenuItem = mongoose.model("menu_items", menuSchema);

 async function insertSampleData() {
   const items = [
     { name: "Espresso", category: "Hot Drinks", price: 300 },
     { name: "Cappuccino", category: "Hot Drinks", price: 550 },
     { name: "Latte", category: "Hot Drinks", price: 600 },
     { name: "Iced Coffee", category: "Cold Drinks", price: 500 },
     { name: "Muffin", category: "Pastries", price: 250 },
     { name: "Croissant", category: "Pastries", price: 400, inStock: false },
   ];
   await MenuItem.deleteMany({});
   await MenuItem.insertMany(items);
   console.log("✅ Sample menu data inserted");
 }
 await insertSampleData();

app.get("/", (req, res) => res.send("☕ Coffee Shop API Running"));

app.get("/menu", async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/menu/surprise", async (req, res) => {
  try {
    const inStockItems = await MenuItem.find({ inStock: true });
    const randomItem = inStockItems[Math.floor(Math.random() * inStockItems.length)];
    res.json(randomItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
