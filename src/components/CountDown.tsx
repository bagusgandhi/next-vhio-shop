"use client"
import React, { useState, useEffect } from 'react';

type remainingType = {
    total?: number
    days: number
    hours: number
    minutes: number
    seconds: number
}

export default function CountDown({ expiryTime, invoice }: { expiryTime: Date, invoice: string }) {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(expiryTime));

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const remainingTime: remainingType = getTimeRemaining(expiryTime);
            setTimeRemaining(remainingTime);

            if (remainingTime.total! <= 0) {
                clearInterval(countdownInterval);
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                // window.location.reload();
            }
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [expiryTime]);


    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value;
    };

    const { days, hours, minutes, seconds } = timeRemaining;

    return (
        <>
            {
                timeRemaining && (
                    <p>{`${days}d ${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`}</p>
                )
            }
        </>
    );
};

const getTimeRemaining = (expiryTime: Date): remainingType => {
    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    const distance = expiry - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
        total: distance,
        days,
        hours,
        minutes,
        seconds
    };
};
