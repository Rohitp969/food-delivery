import React from "react";

const Carousal = () => {
  return (
    <div>
      <div
        id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{objectFit: "contain !important"}}>
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption" style={{zIndex:"10"}}>
            <form className="flex">
           <input className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 me-2" type="search" placeholder="Search" aria-label="Search"/>
           <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white bg-success" type="submit">Search</button>
           </form>
          </div>
          <div className="carousel-item active">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200" className="d-block w-100"
              style={{ height: "500px", objectFit: "cover", filter: "brightness(30%)"}}
              alt="burger"/>
          </div>

          <div className="carousel-item">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200"
              className="d-block w-100"
              style={{ height: "500px", objectFit: "cover", filter: "brightness(30%)"}}
              alt="pastry"
            />
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200"
              className="d-block w-100"
              style={{ height: "500px", objectFit: "cover", filter: "brightness(30%)" }}
              alt="barbecue"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousal;
