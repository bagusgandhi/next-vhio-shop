"use server"
import { db } from '@/db';
import type { User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { randomBytes } from 'crypto';

export const findUserByEmail = async (email: string, provider?: string) => {
    return await db.user.findFirst({
        where: {
            email,
            provider
        },
    });
};

type signUpInput = {
    name: string
    email: string
    password?: string
    provider?: string
}

const generatePasswordHash = async (password: string) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
};

const generateEmailVerificationToken = () => {
    return randomBytes(32).toString('hex');
};

export async function signUpWithGoogle(data: signUpInput): Promise<User> {
    try {
        return await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                provider: data.provider,
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error?.message);
        } else {
            throw new Error('Something went wrong!');
        }
    }
}

export async function signUp(data: signUpInput): Promise<void> {

    try {

        const isEmailExists = await findUserByEmail(data.email);

        if (isEmailExists) {
            throw new Error('Email already exists');
        }

        const hashed = await generatePasswordHash(data.password!);

        const verificationToken = generateEmailVerificationToken();


        await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed,
                emailVerifToken: verificationToken,
            },
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error?.message);
        } else {
            throw new Error('Something went wrong!');
        }
    }

    // redirect(`/products`);
}