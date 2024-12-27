// require('dotenv').config();

// const User = require('./../model/userModel');

// const util = require('util');
// const jwt = require('jsonwebtoken');

// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
// }

// const createSentToken = (user, statusCode, res) => {
//     const token = signToken(user._id);
//     const cookieOptions = {
//         expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//         httpOnly: true
//     };
//     res.cookie('jwt', token, cookieOptions);
//     res.status(statusCode).json({
//         status: "success",
//         token,
//         data: { user }
//     });
// }

// exports.signup = async (req, res, next) => {
//     try {
//         const newUser = await User.create(req.body);
//         createSentToken(newUser, 201, res);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

// exports.login = async (req, res, next) => {
//     try {
//         const { email, loginCode } = req.body;
//         if (!email || !loginCode) {
//             return res.status(400).json({ message: "Please provide an email and login code" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (user.loginCode !== loginCode) {
//             return res.status(401).json({ message: "Incorrect login code" });
//         }

//         createSentToken(user, 200, res);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

// exports.logout = (req, res) => {
//     res.clearCookie('jwt');
//     res.status(200).json({ status: 'success' });
// }

// exports.protect = async (req, res, next) => {
//     try {
//         let token;
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         } else if (req.cookies.jwt) {
//             token = req.cookies.jwt;
//         }

//         if (!token) {
//             return res.status(401).json({ message: "You are not logged in! Please log in to get access." });
//         }

//         const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
//         const freshUser = await User.findById(decoded.id);

//         if (!freshUser) {
//             return res.status(401).json({ message: "The user belonging to this token no longer exists." });
//         }

//         next();
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }




// const jwt = require('jsonwebtoken');
// const User = require('./../model/userModel');
// require('dotenv').config();

// // const jwt = require('jsonwebtoken');

// // Function to validate user login
// async function login(req, res) {
//   try {
//     const { email, loginCode } = req.body;
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Check if the login codes match
//     if (user.loginCode !== loginCode) {
//       return res.status(401).json({ message: 'Invalid login code' });
//     }
//     await user.save();
//     // Create and send JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, data: user.role });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }




// // Middleware to verify JWT token for protected routes
// function verifyToken(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token || !token.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Access denied, token missing or invalid' });
//   }
//   const tokenWithoutBearer = token.slice(7); // Remove 'Bearer ' prefix
//   try {
//     const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// }

// // Middleware to verify JWT token for protected routes
// function protect(req, res, next) {
//   // Call the verifyToken middleware to check if the token is valid
//   verifyToken(req, res, (err) => {
//     if (err) {
//       // If token verification fails, return error
//       return res.status(401).json({ message: 'Unauthorized' });
//     } else {
//       // If token is valid, move to the next middleware
//       next();
//     }
//   });
// }

// // // Middleware to verify JWT token for protected routes
// // function verifyToken(req, res, next) {
// //   const token = req.headers.authorization;
// //   console.log(req.headers); 
// //   if (!token || !token.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'Access denied, token missing or invalid' });
// //   }
// //   const tokenWithoutBearer = token.slice(7); // Remove 'Bearer ' prefix
// //   try {
// //     const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
// //     req.userId = decoded.userId;
// //     next();
// //   } catch (error) {
// //     console.error(error);
// //     res.status(401).json({ message: 'Invalid token' });
// //   }
// // }



// // function protect(req, res, next) {
// //   // Call the verifyToken middleware to check if the token is valid
// //   verifyToken(req, res, (err) => {
// //     if (err) {
// //       // If token verification fails, return error
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     } else {
// //       // If token is valid, move to the next middleware
// //       next();
// //     }
// //   });
// // }

// module.exports = { login, verifyToken, protect };
require('dotenv').config();

const User = require('./../model/userModel');
const util = require('util');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
}

const createSentToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        data: { user }
    });
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        createSentToken(newUser, 201, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, loginCode } = req.body;
        if (!email || !loginCode) {
            return res.status(400).json({ message: "Please provide an email and login code" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.loginCode !== loginCode) {
            return res.status(401).json({ message: "Incorrect login code" });
        }

        createSentToken(user, 200, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ status: 'success' });
}

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ message: "You are not logged in! Please log in to get access." });
        }

        const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const freshUser = await User.findById(decoded.id);

        if (!freshUser) {
            return res.status(401).json({ message: "The user belonging to this token no longer exists." });
        }

        req.user = freshUser;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
}
