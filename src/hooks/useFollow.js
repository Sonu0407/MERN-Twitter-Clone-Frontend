import { useState } from "react";
import toast from "react-hot-toast";

const useFollow = (onSuccess) => {
  const [isPending, setIsPending] = useState(false);

  const follow = async (userId) => {
    try {
      setIsPending(true);
      const url = `${import.meta.env.VITE_API_URL}/api/users/follow/${userId}`;
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong!");
      }

      onSuccess?.(userId);

      if (response.ok) {
        toast.success("User followed successfully");
      }

      return data;
    } catch (error) {
      console.log("Error in follow hook", error.message);
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { follow, isPending };
};

export default useFollow;
