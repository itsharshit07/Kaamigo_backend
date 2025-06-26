// === pages/Jobs.jsx ===
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Jobs = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const postJob = async () => {
    if (!title || !desc) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        title,
        desc,
        created: new Date(),
      });
      alert("🎉 Job Posted Successfully!");
      setTitle("");
      setDesc("");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
        🧑‍🔧 Post a New Job
      </h2>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Job Title"
          className="w-full border p-3 rounded-lg text-gray-700 outline-none focus:border-orange-500"
        />

        <textarea
          rows={5}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the job role, experience needed, etc."
          className="w-full border p-3 rounded-lg text-gray-700 resize-none outline-none focus:border-orange-500"
        />

        <button
          onClick={postJob}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
        >
          📢 Post Job
        </button>
      </div>
    </div>
  );
};

export default Jobs;
