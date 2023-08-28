export interface ApiError extends Error {
    info: any;
    status: number;
}

export const AuthAPIFetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        if (res.status === 401) {
            const error = new Error('Unauthorized') as ApiError;
            throw error;
        }
        if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.') as ApiError;
            // Attach extra info to the error object.
            error.info = await res.json();
            error.status = res.status
            throw error
        }
        return res.json()
    } catch (error) {
        console.error(error)
        throw error;
    }
};
