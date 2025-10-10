import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../../Api/Apipage";
import QuickViewModal from "../Products/ProductDetails";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData } = await api.get("/products");
        const { data: categoriesData } = await api.get("/categories");

        // Get featured products
        const featured = productsData.filter(product => product.featured);
        setFeaturedProducts(featured.slice(0, 4));

        // Get new arrivals
        const newArrivals = productsData.filter(product => product.new);
        setNewProducts(newArrivals.slice(0, 4));

        setCategories(categoriesData.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      

      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden bg-black" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Shoes"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
        
        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight leading-tight">
            ELEVEN
            <br />
            <span className="italic font-normal">FOOTWEAR</span>
          </h1>
          <p className="text-lg md:text-xl font-light tracking-widest mb-8 uppercase letter-spacing-wider">
            Italian Craftsmanship Meets Contemporary Design
          </p>
          <div className="space-x-4">
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-8 py-4 font-light tracking-widest text-sm uppercase hover:bg-gray-100 transition duration-300"
            >
              Shop Collection
            </Link>
            <Link
              to="/new-arrivals"
              className="inline-block border border-white text-white px-8 py-4 font-light tracking-widest text-sm uppercase hover:bg-white hover:text-black transition duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-white/60">
            <div className="w-px h-8 bg-white animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
<section className="py-20 px-6">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-serif font-light mb-12 text-center tracking-wide">
      EXPLORE COLLECTIONS
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map(category => (
        <Link 
          key={category.id} 
          to={`/category/${category.id}`}
          className="group text-center"
        >
          <div className="aspect-square overflow-hidden mb-4 bg-gray-50">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />
          </div>
          <h3 className="font-light text-sm uppercase tracking-widest mb-1">
            {category.name}
          </h3>
          <p className="text-gray-500 text-xs">{category.count} items</p>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light mb-4 tracking-wide">
              Featured Collection
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-light">
              Iconic Designs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    {product.new && (
                      <span className="bg-white text-black px-3 py-1 text-xs tracking-widest uppercase font-light">
                        New
                      </span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="bg-red-600 text-white px-3 py-1 text-xs tracking-widest uppercase font-light ml-2">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-light text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {product.originalPrice > product.price ? (
                      <>
                        <span className="text-lg font-light">{formatPrice(product.price)}</span>
                        <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-light">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <button
                    className="inline-block border border-black text-black px-6 py-2 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white transition duration-300"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light mb-4 tracking-wide">
              New Arrivals
            </h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-light">
              Latest Additions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-black text-white px-3 py-1 text-xs tracking-widest uppercase font-light">
                      New
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-light text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">
                    {product.category}
                  </p>
                  <div className="mb-4">
                    <span className="text-lg font-light">{formatPrice(product.price)}</span>
                  </div>
                  <button
                    className="inline-block border border-black text-black px-6 py-2 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white transition duration-300"
                  >
                    Discover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
            THE ART OF
            <br />
            <span className="italic">CRAFTSMANSHIP</span>
          </h2>
          <p className="text-gray-300 text-lg font-light mb-8 max-w-2xl mx-auto tracking-wide leading-relaxed">
            Experience the pinnacle of footwear craftsmanship. Each pair is meticulously 
            crafted using traditional techniques combined with innovative design, creating 
            timeless pieces that transcend generations.
          </p>
          <Link
            to="/about"
            className="inline-block border border-white text-white px-8 py-3 font-light tracking-widest text-sm uppercase hover:bg-white hover:text-black transition duration-300"
          >
            Our Heritage
          </Link>
        </div>
      </section>
      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;