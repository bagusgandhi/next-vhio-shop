"use server"
import { db } from '@/db';
import { findUserByEmail } from './auth';
import { requestPayment } from './payment';
import { PrismaClient } from '@prisma/client/extension';

export type orderType = {
    total: number
    email: string
    cart: any[]
}

export type userReq = {
    email: string
    name: string
}

export const findAllOrderByUserId = async (email: string, invoice?: string): Promise<any> => {
    const user = await findUserByEmail(email);

    if (invoice) {
        const order = await db.order.findFirst({
            where: {
                user_id: user?.id,
                invoice
            },
            include: {
                payment: true
            }
        });

        const orderProduct = await db.orderProduct.findMany({
            where: {
                order_id: order?.id
            },
            include: {
                product: true
            }
        });

        return { ...order, orderProduct }
    }

    return await db.order.findMany({
        where: {
            user_id: user?.id
        },
        include: {
            payment: true
        }
    });
};

const _generateInvoiceNumber = (): string => {
    // Generate a unique random number (e.g., using Math.random() or a library like uuid)
    const uniqueRandomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999

    // Get the current date and time components
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    // Combine the date, time, and random number to form the invoice number
    const invoiceNumber = `INV-${year}${month}${day}-${hours}${minutes}${seconds}-${uniqueRandomNumber}`;
    return invoiceNumber;
}

const _insertOrder = async (tx: PrismaClient, data: orderType) => {
    try {
        const user = await findUserByEmail(data.email);

        const orderData = {
            invoice: _generateInvoiceNumber(),
            total: data.total,
            user_id: user?.id!,
        };

        const newOrder = await tx.order.create({
            data: orderData,
        });

        return newOrder;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating order:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error insert data');
        }
    }
}



const _insertOrderProducts = async (tx: PrismaClient, data: orderType, orderId: string) => {

    try {
        // get cart data and return as promise
        const cartPromise = data.cart.map((item) => {
            return tx.orderProduct.create({
                data: {
                    product_id: item.id,
                    order_id: orderId,
                    total_price: item.price * item.quantity,
                    qty: item.quantity,
                }
            })
        });

        // insert with promise all
        await Promise.all(cartPromise);

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating orderProduct:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error insert data');
        }
    }


}

export const submitOrder = async (data: orderType, user: userReq, bank: string) => {
    try {
        let invoice;
        await db.$transaction(async (tx) => {

            // order logic
            const order = await _insertOrder(tx, data);
            await _insertOrderProducts(tx, data, order.id);

            invoice = order.invoice;


            // payment logic
            await requestPayment(tx, user, order.user_id, order.id, order.invoice, order.total, bank);

        }, {
            timeout: 30000,
            maxWait: 60000
        });

        return invoice;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating orderProduct:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error insert data');
        }
    }

}


