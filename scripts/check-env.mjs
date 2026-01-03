#!/usr/bin/env node

/**
 * Environment Variable Checker for NextAuth
 * Run this in production to verify your environment variables are set correctly
 */

console.log('\n=== NextAuth Environment Variable Check ===\n');

const checks = {
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET ? '✓ Set (hidden)' : '✗ NOT SET',
  'NODE_ENV': process.env.NODE_ENV,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID ? '✓ Set (hidden)' : '✗ NOT SET',
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET ? '✓ Set (hidden)' : '✗ NOT SET',
  'DATABASE_URL': process.env.DATABASE_URL ? '✓ Set (hidden)' : '✗ NOT SET',
};

let hasErrors = false;

for (const [key, value] of Object.entries(checks)) {
  console.log(`${key}: ${value}`);

  if (key === 'NEXTAUTH_URL' && value) {
    if (!value.startsWith('https://') && process.env.NODE_ENV === 'production') {
      console.log(`  ⚠️  WARNING: NEXTAUTH_URL should use https:// in production`);
      hasErrors = true;
    }
  }

  if (key === 'NODE_ENV' && value !== 'production') {
    console.log(`  ⚠️  WARNING: NODE_ENV should be 'production' in production environment`);
  }

  if (value === '✗ NOT SET') {
    hasErrors = true;
  }
}

console.log('\n=== Computed Values ===\n');
console.log(`Expected Google Callback URL: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);

if (hasErrors) {
  console.log('\n❌ Some required environment variables are missing or incorrect!');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
}

console.log('\nMake sure the callback URL above matches EXACTLY what is in Google Cloud Console.\n');
