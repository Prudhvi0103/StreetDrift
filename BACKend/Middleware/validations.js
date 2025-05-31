// import bcrypt from 'bcrypt';

import bcrypt from 'bcrypt';

export const name = (req, res, next) => {
  console.log('Request Body:', req.body); // Log the body for debugging

  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing or empty' });
  }

  // Check if name exists and is not empty
  if (!req.body.name || req.body.name.trim() === '') {
    return res.status(400).json({ message: 'Name is required and cannot be empty' });
  }

  const username = req.body.name.trim();
  // Relaxed regex: Allow spaces, letters, numbers, 3-30 characters
  const userNameRegex = /^[a-zA-Z0-9\s]{3,30}$/;
  const result = userNameRegex.test(username);

  if (result) {
    req.body.name = username; // Ensure trimmed name is used
    next();
  } else {
    res.status(400).json({
      message: `Invalid name format: "${username}". Must be 3-30 characters and contain only letters, numbers, or spaces.`,
    });
  }
};

export const mobileNumber = (req, res, next) => {
  // Check if mobileNumber exists
  if (!req.body.mobileNumber || req.body.mobileNumber.toString().trim() === '') {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  const mobileNumber = req.body.mobileNumber.toString().trim();
  const mobileNumberRegex = /^[0-9]{10}$/;
  const result = mobileNumberRegex.test(mobileNumber);

  if (result) {
    req.body.mobileNumber = mobileNumber; // Ensure string format for consistency
    next();
  } else {
    res.status(400).json({ message: 'Please enter a 10-digit mobile number' });
  }
};

export const email = (req, res, next) => {
  // Check if email exists
  if (!req.body.email || req.body.email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }

  const email = req.body.email.trim();
  // More permissive email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = emailRegex.test(email);

  if (result) {
    req.body.email = email; // Ensure trimmed email is used
    next();
  } else {
    res.status(400).json({ message: 'Please enter a valid email address' });
  }
};

export const password = async (req, res, next) => {
  try {
    // Check if password exists
    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400).json({ message: 'Password is required' });
    }

    const password = req.body.password.trim();
    // Slightly relaxed password regex: 8-12 chars, at least one uppercase, one lowercase, one digit
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@!#$&*]{8,12}$/;
    const result = passwordRegex.test(password);

    if (result) {
      req.body.password = await bcrypt.hash(password, 10);
      next();
    } else {
      res.status(400).json({
        message:
          'Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, and one digit',
      });
    }
  } catch (error) {
    console.error('Password validation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const adminPassword = async (req, res, next) => {
  try {
    let password = req.body.adminPassword;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#$&*])[A-Za-z\d@!#$&*]{8,12}$/;
    let result = passwordRegex.test(password);

    if (result) {
      req.body.password = await bcrypt.hash(password, 10);
      next();
    } else {
      res.status(400).json({
        message: 'Password should contain:',
        requirements: [
          'At least 8 characters and at most 12 characters',
          'At least one uppercase letter',
          'At least one lowercase letter',
          'At least one digit',
          'At least one special character (@!#$&*)',
        ],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const newPassword = async(req,res,next)=>{
    let password = req.body.newPassword
    let passswordRegex = /^[a-zA-z0-9@!#$&*]{8,12}$/
    let result = passswordRegex.test(password);
    if(result){
        req.body.newPassword =  await bcrypt.hash(password,10)
        next()
    }else{
        res.status(400).json({message:'Please Enter Password in correct format'})
    }
}