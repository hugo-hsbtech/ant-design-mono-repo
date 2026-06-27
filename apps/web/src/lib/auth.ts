import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './data';

/**
 * Auth.js (NextAuth v5) configured with a DEV Credentials provider over the
 * mock data layer. The provider is the only piece that changes when wiring a
 * real identity source (OAuth, credentials+hash, SSO) — `auth`/`signIn`/
 * `signOut` and every call site stay the same.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Dev',
      credentials: { email: { label: 'E-mail', type: 'email' } },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? '');
        const user = getUserByEmail(email);
        // DEV ONLY: a known email signs in without a password. Replace with a
        // real provider for production.
        return user ? { id: user.id, name: user.name, email: user.email } : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.uid && session.user) session.user.id = token.uid as string;
      return session;
    },
  },
});
