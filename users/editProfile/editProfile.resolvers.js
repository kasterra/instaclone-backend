import jwt from "jsonwebtoken";
import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { password: newPassword, avatarURL, location },
        { loggedInUser }
      ) => {
        let hashedPassword = null;
        if (newPassword) {
          hashedPassword = bcrypt.hashSync(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            avatarURL,
            location,
            ...(hashedPassword && { password: hashedPassword }),
          },
        });
        if (updatedUser) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Cannot update profile",
          };
        }
      }
    ),
  },
};
