import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/auth',
    // error: '/auth'
  }
})

export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    matcher: ['/cart', '/orders', '/payment']
};