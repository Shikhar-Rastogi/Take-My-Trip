const Booking = require("../models/Booking.js");

//create new booking
const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Tour tour is booked",
        data: savedBooking,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

//get single booking
const getBooking = async(req,res)=>{
    const id= req.params.id
    try{
        const book = await Booking.findById(id)
        res
        .status(200)
        .json({
          success: true,
          message: "Successful",
          data: book,
        });
    }catch (err){
        res.status(404).json({ success: false, message: "not found" });
    }
};


//get all booking
const getAllBooking = async(req,res)=>{
    try{
        const books = await Booking.findById()
        res
        .status(200)
        .json({
          success: true,
          message: "Successful",
          data: books,
        });
    }catch (err){
        res.status(404).json({ success: false, message: "internal server error" });
    }
};

module.exports = {
  createBooking,
  getBooking,
  getAllBooking,
};
