import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCalendar,
  FiX,
  FiUser,
  FiPackage,
} from "react-icons/fi";
import { useItems } from "../context/ItemContext";
import Navbar from "../components/layout/Navbar";

const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    location: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const { items, fetchAllItems, loading } = useItems();

  useEffect(() => {
    fetchAllItems();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const filtered = items.filter((item) => {
        const matchesSearch =
          searchTerm === "" ||
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          filters.type === "all" || item.type === filters.type;
        const matchesCategory =
          filters.category === "all" || item.category === filters.category;
        const matchesLocation =
          filters.location === "all" || item.location === filters.location;

        return (
          matchesSearch && matchesType && matchesCategory && matchesLocation
        );
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, filters, items]);

  const categories = [
    "all",
    "Electronics",
    "Wallet/Purse",
    "ID Cards",
    "Books",
    "Clothing",
    "Other",
  ];
  const locations = [
    "all",
    "Library",
    "Computer Lab",
    "Student Center",
    "Cafeteria",
    "Sports Complex",
    "Parking Lot",
  ];
  const types = ["all", "lost", "found"];

  const clearFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      location: "all",
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Search Items</h1>
            <p className="text-gray-400">Find lost or found items on campus</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-2 flex mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by item name or description..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder-gray-500"
            aria-label="Search items"
          />
          <button
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            aria-label="Search"
          >
            <FiSearch aria-hidden="true" />
            Search
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition mb-4"
          aria-label={showFilters ? "Hide filters" : "Show filters"}
        >
          <FiFilter aria-hidden="true" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                aria-label="Clear all filters"
              >
                <FiX aria-hidden="true" /> Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="itemType"
                >
                  Item Type
                </label>
                <select
                  id="itemType"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === "all"
                        ? "All Types"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === "all" ? "all" : cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <select
                  id="location"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc === "all" ? "all" : loc}>
                      {loc === "all" ? "All Locations" : loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-400 mb-4">
          Found{" "}
          <span className="font-semibold text-white">
            {filteredItems.length}
          </span>{" "}
          item{filteredItems.length !== 1 ? "s" : ""}
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-emerald-500"></div>
            </div>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-12 text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiSearch
                    className="w-10 h-10 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-gray-400 mb-4">
                  No items found matching your criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image Section */}
                    <div className="h-48 bg-gray-700 relative overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={`${item.itemName} - ${item.type === "lost" ? "Lost item" : "Found item"}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/favicon.png";
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage
                            className="w-12 h-12 text-gray-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-lg font-medium shadow-lg ${
                          item.type === "lost"
                            ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        }`}
                      >
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition mb-2">
                        {item.itemName}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-400 mb-2">
                        <p className="flex items-center gap-1">
                          <FiMapPin
                            className="text-gray-500"
                            size={14}
                            aria-hidden="true"
                          />{" "}
                          {item.location}
                        </p>
                        <p className="flex items-center gap-1">
                          <FiCalendar
                            className="text-gray-500"
                            size={14}
                            aria-hidden="true"
                          />{" "}
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                        <FiUser
                          className="text-gray-500"
                          size={14}
                          aria-hidden="true"
                        />
                        <span>Posted by: </span>
                        <Link
                          to={`/profile/${item.userId?._id}`}
                          className="text-emerald-400 hover:text-emerald-300 hover:underline transition"
                        >
                          {item.userId?.name || "Anonymous"}
                        </Link>
                      </div>

                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex gap-2">
                        <Link
                          to={`/item/${item._id}`}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                        >
                          View Details
                        </Link>
                        <button
                          className="flex-1 bg-gray-700 text-gray-300 text-sm py-2 rounded-xl hover:bg-gray-600 transition"
                          aria-label={`Contact about ${item.itemName}`}
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchItems;
