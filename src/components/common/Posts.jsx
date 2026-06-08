import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId, authUserId }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "following":
        return `${import.meta.env.VITE_API_URL}/api/posts/following`;
      case "forYou":
        return `${import.meta.env.VITE_API_URL}/api/posts/all`;
      case "posts":
        return `${import.meta.env.VITE_API_URL}/api/posts/user/${username}`;
      case "likes":
        return `${import.meta.env.VITE_API_URL}/api/posts/likes/${userId}`;
      default:
        return `${import.meta.env.VITE_API_URL}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(POST_ENDPOINT, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // console.log(data);

        setData(data);
      } catch (error) {
        console.log("Error in getPosts", error.message);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [POST_ENDPOINT]);

  // console.log(data);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && data.length > 0 && (
        <div>
          {data.map((post) => (
            <Post
              key={post._id}
              post={post}
              allPosts={data}
              setAllPosts={setData}
              authUserId={authUserId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
