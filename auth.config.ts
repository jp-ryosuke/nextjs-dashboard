import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn){
            console.log('ログイン済み');
            console.log(auth?.user);
            return true;
        }else{
            console.log('Redirect unauthenticated users to login page');
            console.log(auth?.user);
            return false;
        }
      } else if (isLoggedIn) {
        console.log('ログイン済みなので dashboard へのリダイレクトを許可する');
        console.log(auth?.user);
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      console.log('未ログイン')
      console.log(auth?.user);
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;