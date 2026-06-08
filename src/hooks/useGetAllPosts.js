import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(false);
      const url = `${import.meta.env.VITE_API_URL}/api/posts/all`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setPosts(data);
    } catch (error) {
      console.log("Error in fetch posts", error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    setPosts,
    isLoading,
    refetchPosts: fetchPosts,
  };
};

export default useGetAllPosts;
