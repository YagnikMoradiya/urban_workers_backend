import bcrypt from "bcrypt";

export const hashPassword = (password: string, salt: number) => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
