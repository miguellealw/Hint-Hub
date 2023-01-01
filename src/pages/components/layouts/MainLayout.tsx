import { Container, createStyles, MantineNumberSize } from '@mantine/core'
import { useSession } from 'next-auth/react';
import MainHeader from '../MainHeader'


type MainLayoutProps = {
  children: React.ReactNode;
  containerSize: MantineNumberSize;
  className?: string;
}

export default function MainLayout({ children, containerSize, ...props }: MainLayoutProps) {
  return (
    <>
      <MainHeader />
      <Container size={containerSize}>
        <main {...props}>{children}</main>
      </Container>
    </>
  )
}