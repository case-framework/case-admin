import caseAdminAPIInstance from "@/utils/server/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const response = await caseAdminAPIInstance.get(`/v1/studies`,
            {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            }
        );
        res.status(200).json(response.data)
        return

    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


}
