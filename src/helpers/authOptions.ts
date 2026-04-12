import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image?: string | null;
      role: "SUPER_ADMIN" | "ADMIN" | "USER";
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
    role: "SUPER_ADMIN" | "ADMIN" | "USER";
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "USER";
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },

      async authorize(credentials) {
        // Handle direct token sync from social login
        if (credentials?.accessToken && credentials?.refreshToken) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_API}/user/my-profile`,
              {
                headers: {
                  Authorization: `Bearer ${credentials.accessToken}`,
                },
              },
            );

            if (res.ok) {
              const result = await res.json();
              const user = result?.data;
              if (user) {
                return {
                  id: user.id || user._id, 
                  name: user.name,
                  email: user.email,
                  image: user.profileImage,
                  role: user.role,
                  accessToken: credentials.accessToken,
                  refreshToken: credentials.refreshToken,
                };
              }
            }
          } catch (error) {
            console.error("Token sync fetch error:", error);
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        if (!res.ok) {
          return null;
        }

        const result = await res.json();

        /**
         * Backend response shape:
         * {
         *   data: {
         *     userData: { id, name, email, profileImage, role },
         *     accessToken: "...",
         *     refreshToken: "..."
         *   }
         * }
         */
        const data = result?.data;
        const user = data?.userData;

        if (!user) {
          return null;
        }

        const returnValue = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImage,
          role: user.role,
          accessToken: data?.accessToken,
          refreshToken: data?.refreshToken,
        };

        return returnValue;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // When a new user logs in, we reset the token fields to avoid 
        // carrying over data from a previous social session.
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
};
