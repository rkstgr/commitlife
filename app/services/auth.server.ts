import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserByProviderId,
  findOrCreateEmailUser,
  createUserFromProvider,
} from "../lib/user.server";
import { GitHubStrategy } from "remix-auth-github";
import { User } from "@prisma/client";

export const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    if (!email || typeof email !== "string") {
      throw new Error("Bad Credentials: Email is required");
    }
    if (!password || typeof password !== "string") {
      throw new Error("Bad Credentials: Password is required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // And finally, you can find, or create, the user
    const user = await findOrCreateEmailUser(email, hashedPassword);

    // And return the user as the Authenticator expects it
    return user;
  }),
  "user-pass"
);

// GitHub Strategy
authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: `${process.env.BASE_URL}/auth/github/callback`,
      scopes: ["user:email"],
    },
    async ({ tokens }) => {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokens.accessToken()}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const githubUser = await response.json();

      let user = await getUserByProviderId("github", String(githubUser.id));
      if (!user) {
        const response = await fetch("https://api.github.com/user/emails", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${tokens.accessToken()}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        const emails = await response.json();
        const primaryEmail = emails.find((email) => email.primary)?.email;

        if (!primaryEmail) {
          throw new Error("No primary email");
        }

        user = await getUserByEmail(primaryEmail);
        if (user) {
          throw new Error("Email already exists with different provider");
        }

        user = await createUserFromProvider({
          email: primaryEmail,
          authProvider: "github",
          providerId: String(githubUser.id),
          hashedPassword: "",
        });
      }

      return user;
    }
  ),
  "github"
);

// // Google Strategy
// authenticator.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//             callbackURL: "/auth/google/callback",
//         },
//         async ({ profile }) => {
//             const email = profile.emails?.[0]?.value;
//             if (!email) throw new Error("Google email not found");

//             let user = await getUserByprovider_id(profile.id);
//             if (!user) {
//                 user = await getUserByEmail(email);
//                 if (user) {
//                     throw new Error("Email already exists with different provider");
//                 }

//                 user = await createUser({
//                     email,
//                     auth_provider: "google",
//                     provider_id: profile.id,
//                 });
//             }

//             return user;
//         }
//     ),
//     "google"
// );

// // Microsoft Strategy
// authenticator.use(
//     new MicrosoftStrategy(
//         {
//             clientID: process.env.MICROSOFT_CLIENT_ID!,
//             clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
//             callbackURL: "/auth/microsoft/callback",
//             scope: ["user.read", "email"],
//         },
//         async ({ profile }) => {
//             const email = profile.emails?.[0]?.value;
//             if (!email) throw new Error("Microsoft email not found");

//             let user = await getUserByprovider_id(profile.id);
//             if (!user) {
//                 user = await getUserByEmail(email);
//                 if (user) {
//                     throw new Error("Email already exists with different provider");
//                 }

//                 user = await createUser({
//                     email,
//                     auth_provider: "microsoft",
//                     provider_id: profile.id,
//                 });
//             }

//             return user;
//         }
//     ),
//     "microsoft"
// );
