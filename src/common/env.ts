import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export const Env = {
    GOOGLE_CLIENT_ID: serverRuntimeConfig.GOOGLE_CLIENT_ID as string,
    GOOGLE_SECRET: serverRuntimeConfig.GOOGLE_SECRET as string,
    MIDTRANS_SERVERKEY: serverRuntimeConfig.MIDTRANS_SERVERKEY as string,
    MIDTRANS_URL: serverRuntimeConfig.MIDTRANS_URL as string,
    SOCKET_URL: serverRuntimeConfig.SOCKET_URL as string,
}