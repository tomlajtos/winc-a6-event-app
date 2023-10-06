//TODO: add `onChange` handler to checkboxes form should submit an array of categoryIds, defult option will do for now
import { Form, redirect } from "react-router-dom";
import { useRoot } from "../context/RootContext";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Stack,
} from "@chakra-ui/react";

export const action = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  console.log("request.formData:", formData);

  const response = await fetch("http://localhost:3003/events", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  console.log("form post-data:", data);
  return redirect(`/event/${data.id}`);
};

export const NewEventPage = () => {
  const { categories } = useRoot();
  return (
    <Form method="post">
      <Stack direction="column" spacing={5} backgroundColor={"gray.400"} p={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input type="text" name="title" />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Start date and time</FormLabel>
          <Input type="datetime-local" name="startTime" />
          <FormHelperText>Select the date and time</FormHelperText>
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>End date and time</FormLabel>
          <Input type="datetime-local" name="endTime" />
          <FormHelperText>Select the date and time</FormHelperText>
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Provide a short description</FormLabel>
          <Textarea name="description" />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Categories</FormLabel>
          <CheckboxGroup colorScheme="purple" defaultValue={[3]}>
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  name="categoryIds"
                  value={category.id}
                >
                  {category.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Add an image URL</FormLabel>
          <Input type="url" name="image" />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack spacing={2} py={4}>
        <Button type="submit" variant={"outline"} colorScheme="purple">
          Save
        </Button>
        <Button type="reset" variant={"outline"} colorScheme="red">
          Cancel
        </Button>
      </Stack>
    </Form>
  );
};