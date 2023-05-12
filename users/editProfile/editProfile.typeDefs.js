import { gql } from "apollo-server";

export default gql`
  type EditProfileResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editProfile(
      password: String
      avatarURL: String
      location: String
    ): EditProfileResult!
  }
`;
