import bcrypt from "bcrypt";

export const hashPassword = (password, salt) => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
