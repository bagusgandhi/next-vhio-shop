"use server"
import { db } from '@/db';

export const findAll = async () => {
    return await db.product.findMany();
};