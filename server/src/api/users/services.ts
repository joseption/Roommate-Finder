import bcrypt from "bcrypt";

import db from '../../utils/db';

export function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
}

export function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}