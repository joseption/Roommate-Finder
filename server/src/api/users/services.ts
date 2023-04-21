import bcrypt from "bcrypt";
import { JWT } from "google-auth-library";
import { env } from "process";
import { tagsStyles } from "utils/tags";
import { uuid } from "uuidv4";

import db from '../../utils/db';

export function findUserByEmail(email: any) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUserByEmailAndPassword(email: string, password: string, first_name: string, last_name: string, birthday: string) {
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.create({
    data: {
      email: email,
      password: hashed,
      first_name,
      last_name,
      birthday,
    },
  });
}

export function createUserByEmail(email: string) {
  // Generate some random password for now, they will change it later when they activate their account.
  var password = new Date().getTime() + uuid();
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.create({
    data: {
      email: email,
      password: hashed,
    },
  });
}

export function UpdatePassword(password: string, id: string) {
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.update({
    where: {
      id,
    },
    data: {
      password: hashed
    },
  });
}

export function findUserById(id: any) {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      bio: true,
      first_name: true,
      last_name: true,
      is_verified: true,
      is_active: true,
      is_superuser: true,
      is_setup: true,
      setup_step: true,
      birthday: true,
      tags: true,
      image: true,
      Listings: true,
      phone_number: true,
      zip_code: true,
      city: true,
      state: true,
      gender: true,
      email: true,
    }
  });
}

export function updateFirstName(id: string, first_name: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      first_name,
    },
  });
}

export function updateLastName(id: string, last_name: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      last_name,
    },
  });
}

//update phone number

export function updatePhoneNumber(id: string, phone_number: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      phone_number,
    },
  });
}

//update gender

export function updateGender(id: string, gender: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      gender,
    },
  });
}

export function updateZip(id: string, zip_code: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      zip_code,
    },
  });
}

export function updateCity(id: string, city: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      city,
    },
  });
}

export function updateImage(id: string, image: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      image,
    },
  });
}

export function updateState(id: string, state: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      state,
    },
  });
}

export function updateProfilePicture(id: string, image: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      image,
    },
  });
}

//tags

//add tags to tags table 
// @@param {string[]} tags - array of tags to add
// @@param {string} userId - id of user to add tags to

// check if tag exists in tags table
// if it does, add tag then skip
// if it doesn't, add tag to tags table 
// get all tags from tags table
// delete missing tags from tags table

//actually easier way just delete all tags 
// and add new tags... 
export async function UpdateTagsandBio(tags: string[], user_id: string, bio: string) {
  // delete all tags of user 
  try {
    tags = tags.filter(tag => tagsStyles.includes(tag));
    //update bio
    await db.user.update({
      where: {
        id: user_id,
      },
      data: {
        bio,
      },
    });

    await db.tags.deleteMany({
      where: {
        user_id,
      }
    });
    // add new tags
    for (let i = 0; i < tags.length; i++) {
      await db.tags.create({
        data: {
          tag: tags[i],
          user_id,
        }
      });
    }
    return true;
  } catch (error) {
    return false;
  }
}

//get tags and bio of user!! 

export function GetTagsandBio(id: string) {
  return db.user.findMany({
    where: {
      id,
    },
    select: {
      bio: true,
      tags: {
        select: {
          tag: true,
        }
      },
    }
  });
}

// Get users filtered by tags 
export async function GetUsersByTags(filters: string[]) {
  const allTags = await db.tags.findMany({
    select: {
      tag: true,
      user_id: true
    }
  });

  const userTags: { [key: string]: string[] } = allTags.reduce((acc, current) => {
    acc[current.user_id] = acc[current.user_id] || [];
    acc[current.user_id].push(current.tag);
    return acc;
  }, {} as { [key: string]: string[] });

  const userIDs = Object.keys(userTags).filter(user_id => {
    const userTagList = userTags[user_id];
    return filters.every(filter => userTagList.includes(filter));
  });

  return userIDs;
}

export async function GetUsersByGender(gender: string) {
  const userIdObjList = await db.responsesOnUsers.findMany({
    where: {
      response: {
        response: gender,
        question: {
          question_text: {
            contains: "gender"
          }
        }
      }
    },
    select: {
      userId: true
    }
  });

  const userIds = userIdObjList.map(x => x.userId);
  return userIds;
}

export async function GetUsersByLocation(location: string) {
  const userIdObjList = await db.responsesOnUsers.findMany({
    where: {
      response: {
        response: location,
        question: {
          question_text: {
            contains: "Location"
          }
        }
      }
    },
    select: {
      userId: true
    }
  });

  const userIds = userIdObjList.map(x => x.userId);
  return userIds;
}

export async function GetUsersBySharingPref(sharingPref: string) {
  const sharingPrefMap = new Map<string, string>();
  sharingPrefMap.set("Always", "Always");
  sharingPrefMap.set("Sometimes", "permission");
  sharingPrefMap.set("Never", "Never");

  if (sharingPref == 'undefined' || sharingPref == '') {
    return [];
  }

  const userIdObjList = await db.responsesOnUsers.findMany({
    where: {
      response: {
        response: {
          contains: sharingPrefMap.get(sharingPref)
        },
        question: {
          question_text: {
            contains: "sharing"
          }
        }
      }
    },
    select: {
      userId: true
    }
  });

  const userIds = userIdObjList.map(x => x.userId);
  return userIds;
}

// Get match percentages for logged in user with all other users 
export async function GetMatches(mainUserId: string, userIds: string[]) {
  return db.matches.findMany({
    where: {
      userOneId: mainUserId,
      userTwoId: {
        in: userIds,
      },
    },
  });
}

export function updateBday(id: string, birthday: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      birthday,
    },
  });
}

export function updateSetupStep(id: string, setup_step: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      setup_step,
    },
  });
}

export function completeSetupAndSetStep(id: string, setup_step: string) {
  return db.user.update({
    where: {
      id,
    },
    data: {
      is_setup: true,
      setup_step
    },
  });
}

export async function updatePushToken(id: string, push_token: string) {
  // Clear any account with the current device token, they aren't logged in anymore
  await db.user.updateMany({
    where: {
      push_token
    },
    data: {
      push_token: ''
    },
  });

  return await db.user.update({
    where: {
      id,
    },
    data: {
      push_token,
    },
  });
}

export async function getOAuth() {
  const client = new JWT({
    email: env.FIREBASE_CLIENT_EMAIL,
    key: env.FIREBASE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });
  return await client.getRequestHeaders();
}