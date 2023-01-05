import { Container, createStyles, type MantineNumberSize } from '@mantine/core'
import MainHeader from '../MainHeader'

const useStyle = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: "100vh",
  },
  container: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  }
}))

type MainLayoutProps = {
  children: React.ReactNode;
  containerSize: MantineNumberSize;
  className?: string;
}



export default function MainLayout({ children, containerSize, ...props }: MainLayoutProps) {
  const { classes } = useStyle();
  return (
    <div className={classes.wrapper}>
      <MainHeader />
      <Container size={containerSize} className={classes.container}>
        <main {...props}>{children}</main>
      </Container>
    </div>
  )
}