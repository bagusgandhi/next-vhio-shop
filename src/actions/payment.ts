"use server"
import { db } from '@/db';
import axios from 'axios';
import { Env } from '@/common/env';
import { PrismaClient } from '@prisma/client/extension';
import { userReq } from './order';
import { findUserByEmail } from './auth';
import { PaymentStatus } from '@prisma/client';

const { MIDTRANS_SERVERKEY, MIDTRANS_URL } = Env;

const base64MIdtransKey = Buffer.from(MIDTRANS_SERVERKEY, 'utf-8');

export const findPaymentByInvoice = async (email: string, invoice: string) => {
    const user = await findUserByEmail(email);

    const currentTime = new Date();


    const paymentData = await db.payment.findFirst({
        where: {
            invoice,
            user_id: user?.id,
            expiry_time: {
                gt: currentTime
            }
        }
    });

    // console.log("query:", paymentData);
    return paymentData;
};

const _requestMidtrans = async (user: userReq, invoice: string, total: number, bank: string) => {
    try {
        const response = await axios.post(MIDTRANS_URL, midtransRequestBody(user, invoice, total, bank), {
            headers: midtransRequestHeader
        })

        return response.data;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error request midtrans:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error request midtrans');
        }
    }
}

const midtransRequestHeader = {
    Accept: 'application/json',
    Authorization: `Basic ${base64MIdtransKey.toString('base64')}:`,
    'Content-Type': 'application/json'
}

const midtransRequestBody = (user: userReq, invoice: string, total: number, bank: string) => ({
    payment_type: 'bank_transfer',
    customer_detail: {
        first_name: user.name,
        email: user.email
    },
    transaction_details: {
        order_id: invoice,
        gross_amount: total
    },
    bank_transfer: {
        bank
    },
    custom_expiry: {
        expiry_duration: 10,
        unit: 'minute'
    }

})

export const updatePayment = async ({ invoice, transaction_status, transaction_time  }: { invoice: string, transaction_status: PaymentStatus, transaction_time: string }) => {
    try {

        return await db.payment.update({
            where: {
                invoice
            },
            data: {
                transaction_status,
                transaction_time: new Date(transaction_time)
            }
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error request payment:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error request payment');
        }
    }
}

export const requestPayment = async (tx: PrismaClient, user: userReq, userId: string, orderId: string, invoice: string, total: number, bank: string) => {
    try {

        const response = await _requestMidtrans(user, invoice, total, bank);

        const resultPay = {
            gross_amount: response.gross_amount,
            va_number: response.va_numbers[0].va_number,
            bank: response.va_numbers[0].bank,
            transaction_id: response.transaction_id,
            transaction_time: new Date(response.transaction_time),
            transaction_status: response.transaction_status,
            expiry_time: new Date(response.expiry_time),
            order_id: orderId,
            user_id: userId,
            invoice
        };

        await tx.payment.create({
            data: resultPay
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error request payment:', error);
            throw new Error(error.message);
        } else {
            throw new Error('Error request payment');
        }
    }
}