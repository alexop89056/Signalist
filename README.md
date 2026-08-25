# Signalist

Privacy-conscious web analytics for portfolio sites and SaaS products.

## Architecture

- `frontend/public/tracker.js` — standalone script loaded with a `<script>` tag.
- `frontend/sdk/react.js` — React provider and `useTrackEvent` hook.
- `backend` — Spring Boot API that receives events and provides aggregate metrics.
- `frontend/app` — Next.js analytics dashboard.

## Connect a plain JavaScript site

```html
<script
  defer
  src="https://your-domain.com/tracker.js"
  data-site-id="site_demo_8fk2"
  data-endpoint="https://api.your-domain.com/api/v1/events">
</script>
```

Send a custom event with `window.Signalist.track("signup_completed")`.

## Run locally

```bash
cd backend && ./gradlew bootRun
cd ../frontend && npm install && npm run dev
```

The API uses H2 in-memory storage locally. Configure `SPRING_DATASOURCE_URL`, username, and password for PostgreSQL in deployment.
