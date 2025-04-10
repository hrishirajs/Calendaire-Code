'use server';

import { signIn } from "./auth";

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signInWithGithub() {
  await signIn("github");
}

export async function signInWithSlack() {
  await signIn("slack");
}