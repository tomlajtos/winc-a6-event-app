// TODO: refactor get data to only return promisses as obj.prop values
// resolve the promisses in the loader function ?? maybe it is less confusing this way
export const getData = async (
  endpoints = [{ name: "categories", path: "/categories" }]
) => {
  // const baseUrl = "http://localhost:3003";
  // const events = await fetch(`${baseUrl}/${endpoint}`);
  // if (!events.ok) {
  //   console.warn(events);
  //   throw new Error(`${events.status} (${events.statusText})`);
  // }
  // return {
  //   events: await events.json(),
  // };
  const baseUrl = "http://localhost:3003";
  // reduce can't handle async
  const getFn = async (endpoint) =>
    await fetch(`${baseUrl}${endpoint.path}`).then((r) =>
      // r.json());

      // /* ?for error? */
      {
        if (r.ok) {
          return r.json();
        } else {
          console.warn(r);
          throw new Error(`${r.status} (${r.statusText})`);
        }
      }
    );

  const dataObj = endpoints.reduce((obj, endpoint) => {
    Object.assign(obj, { [endpoint.name]: "" });
    obj[endpoint.name] = getFn(endpoint);
    return obj;
  }, {});
  return dataObj;
};

// TODO: I'm note sure if I like this, think about a better solution
//
// helper function for React Router loader function
export const fetchData = async (
  endpoints = [{ name: "categories", path: "/categories" }]
) => {
  const baseUrl = "http://localhost:3003";
  // reduce can't handle async
  const getFn = async (endpoint) =>
    await fetch(`${baseUrl}${endpoint.path}`).then((r) =>
      // r.json());

      // /* ?for error? */
      {
        if (r.ok) {
          return r.json();
        } else {
          console.warn(r);
          throw new Error(`${r.status} (${r.statusText})`);
        }
      }
    );

  const dataObj = endpoints.reduce((obj, endpoint) => {
    Object.assign(obj, { [endpoint.name]: "" });
    obj[endpoint.name] = getFn(endpoint);
    return obj;
  }, {});

  // re-assign dataObj key values with their awaited self, as they are resolved Promise objects
  for (let key in dataObj) {
    dataObj[key] = await dataObj[key];
  }
  return dataObj;
};

// Categories related checkbox handler and support functions
//
// function to create checkedItemMap from an Array of objects
// key: obj.id, value: initValue: boolean;
// this map can be used to track the checked state of checkbox group items
// obj.id and e.target.id has to be the same value and type
// i.e. event categories in nav menu filter options, and in new event form to set categories
export const initCheckedItemMap = (objArr, initValue = true) =>
  objArr.map((item) => [Number(item.id), initValue]);

// function to handle onChange event in a group of checkboxes
export const handleCheckboxChanges = (e, checkedMap, setFn, setFn2) => {
  const id = e.target.id;
  // create and mutate a local copy of checkedMap
  const newChecked = new Map([...checkedMap]);
  const chkd = newChecked.get(Number(id));
  newChecked.set(Number(id), !chkd);
  // set copy as new state for checkedMap
  setFn(new Map([...newChecked]));

  if (setFn2) {
    // create an array of checked id and set it as new state with setFn2
    setFn2(createCheckedIdsArr(newChecked));
  }
};

// generic function to create an array of checked checkbox Ids from a Map of {id,boolean} key - value pairs
export const createCheckedIdsArr = (checkedMap) =>
  Array.from(checkedMap).reduce(
    (ids, cat) => (cat[1] === true ? (ids = [...ids, cat[0]]) : ids),
    []
  );

export const formatDateAndTime = (dateStr) => {
  const date = new Date(dateStr);
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const shortDateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    // timeZoneName: "shortOffset",
  };

  const shortDate = date.toLocaleDateString("en-GB", shortDateOptions);
  const fullDate = date.toLocaleDateString("en-GB", dateOptions);
  const fullTime = date.toLocaleTimeString("en-GB", timeOptions);

  return { shortDate: shortDate, date: fullDate, time: fullTime };
};
