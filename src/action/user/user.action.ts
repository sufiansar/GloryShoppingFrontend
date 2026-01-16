import { makeApiCall } from "../apiClinet";

export const getMyProfile = async () => {
  return makeApiCall("/user/my-profile", {
    method: "GET",
  });
};
