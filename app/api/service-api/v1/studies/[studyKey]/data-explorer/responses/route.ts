import { NextRequest, NextResponse } from 'next/server';
import { getCASEManagementAPIURL, getServiceAccountHeaders } from '@/utils/server/api';
import { studyKeySchema } from '@/utils/server/schemas';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ studyKey: string }> }) {
    const params = await props.params;

    const {
        studyKey
    } = params;

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
