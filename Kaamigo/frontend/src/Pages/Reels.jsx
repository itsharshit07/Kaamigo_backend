import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegComment, FaShareAlt } from "react-icons/fa";

const dummyVideos = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://media.w3.org/2010/05/bunny/movie.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://media.w3.org/2010/05/bunny/movie.mp4",
];

const Reels = () => {
  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState({});
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setVideos(dummyVideos);
    }, 500);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;

      if (e.key === "ArrowDown") {
        containerRef.current.scrollBy({ top: 667, behavior: "smooth" });
      }
      if (e.key === "ArrowUp") {
        containerRef.current.scrollBy({ top: -667, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLike = (index) => {
    setLikes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleComment = (index) => {
    const comment = prompt("Write your comment:");
    if (comment) alert(`Comment added: "${comment}"`);
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("Video link copied to clipboard!");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-indigo-100">
      <div
        ref={containerRef}
        className="w-[375px] h-[667px] overflow-y-scroll snap-y snap-mandatory rounded-2xl shadow-lg border border-red-600 scrollbar-hide"
      >
        {videos.map((url, index) => (
          <div
            key={index}
            className="relative w-full h-[667px] snap-start flex items-center justify-center"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={url}
              controls
              muted={false}
              className="h-full w-full object-cover"
            />

            {/* Overlay Buttons */}
            <div className="absolute bottom-[120px] right-4 flex flex-col gap-10 items-center text-white text-lg">
              <button
                onClick={() => handleLike(index)}
                className="hover:scale-110 transition "
              >
                <FaHeart size={25}
                  className={likes[index] ? "text-red-500" : "text-gray-100"}
                />
              </button>
              <button
                onClick={() => handleComment(index)}
                className="hover:scale-110 transition text-gray-300"
              >
                <FaRegComment  size={25}/>
              </button>
              <button
                onClick={() => handleShare(url)}
                className="hover:scale-110 transition text-indigo-100"
              >
                <FaShareAlt  size={25}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
