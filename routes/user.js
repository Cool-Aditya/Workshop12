const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const User = require("../models/userSchema");

router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(User) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    // const searchKey = req.query.name;
    const searchField = String(req.query.name);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await User.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await User.find({
        name: { $regex: searchField, $options: "$i" },
      })
        .limit(limit)
        .skip(startIndex)
        .exec();
      console.log(results, searchField);
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   try {
  //     results.results = await User.find(
  //       { [searchKey]: { $regex: searchField } }
  //       // { [selkey]: 1 }
  //     )
  //       .limit(limit)
  //       .skip(startIndex)
  //       .exec();
  //     res.paginatedResults = results;
  //     next();
  //   } catch (e) {
  //     res.status(500).json({ message: e.message });
  //   }
  // };
}

module.exports = router;
