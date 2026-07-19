import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editFood, setEditFood] = useState({
    _id: "",
    name: "",
    CategoryName: "",
    img: "",
    price: "",
    description: "",
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFoodId, setDeleteFoodId] = useState(null);
  const [deleteFoodName, setDeleteFoodName] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/foods");
      const json = await response.json();
      if (json.success) {
        setFoods(json.foods);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load foods");
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id, name) => {
    setDeleteFoodId(id);
    setDeleteFoodName(name);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteFoodId(null);
    setDeleteFoodName("");
    setDeleting(false);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteFoodId) return;
    setDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/foods/${deleteFoodId}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (json.success) {
        toast.success(`"${deleteFoodName}" deleted successfully`);
        fetchFoods();
        closeDeleteModal();
      } else {
        toast.error("Delete failed");
        setDeleting(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
      setDeleting(false);
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateFood = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/foods/${editFood._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFood),
      });
      const json = await response.json();
      if (json.success) {
        toast.success("Food Updated Successfully");
        setShowEdit(false);
        fetchFoods();
      } else {
        toast.error("Update Failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* Header Section (same as before) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
              Food Management
            </h1>
          </div>
          <p className="text-gray-500 mt-2 ml-4">Manage all food items</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>
          <Link to="/admin/add-food">
            <button className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <FaPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Food</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Badge */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200/60">
          <span className="text-sm text-gray-500">Total Foods:</span>
          <span className="ml-2 font-bold text-slate-800">{filteredFoods.length}</span>
        </div>
        {search && (
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200">
            <span className="text-sm text-indigo-600">
              Showing {filteredFoods.length} result{filteredFoods.length !== 1 && 's'}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading Foods...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <UtensilsCrossed size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No Food Found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Food</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((food, index) => (
                    <tr key={food._id} className={`border-t border-slate-100 hover:bg-slate-50/80 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <img src={food.img} alt={food.name} className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 group-hover:border-green-500 transition-all duration-300" />
                          <div className="absolute inset-0 bg-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{food.name}</p>
                          {food.description && (
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{food.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                          {food.CategoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        ₹{food.options?.[0]?.Regular || food.options?.[0]?.regular || Object.values(food.options?.[0] || {})[0] || food.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditFood({
                                _id: food._id,
                                name: food.name,
                                CategoryName: food.CategoryName,
                                img: food.img,
                                description: food.description || "",
                                price: food.options?.[0]?.Regular || food.options?.[0]?.regular || Object.values(food.options?.[0] || {})[0] || food.price,
                              });
                              setShowEdit(true);
                            }}
                            className="group bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(food._id, food.name)}
                            className="group bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredFoods.map((food) => (
                <div key={food._id} className="border border-slate-200 rounded-2xl p-4 flex gap-4 items-center hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <img src={food.img} alt={food.name} className="w-20 h-20 rounded-xl object-cover border-2 border-slate-200" />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{food.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold mt-1">
                      {food.CategoryName}
                    </span>
                    <p className="text-green-600 font-bold mt-2">
                      ₹{food.options?.[0]?.Regular || food.options?.[0]?.regular || Object.values(food.options?.[0] || {})[0] || food.price}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setEditFood({ _id: food._id, name: food.name, CategoryName: food.CategoryName, img: food.img, description: food.description || "", price: food.options?.[0]?.Regular || food.options?.[0]?.regular || Object.values(food.options?.[0] || {})[0] || food.price }); setShowEdit(true); }} className="bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white p-2.5 rounded-xl transition-all duration-300">
                      <FaEdit />
                    </button>
                    <button onClick={() => openDeleteModal(food._id, food.name)} className="bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white p-2.5 rounded-xl transition-all duration-300">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal (unchanged) */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit Food</h2>
                <p className="text-sm text-gray-400">Update food details</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={updateFood} className="space-y-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <img src={editFood.img} alt="" className="w-40 h-32 rounded-xl object-cover border-2 border-slate-200 group-hover:border-blue-500 transition-all duration-300" />
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <input type="text" value={editFood.name} onChange={(e) => setEditFood({ ...editFood, name: e.target.value })} placeholder="Food Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <select value={editFood.CategoryName} onChange={(e) => setEditFood({ ...editFood, CategoryName: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="">Select Category</option>
                <option>Pizza</option><option>Burger</option><option>Biryani</option><option>Chinese</option>
                <option>South Indian</option><option>Desserts</option><option>Beverages</option><option>Starter</option>
              </select>
              <input type="number" value={editFood.price} onChange={(e) => setEditFood({ ...editFood, price: e.target.value })} placeholder="Price" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <input type="text" value={editFood.img} onChange={(e) => setEditFood({ ...editFood, img: e.target.value })} placeholder="Image URL" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <textarea rows="4" value={editFood.description} onChange={(e) => setEditFood({ ...editFood, description: e.target.value })} placeholder="Description" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)} className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all duration-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Confirm Delete</h2>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
              <button onClick={closeDeleteModal} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="py-4">
              <p className="text-slate-700">
                Are you sure you want to delete <span className="font-semibold text-rose-600">"{deleteFoodName}"</span>?
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;