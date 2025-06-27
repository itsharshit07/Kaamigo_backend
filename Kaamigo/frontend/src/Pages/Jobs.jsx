// src/pages/Jobs.jsx
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

export default function Jobs() {
  const auth = getAuth();
  const user = auth.currentUser;            // assumes the user is logged-in

  // ─────────────────────────────────── state ───────────────────────────────────
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);

  // ───────────────────────────── pull profile defaults ─────────────────────────
  useEffect(() => {
    if (!user) return;                                  // not logged-in yet
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setExperience(data.experience || "");
          // email usually comes from auth, but if you store a different one:
          if (data.email) setEmail(data.email);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();
  }, [user]);

  // ───────────────────────────────── submit ───────────────────────────────────
  const postJob = async () => {
    if (!title || !desc) return alert("Please fill in the title & description.");

    try {
      setLoading(true);
      await addDoc(collection(db, "jobs"), {
        title,
        desc,
        phone,
        email,
        location,
        experience,
        posterUid: user?.uid || null,
        created: serverTimestamp(),
      });
      // clear only the fields you normally re-enter
      setTitle("");
      setDesc("");
      alert("🎉 Job posted!");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────── UI ──────────────────────────────────────
  const floating =
    "peer w-full border-2 border-gray-300 rounded-lg px-3 pt-6 pb-2 " +
    "text-gray-800 placeholder-transparent focus:border-orange-500 focus:outline-none";

  const label =
    "absolute left-3 top-1.5 text-sm text-gray-500 transition-all " +
    "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base " +
    "peer-focus:top-1.5 peer-focus:text-sm";

  return (
    <section className="flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8">
        🧑‍🔧 Post a New Job
      </h1>

      <div className="w-full max-w-xl bg-white/60 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6">
        {/* title */}
        <Input
          id="title"
          value={title}
          onChange={setTitle}
          label="Job title"
          className={floating}
          labelClass={label}
        />

        {/* description */}
        <Textarea
          id="desc"
          value={desc}
          onChange={setDesc}
          label="Description"
          rows={5}
          className={floating}
          labelClass={label}
        />

        {/* phone */}
        <Input
          id="phone"
          value={phone}
          onChange={setPhone}
          label="Contact phone"
          type="tel"
          className={floating}
          labelClass={label}
        />

        {/* email */}
        <Input
          id="email"
          value={email}
          onChange={setEmail}
          label="Contact email"
          type="email"
          className={floating}
          labelClass={label}
        />

        {/* location */}
        <Input
          id="location"
          value={location}
          onChange={setLocation}
          label="Job location"
          className={floating}
          labelClass={label}
        />

        {/* experience */}
        <Input
          id="experience"
          value={experience}
          onChange={setExperience}
          label="Experience required"
          placeholder="e.g. 3-5 years"
          className={floating}
          labelClass={label}
        />

        <button
          disabled={loading}
          onClick={postJob}
          className="w-full flex justify-center items-center gap-2
                     bg-gradient-to-r from-orange-500 to-orange-600
                     hover:to-orange-700 text-white font-semibold py-3
                     rounded-lg transition disabled:opacity-60"
        >
          {loading && <Spinner />}
          📢 Post Job
        </button>
      </div>
    </section>
  );
}

/* ───────── tiny helpers to avoid repeating floating-label markup ───────── */
function Input({ id, label, value, onChange, type = "text", className, labelClass, ...rest }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        placeholder=" "
        {...rest}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  );
}

function Textarea({ id, label, value, onChange, rows = 4, className, labelClass }) {
  return (
    <div className="relative">
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className + " resize-none"}
        placeholder=" "
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}
