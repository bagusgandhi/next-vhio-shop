import io from 'socket.io-client';
import { Env } from '@/common/env';
import { updatePayment } from '@/actions/payment';
import * as crypto from 'crypto';

const { MIDTRANS_SERVERKEY, SOCKET_URL } = Env;
const socket = io(`${SOCKET_URL}`);

export async function POST(request: Request) {
    const body = await request.json();
    const { transaction_status, transaction_time, order_id, status_code, gross_amount, signature_key } = body;

    const hash = crypto.createHash('sha512');
    hash.update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVERKEY}`);

    const hashedPaylod = hash.digest('hex');

    // compare
    if (hashedPaylod !== signature_key) {
        return Response.json({ message: 'Bad Request' }, { status: 400 })
    }

    socket.emit('webhook', { invoice: order_id, transaction_status });

    const data = {
        transaction_status,
        transaction_time,
        invoice: order_id
    }

    await updatePayment(data) 

    return Response.json({ message: 'success' }, {
        status: 201,
        headers: new Headers({
            'Cache-Control': 'no-store, max-age=0',
        }),
    })
}

export const revalidate = 0