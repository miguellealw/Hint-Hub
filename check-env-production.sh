#!/bin/bash
# Run this script in your Railway deployment to check environment variables

echo "=== NextAuth Environment Check ==="
echo ""
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-NOT SET}"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:+SET (hidden)}"
echo "NODE_ENV: ${NODE_ENV:-NOT SET}"
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:+SET (hidden)}"
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:+SET (hidden)}"
echo "DATABASE_URL: ${DATABASE_URL:+SET (hidden)}"
echo ""
echo "Expected Google Callback URL:"
echo "${NEXTAUTH_URL}/api/auth/callback/google"
echo ""

if [[ ! $NEXTAUTH_URL =~ ^https:// ]]; then
  echo "⚠️  WARNING: NEXTAUTH_URL should start with https:// in production!"
fi

if [[ -z "$NEXTAUTH_SECRET" ]]; then
  echo "❌ ERROR: NEXTAUTH_SECRET is not set!"
fi

if [[ "$NODE_ENV" != "production" ]]; then
  echo "⚠️  WARNING: NODE_ENV should be 'production' in production environment!"
fi
