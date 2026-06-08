import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

import useAuthUser from "../../../hooks/useAuthUser.js";

const CreatePost = ({ setData, data }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const authUser = useAuthUser();

  const imgRef = useRef(null);

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {}, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !img) {
      return toast.error("Post cannot be empty.");
    } else {
      try {
        setIsPending(true);
        const url = `${import.meta.env.VITE_API_URL}/api/posts/create`;
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            img,
          }),
        });

        const newPost = await response.json();

        if (!response.ok) {
          throw new Error(newPost.error || "Something Went Wrong");
        } else {
          toast.success("Post Create Successfully");
          window.location.reload();
          setData((prevPosts) => [newPost, ...prevPosts]);
          setText("");
          setImg(null);
        }
        // console.log("new Post: ", newPost);
      } catch (error) {
        console.log("Error in handleSubmit CreatePost.jsx", error.message);
        toast.error("Failed To Create Post");
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImage || "/avatar-placeholder.png"} />
          {/* what is the question mark over there 
            "If authUser exists, give me authUser._id. Otherwise return undefined."
          */}
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-[#1A77F2] w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill
              className="fill-[#1A77F2] w-5 h-5 cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            />

            {showPicker && (
              <EmojiPicker
                onEmojiClick={(emojiData) =>
                  setText((prev) => prev + emojiData.emoji)
                }
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn bg-[#1A77F2] rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
