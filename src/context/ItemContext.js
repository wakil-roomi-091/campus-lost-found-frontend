import React, { createContext, useState, useContext } from "react";
import { itemsAPI } from "../utils/api";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const ItemContext = createContext();

export const useItems = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all items
  const fetchAllItems = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemsAPI.getAllItems(filters);
      console.log("Fetched all items:", data);

      if (data.success) {
        setItems(data.items || []);
        return { success: true, data };
      } else {
        setItems([]);
        return { success: false, error: data.msg || "Failed to fetch items" };
      }
    } catch (err) {
      console.error("Fetch all items error:", err);
      setError(err.msg || "Failed to fetch items");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Get single item
  const fetchItemById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemsAPI.getItemById(id);
      console.log("Fetched item by ID:", data);

      if (data.success) {
        setCurrentItem(data.item);
        return { success: true, data };
      } else {
        return { success: false, error: data.msg || "Failed to fetch item" };
      }
    } catch (err) {
      console.error("Fetch item error:", err);
      setError(err.msg || "Failed to fetch item");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Get user's items
  const fetchUserItems = async () => {
    if (!user) return { success: false, error: "Not authenticated" };

    setLoading(true);
    setError(null);
    try {
      const data = await itemsAPI.getUserItems();
      console.log("Fetched user items:", data);

      if (data && data.success) {
        const itemsList = data.items || [];
        setUserItems(itemsList);
        return { success: true, data: { items: itemsList } };
      } else {
        if (Array.isArray(data)) {
          setUserItems(data);
          return { success: true, data: { items: data } };
        }
        setUserItems([]);
        return {
          success: false,
          error: data?.msg || "Failed to fetch user items",
        };
      }
    } catch (err) {
      console.error("Fetch user items error:", err);
      setError(err.msg || "Failed to fetch user items");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  // Create new item
  const createItem = async (itemData) => {
    if (!user) return { success: false, error: "Not authenticated" };

    setLoading(true);
    setError(null);
    try {
      console.log("\n========== 📦 ITEM CONTEXT ==========");
      console.log("📥 Received itemData:", {
        ...itemData,
        images: itemData.images,
        imageCount: itemData.images?.length,
      });

      // CRITICAL CHECK: Verify images array
      if (itemData.images && itemData.images.length > 0) {
        console.log(
          "✅ Images array present with",
          itemData.images.length,
          "URLs",
        );
        console.log("📸 First image URL:", itemData.images[0]);
        console.log("📸 Image URL type:", typeof itemData.images[0]);
      } else {
        console.warn("⚠️ No images in itemData!");
      }

      const data = await itemsAPI.createItem(itemData);
      console.log("📥 API response:", data);

      if (data.success) {
        console.log("✅ Item created with ID:", data.item._id);
        console.log("🖼️ Images in database:", data.item.images);

        setItems((prev) => [data.item, ...prev]);
        setUserItems((prev) => [data.item, ...prev]);
        return { success: true, data };
      } else {
        console.error("❌ API returned success: false", data.msg);
        return { success: false, error: data.msg || "Failed to create item" };
      }
    } catch (err) {
      console.error("❌ Create item error:", err);
      setError(err.msg || "Failed to create item");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
      console.log("========== 🏁 CONTEXT END ==========\n");
    }
  };

  // Update item function
  const updateItem = async (id, itemData) => {
    if (!user) return { success: false, error: "Not authenticated" };

    setLoading(true);
    setError(null);
    try {
      console.log("Updating item:", id, "with data:", itemData);
      const data = await itemsAPI.updateItem(id, itemData);
      console.log("Update response:", data);

      if (data && data.success) {
        // Update in lists
        setItems((prev) =>
          prev.map((item) => (item._id === id ? data.item : item)),
        );
        setUserItems((prev) =>
          prev.map((item) => (item._id === id ? data.item : item)),
        );
        if (currentItem?._id === id) setCurrentItem(data.item);
        return { success: true, data };
      } else {
        const errorMsg = data?.msg || "Failed to update item";
        console.error("Update failed:", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.msg || err.message || "Failed to update item";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!user) return { success: false, error: "Not authenticated" };

    setLoading(true);
    setError(null);
    try {
      const data = await itemsAPI.deleteItem(id);
      console.log("Delete response:", data);

      if (data.success) {
        // Remove from lists
        setItems((prev) => prev.filter((item) => item._id !== id));
        setUserItems((prev) => prev.filter((item) => item._id !== id));
        if (currentItem?._id === id) setCurrentItem(null);
        return { success: true, data };
      } else {
        return { success: false, error: data.msg || "Failed to delete item" };
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.msg || "Failed to delete item");
      return { success: false, error: err.msg };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    items,
    userItems,
    currentItem,
    loading,
    error,
    fetchAllItems,
    fetchItemById,
    fetchUserItems,
    createItem,
    updateItem,
    deleteItem,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

ItemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
