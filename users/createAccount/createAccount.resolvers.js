import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, location, password, avatarURL, githubUsername }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          throw new Error("this userName or email has already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            name,
            location,
            avatarURL,
            githubUsername,
            password: hashedPassword,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: e,
        };
      }
    },
    login: async (_, { username, password }) => {
      const user = await client.user.findUnique({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: "Wrong password",
        };
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
