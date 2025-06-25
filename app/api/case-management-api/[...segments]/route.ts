import { NextRequest, NextResponse } from "next/server";
import { getCASEManagementAPIURL, getTokenHeader } from "@/utils/server/api";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ segments: string[] }> }) {
    const params = await props.params;

    const {
        segments
    } = params;

    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        console.error(`Unauthorized access to case-api: ${request.nextUrl.toString()}`)
        return new NextResponse(
            JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    })

    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.CASEaccessToken) },
        next: {
            revalidate: 0,
        }
    });

    const resp = new NextResponse(apiResponse.body, {
        status: apiResponse.status,
        headers: {
            'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json',
            'Content-Disposition': apiResponse.headers.get('Content-Disposition') || '',
        }
    });
    return resp;
}


export async function POST(request: NextRequest, props: { params: Promise<{ segments: string[] }> }) {
    const params = await props.params;

    const {
        segments
    } = params;

    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        console.error(`Unauthorized access to case-api: ${request.nextUrl.toString()}`)
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const body = await request.json();

    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.CASEaccessToken) },
        method: 'POST',
        body: JSON.stringify(body),
        next: {
            revalidate: 0,
        }
    });

    const resp = new NextResponse(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ segments: string[] }> }) {
    const params = await props.params;

    const {
        segments
    } = params;

    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        console.error(`Unauthorized access to case-api: ${request.nextUrl.toString()}`)
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.CASEaccessToken) },
        method: 'DELETE',
    });

    const resp = new NextResponse(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;
}
