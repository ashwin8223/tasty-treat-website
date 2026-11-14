import Google from "next-auth/providers/google";
import { createCustomer, getCustomer } from "./data-service";
import NextAuth, { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },

    async signIn({ user }) {
      try {
        if (!user.email || !user.name) return false;

        const existingCustomer = await getCustomer(user.email);

        if (!existingCustomer) {
          await createCustomer({
            email: user.email,
            fullName: user.name,
            phone: null,
            address: null,
            city: null,
          });
        }

        return true;
      } catch {
        return false;
      }
    },

    async session({ session }) {
      const email = session.user.email;

      if (!email) return session;

      const customer = await getCustomer(email);

      if (!customer) {
        throw new Error("Customer record not found");
      }

      session.user.customerId = customer.id;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
