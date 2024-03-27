// React and React Router imports
import { redirect } from "react-router-dom";
// Util and I/O imports
import { validateFormDataInAction, generateHttpError } from "./validate";
import { log } from "../util/log";

export const action = async ({ request, params, signal }) => {
  const formData = Object.fromEntries(await request.formData());
  const intent = formData.intent;
  const method = request.method;

  // obj to return as result on edit success
  const result = {
    id: params.eventId,
    requestMethod: method,
    success: "",
  };

  // teplate obj to return on error with edit/delete
  const errorTemplate = {
    id: params.eventId,
    requestMethod: method,
    errorType: "",
    name: `Unsuccessful Action: ${intent} event`,
    message: "",
  };

  /* EDIT event */
  if (request.method === "PATCH" && intent === "edit") {
    // validate form data before fetch
    const error = validateFormDataInAction(formData, errorTemplate);
    if ("errors" in error) {
      log.error(error);
      return error;
    }
    // // convert categoryIds from strings to numbers - to addhere to original events.json formatting
    // formData.categoryIds = formData.categoryIds
    //   .split("")
    //   .reduce((resArr, char) => {
    //     if (char !== ",") {
    //       resArr = [...resArr, Number(char)];
    //     }
    //     return resArr;
    //   }, []);

    const response = await fetch(
      `http://127.0.0.1:3000/events/${params.eventId}`,
      {
        signal,
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      },
    );

    if (!response.ok) {
      log.error("HTTP error @mutate>UPDATE:", response, "\n", request);
      return generateHttpError(errorTemplate, response, formData);
    }
    result.success = response.ok;
    result.formData = formData;
    return result;
  }

  /* DELETE event */
  if (request.method === "DELETE") {
    const response = await fetch(
      `http://127.0.0.1:3000/events/${params.eventId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      log.error("HTTP error @mutate>DELETE:", response, "\n", request);
      return generateHttpError(errorTemplate, response, formData);
    }
    return redirect("/");
  }
};
