import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Craftsmanship"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 tracking-tight">
            OUR STORY
          </h1>
          <p className="text-lg font-light tracking-widest uppercase">
            Crafting Legacy Through Timeless Design
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 tracking-wide">
                The Art of Italian Craftsmanship
              </h2>
              <p className="text-gray-600 text-lg font-light leading-relaxed mb-6">
                Founded in the heart of Milan, ShoeStore embodies the pinnacle of Italian 
                artistry and luxury footwear. Each collection is a testament to our 
                unwavering commitment to exceptional craftsmanship, innovative design, 
                and timeless elegance.
              </p>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Our journey began with a simple vision: to create footwear that transcends 
                trends and becomes part of your legacy. Every stitch, every curve, every 
                material is carefully considered to ensure unparalleled quality and comfort.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80"
                alt="Italian Craftsmanship"
                className="w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black flex items-center justify-center">
                <span className="text-white text-sm font-light tracking-widest uppercase text-center">
                  Since 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-light mb-6 tracking-wide">
            Experience the Difference
          </h2>
          <p className="text-gray-600 text-lg font-light mb-8 max-w-2xl mx-auto">
            Discover the artistry, craftsmanship, and heritage behind every pair of ShoeStore footwear.
          </p>
          <div className="space-x-4">
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition duration-300"
            >
              Explore Collection
            </Link>
            
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default AboutPage;