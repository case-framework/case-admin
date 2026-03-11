import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCASEManagementAPIURL, getServiceAccountHeaders } from '@/utils/server/api';

export const dynamic = 'force-dynamic';

const studyKeySchema = z.string().min(2).max(50).regex(
    /^[a-zA-Z0-9_-]+$/,
    'Study key must contain only letters, numbers, hyphens, and underscores.'
);

export async function GET(
    request: NextRequest,
    { params: { studyKey } }: { params: { studyKey: string } }
) {
    const parsedStudyKey = studyKeySchema.safeParse(studyKey);
    if (!parsedStudyKey.success) {
        return NextResponse.json(
            { error: 'Invalid studyKey parameter.' },
            { status: 400 }
        );
    }

    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
        return NextResponse.json(
            { error: 'Missing X-API-Key header.' },
            { status: 401 }
        );
    }

    const instanceId = process.env.INSTANCE_ID;
    if (!instanceId) {
        return NextResponse.json(
            { error: 'INSTANCE_ID is not configured.' },
            { status: 500 }
        );
    }

    const url = getCASEManagementAPIURL(
        `/v1/studies/${encodeURIComponent(parsedStudyKey.data)}/data-explorer/responses`
    );
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

    let apiResponse: Response;
    try {
        apiResponse = await fetch(url.toString(), {
            headers: getServiceAccountHeaders(apiKey, instanceId),
            next: {
                revalidate: 0,
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to reach upstream service.' },
            { status: 502 }
        );
    }

    return new NextResponse(apiResponse.body, {
        status: apiResponse.status,
        headers: {
            'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json',
            'Content-Disposition': apiResponse.headers.get('Content-Disposition') || '',
        },
    });
}
