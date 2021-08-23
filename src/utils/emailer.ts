import nodemailer from "nodemailer";
import EmailTemplates from "swig-email-templates";

const templates = new EmailTemplates({
  root: "src/templates",
});

export const sendEmailHelper = (
  email: string,
  subjectName: string,
  otp: number
) => {
  return new Promise(async (resolve, reject) => {
    templates.render(
      "email.html",
      { email, otp },
      async (err, html, text, subject) => {
        try {
          let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "yagnik.codexive@gmail.com",
              pass: "Codexive@123",
            },
          });

          let mailDetails = {
            from: "yagnik.codexive@gmail.com",
            to: email,
            subject: subjectName,
            html: html,
            text: text,
          };

          let info = await mailTransporter.sendMail(mailDetails);

          resolve(info);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
