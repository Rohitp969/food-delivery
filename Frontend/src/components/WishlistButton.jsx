import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const WishlistButton = ({ food }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(food._id);

  const toggle = () => {
    if (inWishlist) {
      removeFromWishlist(food._id);
      toast.info(`${food.name} removed from wishlist`);
    } else {
      addToWishlist(food);
      toast.success(`${food.name} added to wishlist`);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-full transition ${
        inWishlist
          ? "text-red-500 bg-red-50"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      }`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
    </button>
  );
};

export default WishlistButton;