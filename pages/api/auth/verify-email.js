import { signIn } from "next-auth/react";

const store = global._emailVerifyStore || new Map();

export default async function handler(req, res) {
  const { token } = req.query;
  const email = store.get(token);

  if (!email) {
    return res.status(400).send("Invalid or expired verification link");
  }

  store.delete(token);

  res.redirect(`/api/auth/signin?email=${email}`);
}
