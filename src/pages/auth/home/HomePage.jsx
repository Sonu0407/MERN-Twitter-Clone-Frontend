import { useEffect, useState } from "react";

import Posts from "../../../components/common/Posts";
import CreatePost from "./CreatePost";
import useGetAllPosts from "../../../hooks/useGetAllPosts.js";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPostEndpoint = () => {
    switch (feedType) {
      case "foryou":
        return `${import.meta.env.VITE_API_URL}/api/posts/all`;
      case "following":
        return `${import.meta.env.VITE_API_URL}/api/posts/following`;
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
          throw new Error(data.error || "Something Went Wrong");
        }

        setData(data);
      } catch (error) {
        console.log("Error in get post functionality", error.message);
        toast.error("failed to fetch the posts.");
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [POST_ENDPOINT]);

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost setData={setData} />

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
