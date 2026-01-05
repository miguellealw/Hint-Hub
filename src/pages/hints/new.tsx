import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Button, Group, TextInput, Tooltip, Title, Box, Loader, createStyles } from '@mantine/core';
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Editor from '../../components/RichTextEditor';
import MainLayout from '../../components/layouts/MainLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import CollectionSelect from '../../components/CollectionSelect';
import useHintForm from '../../hooks/useHintForm';
import { trpc } from '../../utils/trpc';
import { showNotification } from '@mantine/notifications';
import useUnauthed from '../../hooks/useUnauthed';

const useStyles = createStyles((theme) => ({
  heading: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[9],
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  }
}));

const NewHint: NextPage = () => {
  const router = useRouter();
  const { collectionId, hintId } = router.query;
  const { classes } = useStyles();
  const { status } = useUnauthed();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [hintContent, setHintContent] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const hintForm = useHintForm({ title: "", content: "" });

  const utils = trpc.useContext();
  const createHintMutation = trpc.hint.create.useMutation();
  const updateHintMutation = trpc.hint.update.useMutation();

  // Fetch hint data if editing
  const { data: hintData, isLoading: isHintLoading } = trpc.hint.getById.useQuery(
    { id: hintId as string },
    {
      enabled: !!hintId,
      onSuccess: (data) => {
        setIsEditing(true);
        hintForm.setValues({ title: data.title, content: data.content });
        setHintContent(data.content);
        setSelectedCollectionId(data.collectionId);
      }
    }
  );

  // Set initial collection ID from query param
  useEffect(() => {
    if (collectionId && typeof collectionId === 'string' && !hintId) {
      setSelectedCollectionId(collectionId);
    }
  }, [collectionId, hintId]);

  // Focus title input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    hintForm.onSubmit((values) => {
      if (!selectedCollectionId) {
        showNotification({
          title: "Error",
          message: "Please select a collection",
          color: "red"
        });
        return;
      }

      if (isEditing && hintId) {
        updateHintMutation.mutate({
          id: hintId as string,
          title: values.title,
          content: values.content,
        }, {
          onSuccess: () => {
            showNotification({
              title: "Hint updated",
              message: "Hint updated successfully"
            });
            router.push(`/collections/${selectedCollectionId}`);
          },
          onError: (error) => {
            // Parse error message - it might be a JSON array of errors
            try {
              const errors = JSON.parse(error.message);
              if (Array.isArray(errors)) {
                errors.forEach((err: { message: string }) => {
                  showNotification({
                    title: "Error updating hint",
                    message: err.message,
                    color: "red"
                  });
                });
              } else {
                showNotification({
                  title: "Error updating hint",
                  message: error.message,
                  color: "red"
                });
              }
            } catch {
              // If parsing fails, just show the message as-is
              showNotification({
                title: "Error updating hint",
                message: error.message,
                color: "red"
              });
            }
          },
          onSettled: () => {
            utils.hint.getAllByCollectionId.invalidate({
              collectionId: selectedCollectionId,
              searchValue: ""
            });
          }
        });
      } else {
        createHintMutation.mutate({
          title: values.title,
          collectionId: selectedCollectionId,
          content: values.content
        }, {
          onSuccess: () => {
            showNotification({
              title: "Hint created",
              message: "Hint created successfully"
            });
            router.push(`/collections/${selectedCollectionId}`);
          },
          onError: (error) => {
            // Parse error message - it might be a JSON array of errors
            try {
              const errors = JSON.parse(error.message);
              if (Array.isArray(errors)) {
                errors.forEach((err: { message: string }) => {
                  showNotification({
                    title: "Error creating hint",
                    message: err.message,
                    color: "red"
                  });
                });
              } else {
                showNotification({
                  title: "Error creating hint",
                  message: error.message,
                  color: "red"
                });
              }
            } catch {
              // If parsing fails, just show the message as-is
              showNotification({
                title: "Error creating hint",
                message: error.message,
                color: "red"
              });
            }
          },
          onSettled: () => {
            utils.hint.getAllByCollectionId.invalidate({
              collectionId: selectedCollectionId,
              searchValue: ""
            });
          }
        });
      }
    }, hintForm.handleCreateHintError)();
  };

  const handleCancel = () => {
    if (selectedCollectionId) {
      router.push(`/collections/${selectedCollectionId}`);
    } else {
      router.push('/collections');
    }
  };

  if (status === "loading" || (hintId && isHintLoading)) {
    return (
      <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader color="indigo" />
      </Box>
    );
  }

  return (
    <MainLayout containerSize="md">
      <Box className={classes.container}>
        <LoadingOverlay visible={createHintMutation.isLoading || updateHintMutation.isLoading} />

        <Title my="xl" className={classes.heading}>
          {isEditing ? "Update" : "Create"} Hint
        </Title>

        <form onSubmit={handleSubmit}>
          <TextInput
            ref={titleInputRef}
            label="Title"
            placeholder="Title"
            data-autofocus
            {...hintForm.getInputProps('title')}
          />

          <CollectionSelect
            mt="md"
            value={selectedCollectionId}
            onChange={(val) => setSelectedCollectionId(val ?? "")}
            disabled={isEditing}
          />

          <Editor
            mt="lg"
            value={hintContent}
            onContentUpdate={setHintContent}
            form={hintForm}
            initialValues={{ title: hintData?.title || "", content: hintData?.content || "" }}
          />

          <Group mt="lg">
            <Button type="submit" color="indigo.8">
              {isEditing ? "Update" : "Create"}
            </Button>
            <Tooltip label="Cancel - Any new data that was written will be lost">
              <Button color="indigo.8" variant="light" onClick={handleCancel}>
                Cancel
              </Button>
            </Tooltip>
          </Group>
        </form>
      </Box>
    </MainLayout>
  );
};

export default NewHint;
