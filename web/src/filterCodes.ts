import { FilterFromCode, FilterObject } from "./types";

const serverURL =
  process.env.NODE_ENV === "production"
    ? "https://f-filter-server.herokuapp.com/"
    : "http://192.168.0.23:3000";

export const codeToFilter = async (code: string) => {
  const response = await fetch(`${serverURL}/${code}`);
  const json = await response.json();
  return json as FilterFromCode;
};

export const filterToCode = async (filterObjects: FilterObject[]) => {
  const response = await fetch(`${serverURL}/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterObjects,
    }),
  });

  const json = await response.json();
  return json as FilterFromCode;
};
