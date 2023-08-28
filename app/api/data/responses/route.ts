import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getCASEManagementAPIURL, getTokenHeader } from "@/utils/server/api";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.accessToken === undefined) {
        throw new Error("unauthenticated");
    }

    console.log(request.nextUrl.searchParams)
    const studyKey = request.nextUrl.searchParams.get('studyKey');
    if (!studyKey) {
        throw new Error("studyKey not provided");
    }
    const surveyKey = request.nextUrl.searchParams.get('surveyKey');
    if (!surveyKey) {
        throw new Error("surveyKey not provided");
    }
    let format = '';
    if (request.nextUrl.searchParams.get('format') === 'long') {
        format = '/long-format'
    } else if (request.nextUrl.searchParams.get('format') === 'json') {
        format = '/json'
    }

    const url = getCASEManagementAPIURL(`/v1/data/${studyKey}/survey/${surveyKey}/response${format}`);
    url.searchParams.set('from', request.nextUrl.searchParams.get('from') || '');
    url.searchParams.set('until', request.nextUrl.searchParams.get('until') || '');
    url.searchParams.set('shortKeys', request.nextUrl.searchParams.get('useShortKeys') || 'false');
    url.searchParams.set('sep', request.nextUrl.searchParams.get('separator') || '-');

    const r = await fetch(url.toString(), {
        method: 'GET',
        headers: { ...getTokenHeader(session.accessToken) },
        next: { revalidate: 30 }
    });
    if (r.status !== 200) {
        return new Response(r.body, { status: r.status, statusText: r.statusText });
    }

    const resp = new Response(r.body,
        {
            status: r.status,
            statusText: r.statusText,
            headers: r.headers,
        });
    return resp;

}
