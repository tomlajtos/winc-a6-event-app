// React and RRouter imports
import { useState } from "react";
import { Form } from "react-router-dom";

// Context imports
// import { RootContext } from "../context/RootContext";

// chakra-ui imports
import {
  useToast,
  Button,
  Checkbox,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

// util imports
import {
  handleCheckboxChanges,
  // setCheckedStateArr,
  generateDateTimeStr,
} from "../../util/globalFunctions";
import { validate } from "../../util/validate";

export const EditEventForm = ({ categories, event, onClose }) => {
  const [categoryIds, setCategoryIds] = useState(event.categoryIds);
  // const [isChecked, setIsChecked] = useState(
  // setCheckedStateArr(categories, categoryIds)
  // );
  const [inputErrors, setInputErrors] = useState(new Map());
  const toast = useToast();

  // TODO: move to utils, add jsDOC comments
  const getErrMsg = (name) => {
    if (inputErrors.has(name)) {
      const msg = inputErrors.get(name).message;
      return msg;
    }
  };

  // TODO: move to utils, add jsDOC comments
  const isInvalidInput = (name) => {
    return inputErrors.has(name);
  };

  // NOTE: 'novalidate' attr. of form prevents the built in validation, useful when custom validation is used
  //
  return (
    <Stack
      as={Form}
      method="post"
      action="edit"
      direction="column"
      spacing={5}
      p={4}
      maxW="500px"
      onSubmit={(e) => (inputErrors.size > 0 ? e.preventDefault() : onClose())}
    >
      {/* INPUT for title */}
      <FormControl isRequired isInvalid={isInvalidInput("title")}>
        <FormLabel fontWeight="bolder">Title</FormLabel>
        <Input
          type="text"
          name="title"
          defaultValue={event.title}
          onChange={(e) => {
            validate(
              inputErrors,
              e.target,
              /*isChecked*/ categoryIds,
              setInputErrors
            );
          }}
          onInvalid={(e) => e.preventDefault()}
          isInvalid={inputErrors.has("title")}
        />
        <FormErrorMessage>{getErrMsg("title")}</FormErrorMessage>
      </FormControl>

      {/* FIELDSET for start/endTime */}
      <Stack as="fieldset" direction="column" spacing={2}>
        <Text as="legend" pb={1} fontWeight="bolder">
          Date and Time
        </Text>
        {/* INPUT for startTime */}
        <FormControl
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          isRequired
          isInvalid={isInvalidInput("startTime")}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <FormLabel margin={0} px={2}>
              Start
            </FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              defaultValue={generateDateTimeStr(event.startTime)}
              justifySelf="stretch"
              onChange={(e) => {
                validate(
                  inputErrors,
                  e.target,
                  /*isChecked*/ categoryIds,
                  setInputErrors
                );
              }}
              onInvalid={(e) => e.preventDefault()}
            />
          </Stack>
          <FormErrorMessage alignSelf="end" py={1}>
            {getErrMsg("startTime")}
          </FormErrorMessage>
        </FormControl>

        {/* INPUT for endTime */}
        <FormControl
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          isInvalid={isInvalidInput("endTime")}
          isRequired
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <FormLabel margin={0} px={2}>
              End
            </FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              defaultValue={generateDateTimeStr(event.endTime)}
              onInput={(e) => {
                validate(
                  inputErrors,
                  e.target,
                  /*isChecked*/ categoryIds,
                  setInputErrors
                );
              }}
              onInvalid={(e) => e.preventDefault()}
            />
          </Stack>
          <FormErrorMessage alignSelf="end" py={1}>
            {getErrMsg("endTime")}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      {/* INPUT for description */}
      <FormControl isRequired isInvalid={isInvalidInput("description")}>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          defaultValue={event.description}
          onChange={(e) => {
            validate(
              inputErrors,
              e.target,
              /*isChecked*/ categoryIds,
              setInputErrors
            );
          }}
          onInvalid={(e) => e.preventDefault()}
        />
        <FormErrorMessage>{getErrMsg("description")}</FormErrorMessage>
      </FormControl>

      {/* CHECKBOX GR. for categories */}
      <FormControl as={"fieldset"} isInvalid={isInvalidInput("categoryIds")}>
        <Text as="legend" fontWeight="bolder" pb={1}>
          Categories
          <Text as="span" pl={1} color="red.500">
            *
          </Text>
        </Text>
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          {categories.map((category) => (
            <Checkbox
              id={category.id}
              key={category.id}
              name="categoryIds"
              isChecked={categoryIds.includes(category.id)}
              value={categoryIds}
              onChange={(e) => {
                handleCheckboxChanges(
                  e,
                  // isChecked,
                  // setIsChecked,
                  setCategoryIds
                );

                validate(
                  inputErrors,
                  e.target,
                  /*isChecked*/ categoryIds,
                  setInputErrors
                );
              }}
              onInvalid={(e) => e.preventDefault()}
            >
              {category.name}
            </Checkbox>
          ))}
        </Stack>
        <FormErrorMessage>{getErrMsg("categoryIds")}</FormErrorMessage>
      </FormControl>

      {/* INPUT for image(url) */}
      <FormControl isInvalid={isInvalidInput("image")}>
        <FormLabel fontWeight="bolder">Add an image (URL)</FormLabel>
        <Input
          type="url"
          name="image"
          defaultValue={event.image}
          placeholder="https://eventimagesource.com/eventimage"
          onChange={(e) => {
            validate(
              inputErrors,
              e.target,
              /*isChecked*/ categoryIds,
              setInputErrors
            );
          }}
          onInvalid={(e) => e.preventDefault()}
        />
        <FormErrorMessage>{getErrMsg("image")}</FormErrorMessage>
      </FormControl>

      {/* edit form button */}
      <Stack direction="row" spacing={2} py={4} px={0} justifyContent="end">
        <Button
          type="submit"
          variant="ghost"
          size="lg"
          colorScheme="purple"
          onClick={(e) => {
            if (inputErrors.size > 0) {
              e.preventDefault();

              toast({
                title: "Editing is incomplete",
                description: "Please complete the required fields.",
                duration: 4000,
                position: "top",
                status: "error",
                isClosable: true,
              });
            }
          }}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          colorScheme="red"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
