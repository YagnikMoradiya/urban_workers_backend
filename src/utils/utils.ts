import bcrypt from "bcrypt";
import moment from "moment";

export const hashPassword = (password: string, salt: number) => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const calculateMinute = (start: any, end: any) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  let diff = (startTime.getTime() - endTime.getTime()) / 1000;

  diff /= 60;
  return Math.abs(Math.round(diff));
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
