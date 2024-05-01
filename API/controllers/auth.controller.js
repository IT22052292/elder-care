import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//function for sign up
export const signup = async (req, res, next) => {
  const { fullName, username, email, password } = req.body;
  //hashing the password
  const hashedPwd = bcryptjs.hashSync(password, 10);

  const newUser = new User({ fullName, username, email, password: hashedPwd });

  try {
    await newUser.save();
    res.status(201).json("user created successfully");
  } catch (error) {
    next(error);
  }
};

//function for sign in
export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username }); // cheack whether user exist in DB
    if (!userExists) {
      return next(errorHandler(404, "Username not found"));
    }
    const validPwd = bcryptjs.compareSync(password, userExists.password);
    if (!validPwd) {
      return next(errorHandler(401, "Invalid Username or Password!!!"));
    }
    const token = jwt.sign(
      { id: userExists._id, isAdmin: userExists.isAdmin },
      process.env.TOKEN_SCRT
    ); //token scrt is in .env

    //crating a cookie to save user data in the broser

    res
      .cookie("access-token", token, { HttpOnly: true })
      .status(200)
      .json(userExists);
  } catch (error) {
    next(error);
  }
};

//google auth API
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.TOKEN_SCRT
      );
      const { password, ...rest } = user._doc;
      res
        .cookie("access-token", token, { HttpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //creating a random pwd to users that doesnt exist
      const randowmPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPwd = bcryptjs.hashSync(randowmPassword, 10);

      const newUser = new User({
        fullName: name,
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPwd,
        profilePic: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.TOKEN_SCRT
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access-token", token, { HttpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const getusers = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sort = req.query.order === "asc" ? 1 : -1;

    const user = await User.find({
      ...(req.query.fullName && { _id: req.query.fullName }),
      ...(req.query.username && { category: req.query.username }),
      

     
    })
      .sort({ updatedAt: sort })
      .skip(start);

    const totalUsers = await User.countDocuments(); //to count total users in db

    res.status(200).json({
      totalUsers,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req,res,next) => {
  try{
    res.clearCookie('access_token');
    res.status(200).json('User has been signed out');
  }
  catch(error){
    next(error);
  }
};
