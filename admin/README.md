# ayeLearn Admin Frontend

## Environment Configuration

### Setup

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Configure your environment variables in `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development
```

### Environment Variables

- `VITE_API_BASE_URL`: The base URL for the backend API (default: http://localhost:5000)
- `VITE_NODE_ENV`: The environment mode (development/production)

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### API Configuration

The application uses a centralized API configuration located in `src/config/api.js` that automatically uses the environment variables.

All API calls are now configured to use the `VITE_API_BASE_URL` environment variable instead of hardcoded URLs.
