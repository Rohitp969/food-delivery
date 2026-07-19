const express = require("express");
const router = express.Router();

const Food = require("../models/FoodModels");


// ================= GET ALL FOODS =================

router.get("/", async (req, res) => {
  try {

    const foods = await Food.find();

    res.json({
      success: true,
      foods,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });

  }
});


// ================= ADD FOOD =================

router.post("/add", async (req, res) => {
  try {
    const {
      name,
      CategoryName,
      img,
      price,
      description,
    } = req.body;

    const food = await Food.create({
      name,
      CategoryName,
      img,
      description,
      options: {
        Regular: Number(price),
      },
    });

    res.json({
      success: true,
      food,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});


// ================= DELETE FOOD =================

router.delete("/:id", async (req, res) => {
  try {

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });

  }
});


// ================= UPDATE FOOD =================

router.put("/:id", async (req, res) => {
  try {
    const { name, CategoryName, img, price, description } = req.body;

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        CategoryName,
        img,
        description,
        options: {
          Regular: Number(price),
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      food: updatedFood,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});


router.get("/food/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.json({ success: true, food });
  } catch (err) {
    console.error("Error fetching food:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;