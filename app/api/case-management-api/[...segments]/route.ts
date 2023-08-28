import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL, getTokenHeader } from "@/utils/server/api";

export async function GET(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
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
        headers: { ...getTokenHeader(session.accessToken) },
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

export async function POST(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        console.error(`Unauthorized access to case-api: ${request.nextUrl.toString()}`)
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const body = await request.json();

    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.accessToken) },
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

export async function DELETE(request: NextRequest, { params: { segments } }: { params: { segments: string[] } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        console.error(`Unauthorized access to case-api: ${request.nextUrl.toString()}`)
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const url = getCASEManagementAPIURL(segments.join('/'))
    const apiResponse = await fetch(url.toString(), {
        headers: { ...getTokenHeader(session.accessToken) },
        method: 'DELETE',
    });

    const resp = new NextResponse(apiResponse.body, {
        status: apiResponse.status,
        headers: { 'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json' }
    });

    return resp;
}
