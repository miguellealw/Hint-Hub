import { useMediaQuery } from "@mantine/hooks";

const useLargeScreen = () => useMediaQuery('(min-width: 900px)');


export { useLargeScreen }