import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
};

export default function CoffeeMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [surpriseItem, setSurpriseItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://192.168.100.18:3000/menu");
        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("❌ Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev: MenuItem[]) => [...prev, item]);
  };

  const surpriseMe = () => {
    const inStockItems = menuItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) return;

    const randomItem =
      inStockItems[Math.floor(Math.random() * inStockItems.length)];
    setSurpriseItem(randomItem);
    addToCart(randomItem);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>☕ Coffee Shop Menu</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6F3E18" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={surpriseMe}>
            <Text style={styles.buttonText}>Surprise Me 🎁</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Menu Items:</Text>
          {menuItems.map((item: MenuItem) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.menuButton,
                !item.inStock && styles.outOfStockButton,
              ]}
              onPress={() => addToCart(item)}
              disabled={!item.inStock}
            >
              <Text style={styles.menuButtonText}>
                {item.name} - Rs. {item.price}{" "}
                {!item.inStock && "(Out of Stock)"}
              </Text>
            </TouchableOpacity>
          ))}

          {cart.length > 0 && (
            <View style={styles.cartBox}>
              <Text style={styles.cartTitle}>🛒 Your Cart</Text>
              {cart.map((item: MenuItem, index: number) => (
                <Text key={index} style={styles.cartItem}>
                  {item.name} - Rs. {item.price}
                </Text>
              ))}
            </View>
          )}

          {surpriseItem && (
            <View style={styles.surpriseBox}>
              <Text style={styles.surpriseText}>🎉 Surprise Item 🎉</Text>
              <Text style={styles.item}>
                {surpriseItem.name} - {surpriseItem.category} - Rs.{" "}
                {surpriseItem.price}
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#6F3E18",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  menuButton: {
    backgroundColor: "#F5E1C8",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: "85%",
    alignItems: "center",
  },
  outOfStockButton: { backgroundColor: "#ccc" },
  menuButtonText: { fontSize: 16, color: "#333" },
  cartBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E0FFE0",
    borderRadius: 10,
    width: "85%",
  },
  cartTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  cartItem: { fontSize: 16, marginVertical: 2 },
  surpriseBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFE8CC",
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  surpriseText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 16, marginVertical: 5, textAlign: "center" },
});
