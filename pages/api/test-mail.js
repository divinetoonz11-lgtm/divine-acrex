import { sendMail } from "../../lib/mailer";

export default async function handler(req, res) {
  const result = await sendMail({
    to: "divinetoonz11@gmail.com",
    subject: "Test Mail – Divine Acres",
    html: "<h3>✅ Mail system is working!</h3>",
  });

  res.status(200).json(result);
}
