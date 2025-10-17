import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../../Api/Apipage";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    gender: "",
    count: "",
    description: "",
    image: ""
  });

  const categories = ["Sneakers", "Boots", "Sandals", "Loafers", "Sports", "Casual", "Formal"];
  const genders = ["Men", "Women", "Unisex"];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      const product = response.data;
      
      setFormData({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        gender: product.gender || "",
        count: product.count || product.stock || "",
        description: product.description || "",
        image: product.image || product.imageUrl || ""
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product data");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        count: parseInt(formData.count)
      };

      await api.put(`/products/${productId}`, productData);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
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

            {/* Price and Stock */}
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
            </div>

            {/* Category and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
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
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
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
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 font-medium"
              >
                {saving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Product...
                  </span>
                ) : (
                  "Update Product"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products/add")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
              >
                Add New Product
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-sm">
            <div className="relative w-full pt-[100%] bg-gray-100 rounded-lg mb-4">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Preview"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {formData.name || "Product Name"}
            </h4>
            <p className="text-sm text-gray-500 mb-2 capitalize">
              {formData.category || "Category"} • {formData.gender || "Gender"}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {formData.price ? `₹${parseInt(formData.price).toLocaleString()}` : "₹0"}
            </p>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                (formData.count || 0) === 0 ? 'bg-red-100 text-red-800' :
                (formData.count || 0) < 10 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Stock: {formData.count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;