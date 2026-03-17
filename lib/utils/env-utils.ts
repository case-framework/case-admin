export function mustGetEnv(name: string): string {
    const v = process.env[name];
    if (!v) {
        throw new Error(`Missing env var: ${name}`);
    }
    return v;
}

export function applyMongoConnectionStringCredentials({
    uri,
    username,
    password,
    uriLabel = "MongoDB connection string",
    usernameLabel = "username",
    passwordLabel = "password",
}: {
    uri: string;
    username?: string;
    password?: string;
    uriLabel?: string;
    usernameLabel?: string;
    passwordLabel?: string;
}): string {
    const hasUsernamePlaceholder = uri.includes("<username>");
    const hasPasswordPlaceholder = uri.includes("<password>");

    if (username && !hasUsernamePlaceholder) {
        throw new Error(`${uriLabel} does not contain a <username> placeholder, but ${usernameLabel} is set.`);
    }

    if (password && !hasPasswordPlaceholder) {
        throw new Error(`${uriLabel} does not contain a <password> placeholder, but ${passwordLabel} is set.`);
    }

    if (hasUsernamePlaceholder && !username) {
        throw new Error(`${uriLabel} contains a <username> placeholder, but ${usernameLabel} is not set.`);
    }

    if (hasPasswordPlaceholder && !password) {
        throw new Error(`${uriLabel} contains a <password> placeholder, but ${passwordLabel} is not set.`);
    }

    let resolvedUri = uri;

    if (username) {
        resolvedUri = resolvedUri.replaceAll("<username>", encodeURIComponent(username));
    }

    if (password) {
        resolvedUri = resolvedUri.replaceAll("<password>", encodeURIComponent(password));
    }

    return resolvedUri;
}
