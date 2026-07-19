import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { useWishlist } from "../context/WishlistContext"; // if wishlist context exists
import { toast } from "react-toastify";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGJ1cmdlcnxlbnwwfHwwfHx8MA%3D%3D",
      title: "Delicious Burgers",
      subtitle: "Juicy, fresh, and made just for you.",
    },
    {
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200",
      title: "Tasty Pizzas",
      subtitle: "Authentic Italian flavours, delivered hot.",
    },
    {
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
      title: "Healthy Bowls",
      subtitle: "Fresh ingredients for a balanced meal.",
    },
  ];

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setFoodItem(data[0] || []);
      setFoodCat(data[1] || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading delicious meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar />

      {/* Hero / Carousel Section – Professional */}
      <section className="relative w-full h-[250px] sm:h-[280px] md:h-[380px] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg mb-2">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Search Bar – Floating Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] sm:w-3/4 md:w-1/2 z-20">
          <div className="relative">
            <input
              type="search"
              placeholder="Search your favourite food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-3.5 rounded-2xl shadow-2xl outline-none text-gray-800 bg-white/95 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-yellow-400 transition"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-5 py-2 rounded-xl font-semibold transition shadow-md">
              Search
            </button>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                idx === currentSlide ? "bg-yellow-400 w-8" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Food Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {foodCat.length > 0 ? (
          foodCat.map((category) => {
            const filteredItems = foodItem.filter(
              (item) =>
                item.CategoryName === category.CategoryName &&
                item.name.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={category._id} className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1.5 bg-yellow-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                    {category.CategoryName}
                  </h2>
                  <span className="text-sm text-gray-400 ml-2">
                    ({filteredItems.length} items)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <Card
                      key={item._id}
                      foodItem={item}
                      options={item.options[0]}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No categories available</p>
          </div>
        )}

        {/* No Search Results */}
        {foodItem.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && search.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-semibold text-gray-700">
              No Food Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search term.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;