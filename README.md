This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Set these variables for MongoDB and instance-specific database naming:

- `INSTANCE_ID` (required)
- `MONGO_STUDYDB_URI` (required)
- `MONGO_STUDYDB_DBNAME_PREFIX` (optional)
- `MONGO_MESSAGE_URI` (optional unless the message DB is used)
- `MONGO_MESSAGE_DBNAME_PREFIX` (optional)
- `MONGO_GLOBAL_URI` (optional unless the global DB is used)
- `MONGO_GLOBAL_DBNAME_PREFIX` (optional)
- `MONGO_USERS_URI` (optional unless the users DB is used)
- `MONGO_USERS_DBNAME_PREFIX` (optional)

Credential variables for MongoDB URIs:

- `STUDY_DB_USERNAME`
- `STUDY_DB_PASSWORD`
- `MESSAGE_DB_USERNAME`
- `MESSAGE_DB_PASSWORD`
- `GLOBAL_DB_USERNAME`
- `GLOBAL_DB_PASSWORD`
- `USERS_DB_USERNAME`
- `USERS_DB_PASSWORD`

The URI vars may include `<username>` and `<password>` placeholders, for example `mongodb+srv://<username>:<password>@cluster.example.mongodb.net/`.

When placeholders are present, the matching credential env vars must also be present. When a credential env var is set, the matching placeholder must also exist in the URI. Placeholder usage is validated strictly at startup, and credentials are URL-encoded before being inserted into the URI.

Database names are derived from `INSTANCE_ID` plus the optional prefix vars:

- study: `{MONGO_STUDYDB_DBNAME_PREFIX}{INSTANCE_ID}_studyDB`
- message: `{MONGO_MESSAGE_DBNAME_PREFIX}{INSTANCE_ID}_messageDB`
- users: `{MONGO_USERS_DBNAME_PREFIX}{INSTANCE_ID}_users`
- global: `{MONGO_GLOBAL_DBNAME_PREFIX}global_infos`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
