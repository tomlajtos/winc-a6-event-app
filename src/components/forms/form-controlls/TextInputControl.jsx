import { FormControl, FormLabel, Text } from "@chakra-ui/react";
import { Input } from "../../ui/Input";

export const TextInputControl = ({
  label,
  inputName,
  defaultValue,
  errors,
  showAsRequired,
}) => {
  return (
    <FormControl>
      <FormLabel fontWeight="bolder">
        {label}
        {showAsRequired && (
          <Text as="span" pl={1} color="red.500">
            *
          </Text>
        )}
      </FormLabel>
      <Input type="text" name={inputName} defaultValue={defaultValue} />
      {errors && errors[inputName] && (
        <Text color="red.500" fontStyle="italic" py={1} px={2}>
          {errors[inputName]}
        </Text>
      )}
    </FormControl>
  );
};
