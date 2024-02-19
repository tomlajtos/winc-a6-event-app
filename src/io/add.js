import { redirect } from "react-router-dom";
import { validateFormDataInAction, generateHttpError } from "./validate";
import { log } from "../util/log";

export const action = async ({ request }) => {
  const method = request.method;
  const formData = Object.fromEntries(await request.formData());

  // base obj to return on error with edit/delete
  const error = {
    requestMethod: method,
    name: "Unsuccessful Action: create new event",
    error: {},
    data: {},
  };

  // validate form data before fetch
  validateFormDataInAction(formData, error);

  if (Object.keys(error.error).length > 0) {
    log.error("Input Error @add.js>action", error);
    return error;
  }

  // convert categoryIds from strings to numbers - to addhere to original events.json formatting
  formData.categoryIds = formData.categoryIds
    .split("")
    .reduce((resArr, char) => {
      if (char !== ",") {
        resArr = [...resArr, Number(char)];
      }
      return resArr;
    }, []);

  const response = await fetch("http://localhost:3003/events", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    log.error("HTTP error @NewEventPage>action:", response, "\n", request);
    return generateHttpError(error, response, formData);
  }

  const json = await response.json();
  const newEventId = await json.id;

  return redirect(`/event/${newEventId}`);
};