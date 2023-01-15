import bcrypt from "bcrypt";
import { uuid } from "uuidv4";

import db from '../../utils/db';

export function findUserByEmail(email: any) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUserByEmailAndPassword(email:string, password:string, first_name: string, last_name: string) {
  const hashed = bcrypt.hashSync(password, 12);
  return db.user.create({
    data: {
      email: email,
      password: hashed,
      first_name,
      last_name,
    },
  });
}

export function createUserByEmail(email:string) {
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

export function UpdatePassword(password:string, id:string) {
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
  });
}