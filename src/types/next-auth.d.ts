import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "ADMIN" | "REALTOR" | "USER"
      emailVerified?: Date
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    role: "ADMIN" | "REALTOR" | "USER"
    emailVerified?: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    emailVerified?: Date
  }
}

declare module "next-auth/core/types" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "ADMIN" | "REALTOR" | "USER"
      emailVerified?: Date
    } & DefaultSession["user"]
  }
} 