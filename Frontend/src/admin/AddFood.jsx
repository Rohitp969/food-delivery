import React, { useState } from "react";
import { toast } from "react-toastify";
import { PlusCircle, Upload, X, Image as ImageIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AddFood = () => {
  const [food, setFood] = useState({
    name: "",
    CategoryName: "",
    img: "", // Will store the Cloudinary URL
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setFood({
      ...food,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFood({ ...food, img: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Cloudinary via backend
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.url; // Cloudinary URL
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = food.img;

      // If a file is selected, upload it first
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      } else if (!food.img || food.img.startsWith("data:image")) {
        // If only base64 preview exists and no file, we need a valid URL
        toast.error("Please upload an image or provide a valid URL");
        setLoading(false);
        return;
      }

      // Prepare payload with the final image URL
      const payload = {
        ...food,
        img: imageUrl,
      };

      // Send to add food endpoint
      const response = await fetch(`${API_URL}/api/admin/foods/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.success) {
        toast.success("Food Added Successfully 🎉");
        setFood({
          name: "",
          CategoryName: "",
          img: "",
          price: "",
          description: "",
        });
        setSelectedFile(null);
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
      } else {
        toast.error("Unable to Add Food");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header - Same as FoodList */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
              Add New Food
            </h1>
          </div>
          <p className="text-gray-500 mt-2 ml-4">
            Fill the details below to add a new food item.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview & Upload */}
          <div>
            <label className="font-semibold text-slate-700 block mb-3">
              Food Image <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Image Preview */}
              <div className="relative group flex-shrink-0">
                <img
                  src={
                    food.img
                      ? food.img
                      : "https://placehold.co/200x150?text=No+Image"
                  }
                  alt="Preview"
                  className="w-48 h-36 rounded-xl object-cover border-2 border-slate-200 group-hover:border-green-500 transition-all duration-300"
                />
                {food.img && !food.img.startsWith("data:image") && (
                  <button
                    type="button"
                    onClick={() => {
                      setFood({ ...food, img: "" });
                      setSelectedFile(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Upload Options */}
              <div className="flex-1 w-full space-y-3">
                {/* File Upload Button */}
                <div>
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300 ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-green-500" />
                        <span className="text-slate-600 font-medium">
                          Click to Upload Image
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Manual URL Input */}
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="img"
                    value={food.img && !food.img.startsWith("data:image") ? food.img : ""}
                    onChange={handleChange}
                    placeholder="Paste image URL directly (e.g., Cloudinary URL)"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Food Name */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={food.name}
              onChange={handleChange}
              placeholder="Enter food name"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="CategoryName"
              value={food.CategoryName}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
              required
            >
              <option value="">Select Category</option>
              <option>Pizza</option>
              <option>Burger</option>
              <option>Biryani</option>
              <option>Chinese</option>
              <option>South Indian</option>
              <option>Desserts</option>
              <option>Beverages</option>
              <option>Starter</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={food.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={food.description}
              onChange={handleChange}
              placeholder="Brief description of the food item"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (!selectedFile && !food.img)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
              loading || (!selectedFile && !food.img)
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Food...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Add Food
              </>
            )}
          </button>

          {!selectedFile && !food.img && (
            <p className="text-center text-xs text-amber-600">
              ⚠️ Please upload an image or enter a URL before submitting.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddFood;