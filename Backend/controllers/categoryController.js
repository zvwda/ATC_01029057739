const Category = require('../models/Category');
const path = require("path");
const fs = require("fs"); 
const {cloudinaryUploadImage, cloudinaryRemoveImage} = require("../utils/coudinary");


exports.AddNewCategory = async (req, res) => {
  if(!req.file){
    return res.status(400).json({message: "no image provided"})
  }
  const image_path = path.join(__dirname , `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(image_path);  
  const { title , description } = req.body;
  const category = await Category.create({ title, description, image:{
              url: result.secure_url,
              publicid:result.public_id
           },});
  res.status(201).json(category);
  fs.unlinkSync(image_path); 
  
};

exports.GetAllCat = async (req, res) => {
  const category = await Category.find();
  res.json(category);
};
