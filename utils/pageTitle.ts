export const pageTitle = (title: string) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Case Admin';
    return `${title} | ${appName}`;
}
