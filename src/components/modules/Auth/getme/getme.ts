"use server";

import { getCurrentUser } from "@/action/auth/login.action";

export async function getUser() {
  const session = await getCurrentUser();
  return session?.user;
}
