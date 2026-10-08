const retryableStatuses = new Set([429, 502, 503, 504]);
const maxRetries = 2;
const maxRetryDelay = 30_000;

const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

// Retry only retrieval. The browser save must happen once, after this succeeds.
export const fetchParticipantFile = async (url: string): Promise<{ blob: Blob; fileName?: string }> => {
    for (let attempt = 0; ; attempt++) {
        const backoff = 500 * (attempt + 1);
        let response: Response;
        try {
            response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                return {
                    blob: await response.blob(),
                    fileName: response.headers.get('Content-Disposition')?.split('filename=')[1],
                };
            }
        } catch (error) {
            if (attempt >= maxRetries || (error instanceof Error && error.name === 'AbortError')) {
                throw error;
            }
            await wait(backoff);
            continue;
        }

        const body = await response.json().catch(() => null);
        const message = body?.error || `Failed to download file (HTTP ${response.status})`;
        if (!retryableStatuses.has(response.status) || attempt >= maxRetries) {
            throw new Error(message);
        }

        const retryAfter = response.headers.get('Retry-After')?.trim();
        const retryAfterDelay = retryAfter
            ? (/^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now())
            : 0;
        const delay = Math.max(backoff, Number.isFinite(retryAfterDelay) ? retryAfterDelay : 0);
        if (delay > maxRetryDelay) {
            // Do not retry earlier than requested or hold up the whole batch for a long wait.
            throw new Error(`${message}. Please retry this file later.`);
        }
        await wait(delay);
    }
};
