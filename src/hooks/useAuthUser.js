import { useState, useEffect } from "react";

console.time("authUser");
const useAuthUser = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/auth/me`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setAuthUser(data);
        }
      } catch (error) {
        console.log("Error in useAuthUser hook", error.message);
      }
    };

    getAuthUser();
  }, []);

  return authUser;
};

console.timeEnd("authUser");

export default useAuthUser;
