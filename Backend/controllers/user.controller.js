import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      domesticExp,
      InternationalExp,
      role,
      noticePeriod,
      jobTitle,
    } = req.body;

    // Check for fields based on role
    const baseFields =
      !fullname || !email || !phoneNumber || !password || !role;
    const jobSeekerFields =
      role === "jobseeker" &&
      (!domesticExp || !InternationalExp || !noticePeriod || !jobTitle);

    if (baseFields || (role === "jobseeker" && jobSeekerFields)) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exist with this email!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    };

    if (role === "jobseeker") {
      Object.assign(userData, {
        domesticExp,
        InternationalExp,
        noticePeriod,
        jobTitle,
      });
    }

    await User.create(userData);

    return res.status(201).json({
      message: "Account Created Successfully!",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    // Check Role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with selected role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      domesticExp: user.domesticExp,
      InternationalExp: user.InternationalExp,
      profile: user.profile,
      noticePeriod: user.noticePeriod,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;

    // cloudinary ayega idhar

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      console.log(cloudResponse);

      if (cloudResponse) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      domesticExp: user.domesticExp,
      InternationalExp: user.InternationalExp,
      profile: user.profile,
      noticePeriod: user.noticePeriod,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await User.find({ role: "jobseeker" }); // Change 'jobStatus' to 'role'
    if (jobSeekers.length === 0) {
      return res.status(404).json({
        message: "No job seekers found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Job seekers retrieved successfully.",
      data: jobSeekers,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving job seekers.",
      success: false,
    });
  }
};
