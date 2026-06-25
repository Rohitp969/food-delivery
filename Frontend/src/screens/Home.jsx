import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // Loading Spinner
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Carousel */}
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control shadow w-50"
                type="search"
                placeholder="Search your favourite food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(35%)",
              }}
              alt="Burger"
            />
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(35%)",
              }}
              alt="Pastry"
            />
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200"
              className="d-block w-100"
              style={{
                height: "500px",
                objectFit: "cover",
                filter: "brightness(35%)",
              }}
              alt="Barbecue"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Food Section */}
      <div className="container my-4">
  {foodCat.length > 0 ? (
    foodCat.map((category) => {
      const filteredItems = foodItem.filter(
        (item) =>
          item.CategoryName === category.CategoryName &&
          item.name.toLowerCase().includes(search.toLowerCase())
      );

      if (filteredItems.length === 0) return null;

      return (
        <div key={category._id} className="mb-5">
          <h3 className="mb-3">{category.CategoryName}</h3>
          <hr />

          <div className="row">
            {filteredItems.map((item) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={item._id}
              >
                <Card
                  foodItem={item}
                  options={item.options[0]}
                />
              </div>
            ))}
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center">
      <h4>No Categories Found</h4>
    </div>
  )}

  {foodItem.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ).length === 0 && (
    <div className="text-center mt-5">
      <h3>No Food Found 😔</h3>
    </div>
  )}
</div>

      <Footer />
    </div>
  );
};

export default Home;