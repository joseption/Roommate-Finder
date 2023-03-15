import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware';
import {
  findUserById,
  findUserByEmail,
  updateFirstName,
  updateLastName,
  updatePhoneNumber,
  updateGender,
  updateZip,
  updateCity,
  updateState,
  updateProfilePicture,
  UpdateTagsandBio,
  GetTagsandBio,
  updateSetupStep,
  completeSetupAndSetStep,
  updateBday,
  updateImage,
  updatePushToken,
  getOAuth,
  GetUsersByTags,
  GetMatches,
  GetUsersByGender,
  GetUsersByLocation,
  GetUsersBySharingPref,
} from './services';
import db from '../../utils/db';
import { uploadImage } from 'utils/uploadImage';
import { env } from 'process';
import { JWT } from 'google-auth-library';
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

router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

//Get current user profile

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get user id from payload
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Get current user profile
router.get('/myProfile', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
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
        email: true,
      },
    });
    let info;
    if (match && match.email) {
      info = { email: match.email };
    } else {
      info = { Error: 'Does not exist' };
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
    //NEED TO DELETE PASSWORD...
    //just use my search function below
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profileSearchV2', async (req, res) => {
  try {
    const { searchText, limit, cursorId, genderType } = req.query;
    const sortByMatchPercentage = req.query.sortByMatchPercentage === 'true';
    const search = (searchText && searchText.toString().trim()) || '';
    console.log(genderType)
    const gender = (genderType && genderType.toString().trim()) || '';
    const userId = req.body[0].userId;

    if (
      Array.isArray(search) ||
      Array.isArray(limit) ||
      Array.isArray(cursorId) ||
      Array.isArray(sortByMatchPercentage)
    ) {
      return res.status(400).json({ Error: 'Params cannot be a string array' });
    }

    const paginationParams = {
      take: limit ? parseInt(limit.toString()) : undefined,
      skip: cursorId ? 1 : 0,
      cursor: cursorId ? { id: cursorId.toString() } : undefined,
    };

    const userSelect = {
      id: true,
      bio: true,
      first_name: true,
      last_name: true,
      birthday: true,
      tags: true,
      image: true,
      matches: {
        where: {
          OR: [{ userOneId: userId }, { userTwoId: userId }],
        },
      },
    };
    console.log(gender);
    const genderFilter = gender ? { gender } : {};

    const matches = sortByMatchPercentage
      ? await db.matches
        .findMany({
          where: {
            OR: [
              { userOneId: userId, User: { ...genderFilter, is_setup: true } },
              { userTwoId: userId, User2: { ...genderFilter, is_setup: true } },
            ],
          },
          ...paginationParams,
          select: {
            User: { select: userSelect },
            User2: { select: userSelect },
          },
        })
        .then((matches) =>
          matches.map((match) => (match.User.id === userId ? match.User2 : match.User))
        )
      : await db.user.findMany({
        where: {
          ...genderFilter,
          is_setup: true,
        },
        ...paginationParams,
        select: userSelect,
      });

    res.status(200).json({
      users: matches,
      nextCursorId: matches.length > 0 ? matches[matches.length - 1].id : null,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/Allprofiles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const users = await db.user.findMany({
      select: {
        id: true,
        bio: true,
        first_name: true,
        last_name: true,
        birthday: true,
        tags: true,
        image: true,
        matches: {
          where: {
            userTwoId: userId,
          },
        },
      },
    });

    return res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/AllprofilesMob', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.query;
    const mainUserId = payload.userId;
    const users = await db.user.findMany({
      select: {
        id: true,
        bio: true,
        first_name: true,
        last_name: true,
        birthday: true,
        tags: true,
        image: true,
        city: true,
        state: true,
        is_setup: true,
        //matches: {
        //where:{
        // userTwoId: userId,
        // },
        //},
      },
    });

    const userIds = users.map((x) => x.id);
    const matches = await GetMatches(mainUserId as string, userIds);

    const userMap: { [id: string]: any } = {};
    users.forEach((user) => {
      userMap[user.id] = user;
    });

    matches.forEach((match: any) => {
      const user = userMap[match.userTwoId];
      if (user) {
        user.matchPercentage = match.matchPercentage;
      }
    });

    return res.json(users);
  } catch (err) {
    next(err);
  }
});

//Get Users filtered by Tags
router.get('/profilesByTags', async (req: Request, res: Response) => {
  try {
    const gender = req.query.gender;
    const location = req.query.location;
    const sharingPref = req.query.sharingPref;
    const filters = req.query.filters;
    const filtersArray = (filters as string).split(',');

    const userIds1 = await GetUsersByTags(filtersArray as string[]);
    const userIds2 = await GetUsersByGender(gender as string);
    const userIds3 = await GetUsersByLocation(location as string);
    const userIds4 = await GetUsersBySharingPref(sharingPref as string);

    const lists = [userIds1, userIds2, userIds3, userIds4];
    const filterOptions = [filters, gender, location, sharingPref];

    const nonEmptyLists = lists.filter((list) => list !== undefined && list.length > 0);
    const nonEmptyFilterOptions = filterOptions.filter((x) => x !== undefined && x.length > 0);

    let users;

    if (nonEmptyLists.length === 0 || nonEmptyFilterOptions.length === 0) {
      users = await db.user.findMany();
    } else {
      let userIdsCommon = nonEmptyLists[0];
      for (let i = 1; i < nonEmptyLists.length; i++) {
        if (nonEmptyFilterOptions[i] !== undefined && nonEmptyFilterOptions[i] !== 'undefined') {
          userIdsCommon = userIdsCommon.filter((value: any) => nonEmptyLists[i].includes(value));
        }
      }

      // Get users that match the fetched userIDs
      users = await db.user.findMany({
        where: {
          id: {
            in: userIdsCommon,
          },
        },
      });
    }

    const mainUserId = req.query.userId;
    const userIds = users.map((x) => x.id);
    const matches = await GetMatches(mainUserId as string, userIds);

    const userMap: { [id: string]: any } = {};
    users.forEach((user) => {
      userMap[user.id] = user;
    });

    matches.forEach((match) => {
      const user = userMap[match.userTwoId];
      if (user) {
        user.matchPercentage = match.matchPercentage;
      }
    });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//end point to update First Name
router.post('/updateFirstName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    if (!firstName) {
      return res.status(400).json({ Error: 'First name is required' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateFirstName(userId, firstName);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//end point to update Last Name
router.post('/updateLastName', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lastName } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    if (!lastName) {
      return res.status(400).json({ Error: 'Last name is required' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateLastName(userId, lastName);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update phone number
router.post('/updatePhoneNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    if (!phoneNumber) {
      return res.status(400).json({ Error: 'Phone number is required' });
    }
    phoneNumber.replace(/\D/g, '');

    //check for valid phone number using regex
    if (phoneNumber.length != 10) {
      return res.status(400).json({ Error: 'Invalid phone number' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updatePhoneNumber(userId, phoneNumber);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update gender

router.post('/updateGender', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gender } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //check for valid
    if (gender != 'Male' && gender != 'Female' && gender != 'Other') {
      return res.status(400).json({
        Error: 'Gender should be Male, Female, or Other',
      });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateGender(userId, gender);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update bday

router.post('/updateBday', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bday } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //check for valid
    if (!bday) {
      return res.status(400).json({ Error: 'Birthday is required' });
    }
    //valid date format mm-dd-yyyy
    const dateRegex = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
    if (!dateRegex.test(bday)) {
      return res.status(400).json({ Error: 'Invalid date format. Date should be mm-dd-yyyy' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateBday(userId, bday);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update zip code
router.post('/updateZip', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { zip_code } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if (!zip_code) {
      return res.status(400).json({ Error: 'Zip code is required' });
    }
    //use regex to check for zip code
    if (!/^\d{5}$/.test(zip_code)) {
      return res.status(400).json({ Error: 'Zip code should be 5 digits' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateZip(userId, zip_code);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

router.post('/updateCity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if (!city) {
      return res.status(400).json({ Error: 'city is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateCity(userId, city);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update city
router.post('/updateCity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if (!city) {
      return res.status(400).json({ Error: 'city is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateCity(userId, city);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update state
router.post('/updateState', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { state } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate zip code
    if (!state) {
      return res.status(400).json({ Error: 'state is required' });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const update = await updateState(userId, state);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//update proifile picture, accept url

router.post('/updateProfilePicture', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { profile_picture } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;

    if (!profile_picture) {
      return res.status(400).json({ Error: 'Profile picture URL is required' });
    }
    //check if profile_picture is a base64 image
    if (!/^data:image\/[a-z]+;base64,/.test(profile_picture)) {
      return res.status(400).json({ Error: 'Profile picture should be a base64 image' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    //uploading image to s3 bucket
    const upload = await uploadImage(profile_picture);
    if (!upload) {
      return res.status(400).json({ Error: 'Upload failed' });
    }
    const update = await updateProfilePicture(userId, upload);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }
    return res.status(200).json({ message: upload });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Setup Profile

router.post('/setupProfile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bio, tags, setup_step } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate bio
    if (!bio) {
      return res.status(400).json({ Error: 'Bio is required!' });
    }
    if (bio.length > 1000) {
      return res.status(400).json({ Error: 'Bio should be less than 1000 characters' });
    }
    //validate tags
    if (!tags) {
      return res.status(400).json({ Error: 'Select atleast 5 tags!' });
    }
    if (tags.length < 5) {
      return res.status(400).json({ Error: 'Select atleast 5 tags!' });
    }
    const update = await UpdateTagsandBio(tags, userId, bio);
    if (!update) {
      return res.status(400).json({ Error: 'Error adding Bio and tags' });
    }
    if (setup_step) {
      // JA Only required in account setup process
      await updateSetupStep(userId, setup_step);
    }
    return res.status(200).json({ message: 'Bio and tags added successfully' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Get bio and tags
router.get('/getBioAndTags', async (req: Request, res: Response) => {
  try {
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const data = await GetTagsandBio(userId);
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Get bio and tags
router.get('/getBioAndTagsMob', async (req: Request, res: Response) => {
  try {
    //get payload from body[0]
    const payload = req.query;
    const userId = payload.userId;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    const data = await GetTagsandBio(userId as string);
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

router.post('/completeSetup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { setup_step } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    //validate setup step
    if (!setup_step) {
      return res.status(400).json({ Error: 'Setup step is required!' });
    }
    const complete = await completeSetupAndSetStep(userId, setup_step);
    if (!complete) {
      return res.status(400).json({ Error: 'Error finishing account setup' });
    }
    return res.status(200).json({ message: 'Account setup successfully' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

router.post('/updateAllProfile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageUri, imageURL, first_name, last_name, birthday, phone_number, zip_code, city, state, gender } =
      req.body;
    const payload: payload = req.body[0];
    const userId = payload.userId;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ Error: 'User not found' });
    }
    //validate image
    if (!imageUri && !imageURL) {
      return res.status(400).json({ Error: 'Image is required' });
    }
    //check if image is a base64 image
    if (imageUri) {
      if (!/^data:image\/[a-z]+;base64,/.test(imageUri)) {
        return res.status(400).json({ Error: 'Image should be a base64 image' });
      }
      //uploading image to s3 bucket
      const upload = await uploadImage(imageUri);
      if (!upload) {
        return res.status(400).json({ Error: 'Upload failed' });
      }
      const update_image = await updateImage(userId, upload);
      if (!update_image) {
        return res.status(400).json({ Error: 'Update image failed' });
      }
    }
    //validate first_name
    if (!first_name) {
      return res.status(400).json({ Error: 'First name is required' });
    }
    const update_first_name = await updateFirstName(userId, first_name);
    if (!update_first_name) {
      return res.status(400).json({ Error: 'Update first name failed' });
    }
    //validate last_name
    if (!last_name) {
      return res.status(400).json({ Error: 'Last Name is required' });
    }
    const update_last_name = await updateLastName(userId, last_name);
    if (!update_last_name) {
      return res.status(400).json({ Error: 'Update last name failed' });
    }
    //validate birthday
    if (!birthday) {
      return res.status(400).json({ Error: 'Birthday is required' });
    }
    const update_birthday = await updateBday(userId, birthday);
    if (!update_birthday) {
      return res.status(400).json({ Error: 'Update birthday failed' });
    }
    //validate phone_number
    if (!phone_number) {
      return res.status(400).json({ Error: 'Phone Number is required' });
    }
    const update_phone_number = await updatePhoneNumber(userId, phone_number);
    if (!update_phone_number) {
      return res.status(400).json({ Error: 'Update phone number failed' });
    }
    //validate zip_code
    if (!zip_code) {
      return res.status(400).json({ Error: 'Zip Code is required' });
    }
    const update_zip_code = await updateZip(userId, zip_code);
    if (!update_zip_code) {
      return res.status(400).json({ Error: 'Update zip code failed' });
    }
    //validate city
    if (!city) {
      return res.status(400).json({ Error: 'City is required' });
    }
    const update_city = await updateCity(userId, city);
    if (!update_city) {
      return res.status(400).json({ Error: 'Update city failed' });
    }
    //validate state
    if (!state) {
      return res.status(400).json({ Error: 'State is required' });
    }
    const update_state = await updateState(userId, state);
    if (!update_state) {
      return res.status(400).json({ Error: 'Update state failed' });
    }
    //validate gender
    if (!gender) {
      return res.status(400).json({ Error: 'Gender is required' });
    }
    const update_gender = await updateGender(userId, gender);
    if (!update_gender) {
      return res.status(400).json({ Error: 'Update gender failed' });
    }

    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//end point to update push token
router.post('/updatePushToken', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pushToken } = req.body;
    //get payload from body[0]
    const payload: payload = req.body[0];
    const userId = payload.userId;
    if (!pushToken) {
      return res.status(400).json({ Error: 'Push token is required' });
    }

    const update = await updatePushToken(userId, pushToken);
    if (!update) {
      return res.status(400).json({ Error: 'Update failed' });
    }

    return res.status(200).json({ message: 'Update successful' });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

//Get OAuth 2.0 token
router.get('/getOAuth', async (req: Request, res: Response) => {
  try {
    const auth = await getOAuth();
    return res.status(200).json({ token: auth });
  } catch (err) {
    return res.status(500).json({ Error: 'Server error' });
  }
});

export default router;
