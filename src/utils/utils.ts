import bcrypt from "bcrypt";

export const hashPassword = (password: string, salt: number) => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const getRandomNumber = (): string => {
  return (Math.floor(Math.random() * 9) + 1).toString();
};

export const generateRandomNumber = (): any => {
  let str =
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber();
  return parseInt(str);
};
