import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../../Api/Apipage";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const availableColors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Brown",
    "Gray",
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    gender: "",
    count: "",
    colors: [], // ✅ multiple colors
    description: "",
    image: "",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    new: true,
    tags: [],
  });

  const categories = [
    "Sneakers",
    "Boots",
    "Sandals",
    "Loafers",
    "Sports",
    "Casual",
    "Formal",
  ];
  const genders = ["Men", "Women", "Kids"];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.sizes];
    const index = currentSizes.indexOf(size);
    if (index > -1) currentSizes.splice(index, 1);
    else currentSizes.push(size);
    setFormData({ ...formData, sizes: currentSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: parseInt(formData.price),
        originalPrice: parseInt(formData.originalPrice || formData.price),
        category: formData.category,
        gender: formData.gender,
        count: parseInt(formData.count),
        description: formData.description,
        images: formData.image ? [formData.image] : [],
        sizes: formData.sizes,
        colors: formData.colors, // ✅ multiple colors
        featured: formData.featured,
        new: formData.new,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await api.post("/products", productData);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 absolute top-0 left-0 w-" >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm font-medium"
          >
            <span className="mr-2">←</span>
            Back to Products
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Add a new product to your store</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Price and Original Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter original price for discount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if no discount
                </p>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Colors *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => {
                      const currentColors = [...formData.colors];
                      const index = currentColors.indexOf(clr);
                      if (index > -1) currentColors.splice(index, 1);
                      else currentColors.push(clr);
                      setFormData({ ...formData, colors: currentColors });
                    }}
                    className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                      formData.colors.includes(clr)
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500">Selected:</p>
                {formData.colors.length > 0 ? (
                  <div className="flex gap-2">
                    {formData.colors.map((clr) => (
                      <span
                        key={clr}
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 border"
                      >
                        {clr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">None</p>
                )}
              </div>
            </div>

            {/* Stock and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender and Sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                        formData.sizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.sizes.join(", ") || "None"}
                </p>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a direct image URL for the product
              </p>
            </div>

            {/* Checkboxes */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured Product
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="new"
                  checked={formData.new}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">New Arrival</span>
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 font-medium"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-sm mx-auto">
            {/* Image Preview */}
            <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-100 rounded-lg">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {formData.new && (
                  <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light">
                    New
                  </span>
                )}
                {formData.featured && (
                  <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                    Featured
                  </span>
                )}
                {formData.originalPrice > formData.price && (
                  <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center">
              <h4 className="text-lg font-light tracking-wide mb-2">
                {formData.name || "Product Name"}
              </h4>

              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-gray-600 font-light tracking-widest">
                  {formData.price
                    ? `₹${parseInt(formData.price).toLocaleString()}`
                    : "₹0"}
                </p>
                {formData.originalPrice > formData.price && (
                  <p className="text-gray-400 text-sm font-light line-through">
                    ₹{parseInt(formData.originalPrice).toLocaleString()}
                  </p>
                )}
              </div>

              <p className="text-gray-500 text-xs uppercase tracking-widest font-light mb-3">
                {formData.category || "Category"} •{" "}
                {formData.gender || "Gender"}
              </p>

              {/* Sizes Preview */}
              {formData.sizes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Available Sizes:</p>
                  <div className="flex justify-center gap-1">
                    {formData.sizes.map((size) => (
                      <span
                        key={size}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Preview */}
              {formData.colors.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Available Colors:
                  </p>
                  <div className="flex justify-center gap-2">
                    {formData.colors.map((clr) => (
                      <div
                        key={clr}
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: clr.toLowerCase() }}
                        title={clr}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    parseInt(formData.count) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Stock: {formData.count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
