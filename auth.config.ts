import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('セッション情報:', auth);
      /*セッション情報: {
      user: { name: 'User', email: 'user@nextmail.com' },
      expires: '2024-01-04T13:00:25.786Z'
      }*/

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn){
            console.log('ログイン済み');
            return true;
        }else{
            console.log('Redirect unauthenticated users to login page');
            return false;
        }

      } else if (isLoggedIn) {
        console.log('ログイン済みなので dashboard へのリダイレクトを許可する');
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      console.log('未ログイン')
      //console.log(process.env.AUTH_SECRET);
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
   
} satisfies NextAuthConfig;