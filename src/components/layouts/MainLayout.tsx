import { Container, createStyles, type MantineNumberSize } from '@mantine/core'
import MainHeader from '../MainHeader'
import Waves from '../Waves';

const useStyle = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    minHeight: "100vh",
    width: "100vw",
    position: 'relative'
  },
  container: {
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    minHeight: "calc(100vh - 60px - 40px)",
  },

  waves: {
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',

    [theme.breakpoints.sm]: {
      bottom: 0
    }

  }
}))

type MainLayoutProps = {
  children: React.ReactNode;
  containerSize: MantineNumberSize;
  className?: string;
  containerClass?: string;
}

export default function MainLayout({ children, containerSize, containerClass, ...props }: MainLayoutProps) {
  const { classes } = useStyle();
  return (
    <div className={classes.wrapper}>
      <MainHeader />
      <main {...props}>
        <Container size={containerSize} className={containerClass ? `${classes.container} ${containerClass}` : classes.container}>
          {/* <Container size={containerSize} className={containerClass}> */}
          {children}
        </Container>
      </main>
    </div>
  )
}

export function MainLandingLayout({ children, containerSize, containerClass, ...props }: MainLayoutProps) {
  const { classes } = useStyle();
  return (
    <div className={classes.wrapper}>
      <MainHeader />
      <Waves className={classes.waves} />
      <main {...props}>
        <Container size={containerSize} className={containerClass ? `${classes.container} ${containerClass}` : classes.container}>
          {/* <Container size={containerSize} className={containerClass}> */}
          {children}
        </Container>
      </main>
    </div>
  )
}