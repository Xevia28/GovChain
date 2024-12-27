const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const User = require('../model/userModel');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

signup = async (req, res) => {
  try {
    const { name, email, walletAddress } = req.body;
    // Generate login code
    const loginCode = randomstring.generate({ length: 6, charset: 'numeric' });
    // Create a new user instance
    const user = new User({ name, email, walletAddress, loginCode });
    // Save the user to the database
    await user.save();
    // Send login code to user's email
    await sendLoginCodeEmail(email, loginCode);
    res.status(201);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


createUser = async (req, res) => {
  try {
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // req.body.password = hashedPassword;
    const user = await User.create(req.body);
    res.status(201).json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//     const passwordMatch = bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).send('Invalid password');
//     }
//     res.status(200).send('Login successful');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// }

async function sendLoginCodeEmail(email, loginCode) {
  // Configure nodemailer using environment variables
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Login Code',
    text: `Your login code is: ${loginCode}`
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users, status: "success" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.is_active = false;
    res.status(200).json({ data: user, status: "success" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ status: "success", data: { user: updatedUser } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ data: user, status: "success" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { signup, createUser, getAllUsers, getUserById, deactivateUser, updateUser, deleteUser };




// const bcrypt = require('bcryptjs');
// const User = require('../model/userModel');

// async function signup(req, res) {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();
//     res.status(200).send('User created successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// }

// async function login(req, res) {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).send('Invalid password');
//     }
//     res.status(200).send('Login successful');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// }

// module.exports = { signup, login };
