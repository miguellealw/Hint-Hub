import { useRouter } from 'next/router';
import { Center, Title, Text, Button, Stack, Code } from '@mantine/core';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    OAuthSignin: 'Error in constructing an authorization URL.',
    OAuthCallback: 'Error in handling the response from an OAuth provider.',
    OAuthCreateAccount: 'Could not create OAuth provider user in the database.',
    EmailCreateAccount: 'Could not create email provider user in the database.',
    Callback: 'Error in the OAuth callback handler route.',
    OAuthAccountNotLinked: 'Email is already associated with another account.',
    EmailSignin: 'Sending the e-mail with the verification token failed.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'Unable to sign in.',
  };

  const errorMessage = error && typeof error === 'string'
    ? (errorMessages[error] ?? errorMessages.Default)
    : errorMessages.Default;

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Stack align="center" spacing="lg">
        <Title order={1}>Authentication Error</Title>
        <Text size="lg" color="dimmed">
          {errorMessage}
        </Text>
        {error && (
          <Code block style={{ maxWidth: '600px' }}>
            Error code: {error}
          </Code>
        )}
        <Link href="/" passHref>
          <Button component="a">Return Home</Button>
        </Link>
        <Button
          variant="subtle"
          onClick={() => router.push('/api/auth/signin')}
        >
          Try Again
        </Button>
      </Stack>
    </Center>
  );
}
