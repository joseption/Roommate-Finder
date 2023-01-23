import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware';
import { findUserById, findUserByEmail, updateFirstName, updateLastName, updatePhoneNumber, updateGender, updateZip, updateCity, updateState, updateProfilePicture, UpdateTagsandBio, GetTagsandBio, updateBday } from './services';
import db from '../../utils/db';
const router = express.Router();

router.use(isAuthenticated); // ! Do this instead of adding isAuthenticated to every function

// ! Duplicate function? I dont think get requests are supposed to have a body ?
// router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userId } = req.body[0];
//     const user = await findUserById(userId);
//     delete user.password;
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// });

// ! changed the duplicate function to work using query params

//Get current user profile

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get user id from payload 
    const payload : payload = req.body[0];
    const userId = payload.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query; 
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// * added profile search functionality so people could search on partial text
router.get('/profileByEmail', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const match = await db.user.findFirst({
      where: {
        email: email as string,
      },
      select: {
        email: true
      }
    });
    let info;
    if (match && match.email) {
      info = {email: match.email};
    }
    else {
      info = {Error: "Does not exist"};
    }
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * added profile search functionality so people could search on partial text
router.get('/profileSearch', async (req: Request, res: Response) => {
  try {
    const { searchText } = req.query;
    const matches = await db.user.findMany({
      where: {
        email: {
          contains: searchText as string,
        },
      },
    });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/Allprofiles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.user.findMany();
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

//end point to update First Name
router.post('/updateFirstName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    if(!firstName) {
      return res.status(400).json({ Error: 'First name is required' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateFirstName(userId, firstName);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//end point to update Last Name
router.post('/updateLastName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lastName } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    if(!lastName) {
      return res.status(400).json({ Error: 'Last name is required' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateLastName(userId, lastName);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update phone number
router.post('/updatePhoneNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    if(!phoneNumber) {
      return res.status(400).json({ Error: 'Phone number is required' });
    }
    phoneNumber.replace(/\D/g, '');    

    //check for valid phone number using regex
    if(phoneNumber.length != 10) {
      return res.status(400).json({ Error: 'Invalid phone number' });
    }
    
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updatePhoneNumber(userId, phoneNumber);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update gender 

router.post('/updateGender', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gender } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //check for valid
    if(gender != "Male" && gender != "Female" && gender != "Other"){
      return res.status(400).json({
        Error:"Gender should be Male, Female, or Other"
    });}
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    } 
    const update = await updateGender(userId, gender);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update bday

router.post('/updateBday', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bday } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //check for valid
    if(!bday) {
      return res.status(400).json({ Error: 'Birthday is required' });
    }
    //valid date format mm-dd-yyyy
    const dateRegex = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
    if(!dateRegex.test(bday)) {
      return res.status(400).json({ Error: 'Invalid date format. Date should be mm-dd-yyyy' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateBday(userId, bday);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});


//update zip code 
router.post('/updateZip', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { zip_code } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if(!zip_code) {
      return res.status(400).json({ Error: 'Zip code is required' });
    }
    //use regex to check for zip code
    if(!/^\d{5}$/.test(zip_code)) {
      return res.status(400).json({ Error: 'Zip code should be 5 digits' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    } 
    const update = await updateZip(userId, zip_code);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});


router.post('/updateCity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if(!city) {
      return res.status(400).json({ Error: 'city is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    } 
    const update = await updateCity(userId, city);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update city
router.post('/updateCity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if(!city) {
      return res.status(400).json({ Error: 'city is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    } 
    const update = await updateCity(userId, city);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update state
router.post('/updateState', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { state } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if(!state) {
      return res.status(400).json({ Error: 'state is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    } 
    const update = await updateState(userId, state);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update proifile picture, accept url 

router.post('/updateProfilePicture', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { profile_picture } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    
    if(!profile_picture) {
      return res.status(400).json({ Error: 'Profile picture URL is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateProfilePicture(userId, profile_picture);
    if(!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});


//Setup Profile

router.post('/setupProfile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bio, tags } = req.body;
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    //validate bio
    if(!bio) {
      return res.status(400).json({ Error: 'Bio is required!' });
    }
    if(bio.length > 1000) {
      return res.status(400).json({ Error: 'Bio should be less than 1000 characters' });
    }
    //validate tags
    if(!tags) {
      return res.status(400).json({ Error: 'Select atleast 5 tags!' });
    }
    if(tags.length < 5) {
      return res.status(400).json({ Error: 'Select atleast 5 tags!' });
    }
    const update = await UpdateTagsandBio(tags, userId, bio);
    if(!update) {
      return res.status(400).json({ Error: 'Error adding Bio and tags' });
    }
    return res.status(200).json({ message: 'Bio and tags added successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Get bio and tags
router.get('/getBioAndTags', async (req: Request, res: Response) => {
  try {
    //get payload from body[0]
    const payload : payload = req.body[0];
    const userId = payload.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const data = await GetTagsandBio(userId);
    //console.log(data[0])
    return res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: 'Server error' });
  }
});

export default router;
