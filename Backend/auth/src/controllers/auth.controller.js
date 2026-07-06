const userModel = require('../db/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../db/redis');
const { publishToQueue } = require('../broker/broker')

async function registerUser(req, res) {
    try {
    const { username, name, email, password, role, location } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or : [ 
            { email },
            { username }
        ]
    });

    if(isUserAlreadyExist) {   
    return res.status(409).json({
        message : "User with this email or username already exists"
    })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        name,
        email,
        password: hashedPassword,
        role,
        location
    })

    await Promise.all([ 
      publishToQueue('AUTH_NOTIFICATION.USER_CREATED',{
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    }),
    
    publishToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', user)
             
  ])



   const token = jwt.sign ({
        id : user._id,
        username : user.username,
        email : user.email,
        role : user.role
   }, process.env.JWT_SECRET, { expiresIn: '1d' });

   res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true
   })
  
    res.status(201).json({
        message:  "User registered successfully",
        user: {
            id : user._id,
            username : user.username,
            email : user.email,
            role : user.role,
            location : user.location
        }
    })
}
catch (error) {
    res.status(500).json({
        message: "Internal server error"
    });
}

}


async function loginUser(req, res) {

  try {
    const { userId, password } = req.body;

  
    const user = await userModel.findOne({ 
        $or : [
            { email: userId },
            { username: userId }
        ]
     }).select('+password');


    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    return res.status(200).json({
      success:true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    return res.status(500).json({ 
        message: 'Internal server error' 
    });
  }
}


async function getCurrentUser (req,res)
{
  
   return res.status(200).json({
    message: "current user fetched successfully",
    user: req.user
  })

}


async function logoutUser(req, res)
{
    const token = req.cookies.token;

    // if(token)
    // {
    //    await redis.set(`blacklist:${token}`,'true', 'EX', 24 * 60 * 60);
    // }

    res.clearCookie('token',{
      httpOnly: true,
      secure: true
    });

    return res.status(200).json({
      message: "User logged out successfully"
    })
}


module.exports = {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser
}