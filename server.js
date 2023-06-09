require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { protectedResolver, getUser } from "./users/users.utils";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectedResolver,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
