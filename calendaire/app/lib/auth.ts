import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import Slack from "next-auth/providers/slack"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";


export const {handlers,  signIn, signOut, auth } = NextAuth({
  adapter:PrismaAdapter(prisma),
  providers: [GitHub,Google,Slack],
});