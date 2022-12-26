import { Button, Container, Group, Input, Loader, TextInput, Title } from "@mantine/core"
import { IconFilePlus, IconSearch } from "@tabler/icons";
import { type NextPage } from "next";
import { InputWithButton } from "./components/InputWithButton";
import MainLayout from "./components/layouts/MainLayout";
import MainHeader from "./components/MainHeader";

const Hints: NextPage = () => {

  return (
    <MainLayout containerSize="md">
      <Group position="apart" align="center" my="xl">
        <Title align="center">Terminal Commands</Title>
        <Button color="indigo.8" leftIcon={<IconFilePlus />}>
          Create Hint
        </Button>

      </Group>
      <InputWithButton />
    </MainLayout>
  )
}


export default Hints;