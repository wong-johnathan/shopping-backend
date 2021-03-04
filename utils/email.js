const nodemailer = require("nodemailer");
const {userEmail,emailPassword} = require('config')

const user = {userEmail};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass: {emailPassword},
  },
});

const setUpAccount = async ({ to, name, token }) => {
  transporter.sendMail(
    {
      from: user,
      to,
      subject: "Account creation",
      attachments: [{ filename: "Logo.png", cid: "logo", path: __dirname + "/../assets/logo.png" }],
      html: `<div style="background:#aaaaaa12;padding:1rem;">
  <div style="width:600px;text-align:center;">
  <img src="cid:logo" alt="logo"/>
  </div>
  <div style="background:white;width:500px;padding:1rem 1rem;margin:1.5rem 1rem;border-radius:0.25rem;">
    <p style="font-size:1.5rem">
      <span style="font-weight:600">Dear ${name},</span>
    </p>
    <p>Please click on the following link <a href="http://localhost/reset-password?token=${token}">here</a> to set your account up!</p>
    <p style="font-weight:600;">Thank you</p><br/>
  </div>
</div>`,
    },
    (err, info) => {
      if (err) console.log(err.message);
      else console.log(info.response);
    }
  );
};

const forgotPassword = async ({ to, name, resetToken }) => {
  transporter.sendMail(
    {
      from: user,
      to,
      subject: "Password reset",
      attachments: [{ filename: "Logo.png", cid: "logo", path: __dirname + "/../assets/logo.png" }],
      html: `<div style="background:#aaaaaa12;padding:1rem;">
  <div style="width:500px;text-align:center;">
  <img src="cid:logo" alt="logo"/>
  </div>
  <div style="background:white;width:500px;padding:1rem 1rem;margin:1.5rem 1rem;border-radius:0.25rem;">
    <p style="font-size:1.5rem">
      <span style="font-weight:600">Dear ${name},</span>
    </p>
    <p>Please click on the following link <a href="https://app.3dcerts.com/reset-password?token=${resetToken}">here</a> to reset your password.</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <p style="font-weight:600;">Thank you</p><br/>
  </div>
</div>`,
    },
    (err, info) => {
      if (err) console.log(err.message);
      else console.log(info.response);
    }
  );
};

const resetPassword = async ({ to, name }) => {
  transporter.sendMail(
    {
      from: user,
      to,
      subject: "Password reset",
      attachments: [{ filename: "Logo.png", cid: "logo", path: __dirname + "/../assets/logo.png" }],
      html: `<div style="background:#aaaaaa12;padding:1rem;">
  <div style="width:500px;text-align:center;">
  <img src="cid:logo" alt="logo"/>
  </div>
  <div style="background:white;width:500px;padding:1rem 1rem;margin:1.5rem 1rem;border-radius:0.25rem;">
    <p style="font-size:1.5rem">
      <span style="font-weight:600">Dear ${name},</span>
    </p>
    <p>Your password has been successfully updated on the ${new Date().toString()}. If this wasn't you please contact us immediately.</p>
    <p style="font-weight:600;">Thank you</p><br/>
  </div>
</div>`,
    },
    (err, info) => {
      if (err) console.log(err.message);
      else console.log(info.response);
    }
  );
};

module.exports = {
  forgotPassword,
  setUpAccount,
  resetPassword,
};
