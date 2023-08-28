'use client'

import { Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';

// Define the 8 color combinations
const colorCombinations = [
    { bg: "#a7f3d0", fg: "#064e3b" },
    { bg: "#d9f99d", fg: "#365314" },
    { bg: "#fecdd3", fg: "#881337" },
    { bg: "#f5d0fe", fg: "#701a75" },
    { bg: "#a5f3fc", fg: "#164e63" },
    { bg: "#fde68a", fg: "#78350f" },
    { bg: "#bae6fd", fg: "#0c4a6e" },
    { bg: "#e2e8f0", fg: "#0f172a" }
];

const size = 8;

function AvatarFromId({ userId, pixelSize }: {
    userId: string;
    pixelSize: number;
}) {
    const [binaryString, setBinaryString] = useState("");
    const [colors, setColors] = useState({ bg: "#FFFFFF", fg: "#000000" });

    useEffect(() => {
        async function generateAvatarData() {
            // Convert the user ID to an ArrayBuffer
            const encoder = new TextEncoder();
            const data = encoder.encode(userId);

            // Hash the data using SHA-256
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);

            // Convert the hash to a binary string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const halfString = hashArray.slice(0, size / 2).map(byte => byte.toString(2).padStart(8, '0')).join('');

            // Mirror the binary string for symmetry
            const mirroredString = halfString + halfString.split('').reverse().join('');


            // Select a color combination based on the first byte of the hash
            const selectedColors = colorCombinations[hashArray[hashArray.length - 1] % 8];

            setBinaryString(mirroredString);
            setColors(selectedColors);
        }

        generateAvatarData();
    }, [userId]);

    if (!binaryString) {
        return <Skeleton
            style={{
                width: size * pixelSize + 4,
                height: size * pixelSize + 4,
            }}
            className='rounded-md'
        />;
    }

    const rows: Array<Array<string>> = [];
    for (let i = 0; i < binaryString.length; i++) {
        const row = Math.floor(i / size);
        const col = i % (size / 2);
        if (!rows[row]) {
            rows[row] = [];
        }
        // Add the pixel to both sides of the row to create the symmetry
        rows[row][col] = binaryString[i];
        rows[row][size - col - 1] = binaryString[i];
    }


    return (
        <div
            className='p-unit-1 ring-foreground ring-opacity-50 ring-1 rounded-md inline-flex items-center justify-center'
            style={{
                backgroundColor: colors.bg,
            }}
        >
            <div
                style={{
                    width: size * pixelSize, display: 'grid', gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`
                }}>
                {rows.map((row, rowIndex) => (
                    row.map((bit, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={clsx({
                                'rounded-full': bit === '1'
                            })}
                            style={{
                                width: pixelSize,
                                height: pixelSize,
                                backgroundColor: bit === '1' ? colors.fg : colors.bg
                            }}
                        />
                    ))
                ))}
            </div>
        </div>
    );
}

export default AvatarFromId;
