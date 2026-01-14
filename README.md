# SCRCR Frontend

This is the frontend for the Senior Citizen Recreation Centre website, built with React, TypeScript, and Vite.

## Production URL

**https://scrcr-frontend.vercel.app**

## Environment Variables

To run this locally or on Vercel, ensure you have the following environment variable set:

- `VITE_API_BASE`: The URL of the backend API (e.g., `https://scrcr-backend.vercel.app` or `http://localhost:8081` for local dev).

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is deployed on Vercel. It is configured to build automatically when changes are pushed to the `main` branch.

### Vercel Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x (Pinned in `package.json` engines)
