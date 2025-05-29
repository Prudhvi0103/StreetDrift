import bcrypt from 'bcrypt';

export const name = (req,res,next)=>{
    let username = req.body.userName;
    let userNameRegex = /^[a-zA-Z0-9_]{3,15}$/
    let result =  userNameRegex.test(username)
    if(result){
        next()
    }else{
        res.status(400).json({message:'Please Enter UserName in Correct Format [a-zA-Z0-9_]{3,15'})
    }
}

export const mobileNumber = (req,res,next)=>{
    let mobileNumber = req.body.mobileNumber
    let mobileNumberRegex =  /^[0-9]{10}$/
    let result =  mobileNumberRegex.test(mobileNumber)
    if(result){
        next()
    }else{
        res.status(400).json({message:'Please Enter 10 digit Mobile Number'})
    }
}

export const email = (req,res,next)=>{
    let email = req.body.email;
    let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.(com|yahoo|in|outlook)$/
    let result =  emailRegex.test(email)
    if(result){
        next()
    }else{
        res.status(400).json({message:'Please Enter Email in correct format'})
    }
}


export const password = async (req, res, next) => {
  try {
    let password = req.body.password;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let passwordRegex = /^[a-zA-Z0-9@!#$&*]{8,12}$/;
    let result = passwordRegex.test(password);

    if (result) {
      req.body.password = await bcrypt.hash(password, 10);
      next();
    } else {
      res.status(400).json({ message: 'Please Enter Password in correct format' });
    }
  } catch (error) {
    console.log(error);
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