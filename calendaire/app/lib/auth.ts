import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Slack from "next-auth/providers/slack"
import Zoom from "next-auth/providers/zoom"
import Nodemailer from "next-auth/providers/nodemailer"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,Google,Apple,Slack,Zoom,
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
});