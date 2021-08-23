import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";

export const uploadImage = async (file: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        reject("No image file");
      }

      const storage = new Storage({
        projectId: "urban-workers",
        keyFilename: path.join(__dirname, "../../serviceAccount.json"),
      });

      let bucketName = "urban-workers.appspot.com";
      var filePath = file.path;

      await storage.bucket(bucketName).upload(filePath, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${file.filename}?alt=media`;
      fs.unlinkSync(file.path);
      resolve(url);
    } catch (error) {
      fs.unlinkSync(file.path);
      reject(error);
    }
  });
};
