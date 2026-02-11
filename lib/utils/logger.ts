function getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
}

const formatMessage = (
    prefix: string,
    message: unknown, ...args: unknown[]) => {
    return `[${prefix}] [${getTimestamp()}] ${message} ${args.map((arg) => JSON.stringify(arg)).join(" ")}`;
}

export const logger = (prefix: string) => ({

    info: (message: unknown, ...args: unknown[]) => {
        console.log(formatMessage(prefix, message, ...args));
    },
    error: (message: unknown, ...args: unknown[]) => {
        console.error(formatMessage(prefix, message, ...args));
    },
});