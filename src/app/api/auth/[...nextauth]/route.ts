import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Env } from "@/common/env";
import { z } from 'zod';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs'
import { findUserByEmail, signUpWithGoogle } from "@/actions/auth";


const { GOOGLE_CLIENT_ID, GOOGLE_SECRET } = Env;

async function getUser(email: string, provider: string): Promise<User | null> {
    try {
        return await findUserByEmail(email, provider);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

const authOptions = {
    trustHost: true,
    pages: {
        signIn: '/auth',
        error: '/auth'
    },
    providers: [
        CredentialsProvider({
            id: 'cred-email-password',
            name: 'Custom',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'your@mail.co'
                },
                password: { label: 'Password', type: 'password' },

            },
            async authorize(credentials) {

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                // console.log(parsedCredentials);
                if (parsedCredentials.success) {

                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email, "cred-email-password");

                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password!);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_SECRET,

        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }: any) {
            if (account?.provider === 'google') {
                const userData = await getUser(profile.email, "google");

                // create usernot found insert user data
                if (!userData) {
                    try {

                        await signUpWithGoogle({
                            name: profile.name,
                            email: profile.email,
                            provider: 'google'
                        });
                        return true;
                    } catch (error) {
                        return '/auth?error=Acount may have registered without google sign in';
                    }
                }
                return true;
            }
            return true;
        },
    },
}

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };