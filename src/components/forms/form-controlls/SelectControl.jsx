import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Select } from "../../ui/Select";
import { validate, getErrMsg, isInvalidInput } from "../../../util/validate";

export const SelectControl = ({
  label,
  inputName,
  defaultValue,
  isRequired,
  users,
  categoryIds,
  errors,
  setErrors,
}) => {
  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={isInvalidInput(errors, inputName)}
    >
      <FormLabel fontWeight="bolder">{label}</FormLabel>
      <Select
        name={inputName}
        placeholder="Select a user"
        defaultValue={defaultValue}
        onChange={(e) => validate(errors, e.target, categoryIds, setErrors)}
        onInvalid={(e) => e.preventDefault()}
      >
        <option name="createdBy">{"Phantom of the EventApp"}</option>
        {users.map((user) => (
          <option key={user.id} name="createdBy" value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{getErrMsg(errors, inputName)}</FormErrorMessage>
    </FormControl>
  );
};
