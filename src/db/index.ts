import { PrismaClient } from '@prisma/client'

// export const db = new PrismaClient()

// Defining a function to create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Extending the global namespace to include the PrismaClient instance
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Creating a global instance of PrismaClient or using the existing one
export const db = globalThis.prisma ?? prismaClientSingleton();

// Setting the global Prisma instance if not in production
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;