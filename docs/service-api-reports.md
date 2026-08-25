# Service API: reports explorer

This document describes the Next.js proxy that exposes the CASE Management API report explorer to service accounts. It follows the same authentication and forwarding pattern as the survey-response service API.

## Endpoint

```http
GET /api/service-api/v1/studies/{studyKey}/data-explorer/reports
```

- **`studyKey`**: Study identifier. It must be 2–50 characters and match `[a-zA-Z0-9_-]+`.

The proxy forwards the request, including its query string, to:

```text
{MANAGEMENT_API_URL}/v1/studies/{studyKey}/data-explorer/reports
```

## Authentication

Send the service account API key in the `X-API-Key` header:

| Header | Required | Description |
| --- | --- | --- |
| `X-API-Key` | Yes | Service account API key |

The app adds the `X-Instance-ID` header from its `INSTANCE_ID` environment variable. Callers do not provide this header.

## Query parameters

All query parameters are forwarded unchanged to the Management API. The report explorer supports these parameters:

| Parameter | Description |
| --- | --- |
| `reportKey` | Filter results to a report key. |
| `pid` | Filter results to a participant ID. |
| `from` | Include reports from this Unix timestamp (seconds). |
| `until` | Include reports up to this Unix timestamp (seconds). |
| `page` | Page number to return. |
| `limit` | Maximum reports per page. |

For example:

```text
?reportKey=weekly-summary&pid=participant-123&from=1735689600&until=1738368000&page=1&limit=50
```

Refer to the [Management API report operation](https://case-framework.github.io/case-docs/tech-docs/management-api/api/reports/dataExplorer_listReports/) for the authoritative response schema and any server-version-specific parameters.

## Successful response

The proxy does not transform the Management API response:

- The upstream status code is returned as-is (normally `200`).
- The response body contains the report data and pagination information defined by the Management API.
- `Content-Type` and `Content-Disposition` headers are relayed when supplied by the upstream API.

## Error responses

| Status | Meaning |
| --- | --- |
| `400` | Invalid `studyKey`; JSON body: `{ "error": "Invalid studyKey parameter." }` |
| `401` | Missing `X-API-Key`; JSON body: `{ "error": "Missing X-API-Key header." }` |
| `500` | `INSTANCE_ID` is not configured in the app; JSON body: `{ "error": "INSTANCE_ID is not configured." }` |
| `502` | The proxy could not reach the Management API; JSON body: `{ "error": "Failed to reach upstream service." }` |

For upstream errors such as `403`, `404`, or validation errors, the proxy returns the upstream status and body unchanged.

## Example: `curl`

Replace the placeholder values with your app URL, study key, and service account API key.

```bash
BASE_URL="https://your-app.example.com"
STUDY_KEY="your-study"
API_KEY="your-service-account-api-key"

curl --silent --show-error --fail-with-body \\
  -H "X-API-Key: ${API_KEY}" \\
  "${BASE_URL}/api/service-api/v1/studies/${STUDY_KEY}/data-explorer/reports?reportKey=weekly-summary&page=1&limit=50"
```

## App configuration

The proxy requires the same server-side settings as the other service API routes:

- `MANAGEMENT_API_URL`: Base URL of the CASE Management API.
- `INSTANCE_ID`: Sent to the Management API as `X-Instance-ID`.
