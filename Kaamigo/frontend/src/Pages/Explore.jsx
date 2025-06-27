// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

import VoiceSearchInput from "../Components/VoiceSearchInput";
import { FiMapPin } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";

/* ───────── floating-label helpers ───────── */
const floating =
  "peer w-full border-2 border-gray-300 rounded-lg px-3 pt-6 pb-2 text-gray-800 placeholder-transparent focus:border-orange-500 focus:outline-none";
const label =
  "absolute left-3 top-1.5 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm";
const FloatingInput = ({ id, labelText, value, onChange, type = "text" }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      className={floating}
      placeholder=" "
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <label htmlFor={id} className={label}>
      {labelText}
    </label>
  </div>
);
const FloatingTextarea = ({ id, labelText, value, onChange, rows = 4 }) => (
  <div className="relative">
    <textarea
      id={id}
      rows={rows}
      className={floating + " resize-none"}
      placeholder=" "
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <label htmlFor={id} className={label}>
      {labelText}
    </label>
  </div>
);

/* ───────── component ───────── */
export default function Explore() {
  /* auth */
  const currentUid = getAuth().currentUser?.uid;

  /* search param → state */
  const { search } = useLocation();
  const queryParam = new URLSearchParams(search).get("search") || "";

  /* state */
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [myJobsOnly, setMyJobsOnly] = useState(false);   // ← NEW
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  /* edit-modal state */
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  /* realtime jobs */
  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("created", "desc"));
    return onSnapshot(q, (snap) =>
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  /* filter */
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = !term
      ? jobs
      : jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(term) ||
            (j.desc ?? "").toLowerCase().includes(term) ||
            (j.location ?? "").toLowerCase().includes(term)
        );
    if (myJobsOnly && currentUid) {
      list = list.filter((j) => j.posterUid === currentUid);
    }
    setFiltered(list);
  }, [searchTerm, myJobsOnly, jobs, currentUid]);

  /* save + delete handlers (unchanged) */
  const saveJob = async () => {
    if (!editingJob?.title || !editingJob?.desc)
      return alert("Title & description required.");
    try {
      setSaving(true);
      const { id, ...data } = editingJob;
      await updateDoc(doc(db, "jobs", id), data);
      setEditingJob(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };
  const deleteJob = async () => {
    if (!editingJob) return;
    if (!confirm("Delete this job?")) return;
    try {
      await deleteDoc(doc(db, "jobs", editingJob.id));
      setEditingJob(null);
    } catch (e) {
      alert(e.message);
    }
  };

  /* ui */
  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
        🔍 Explore Jobs
      </h1>

      {/* search row with filter toggle */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex-1">
          <VoiceSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
        </div>

        {/* my-jobs toggle */}
        <button
          onClick={() => setMyJobsOnly((prev) => !prev)}
          className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition
            ${
              myJobsOnly
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          title={myJobsOnly ? "Show all jobs" : "Show my jobs only"}
        >
          {myJobsOnly ? "All Jobs" : "My Jobs"}
        </button>
      </div>

      {/* cards */}
      {filtered.length ? (
        filtered.map(
          ({
            id,
            title,
            desc,
            phone,
            email,
            location,
            experience,
            created,
            posterUid,
          }) => (
            <div
              key={id}
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-xl transition mb-5"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
              <div className="flex justify-between gap-4 p-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold uppercase tracking-wide">
                    {title}
                  </h3>
                  {location && (
                    <p className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="mr-1" />
                      {location}
                    </p>
                  )}
                  {created?.toDate && (
                    <p className="text-xs text-gray-400">
                      {created.toDate().toLocaleDateString()}
                    </p>
                  )}
                  {posterUid === currentUid && (
                    <button
                      onClick={() =>
                        setEditingJob({
                          id,
                          title,
                          desc,
                          phone,
                          email,
                          location,
                          experience,
                        })
                      }
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline pt-1"
                    >
                      🖊️ Edit
                    </button>
                  )}
                </div>
                <span className="shrink-0 self-start rounded-xl bg-orange-100 p-3 text-orange-600">
                  <FaRegFileAlt size={22} />
                </span>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === id ? null : id)}
                className={`block w-full text-center py-2 text-sm font-medium transition ${
                  expandedId === id
                    ? "text-orange-600 hover:text-orange-700"
                    : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                }`}
              >
                {expandedId === id ? "Hide Details" : "View Details"}
              </button>
              {expandedId === id && (
                <div className="bg-gray-50 px-6 py-4 text-sm text-gray-700 space-y-1">
                  {desc && <p>{desc}</p>}
                  {phone && (
                    <p>
                      <strong>📞 Phone:</strong> {phone}
                    </p>
                  )}
                  {email && (
                    <p>
                      <strong>📧 Email:</strong> {email}
                    </p>
                  )}
                  {experience && (
                    <p>
                      <strong>🧰 Experience:</strong> {experience}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        )
      ) : (
        <p className="text-center text-gray-500 text-sm mt-10">
          {myJobsOnly
            ? "You haven't posted any jobs yet."
            : "No jobs match your search."}
        </p>
      )}

      {/* edit modal (unchanged) */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg space-y-6 shadow-xl max-height[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-orange-600 text-center">
              🖊️ Edit Job
            </h2>
            <FloatingInput
              id="ed_title"
              labelText="Job title"
              value={editingJob.title}
              onChange={(v) => setEditingJob({ ...editingJob, title: v })}
            />
            <FloatingTextarea
              id="ed_desc"
              labelText="Description"
              rows={5}
              value={editingJob.desc}
              onChange={(v) => setEditingJob({ ...editingJob, desc: v })}
            />
            <FloatingInput
              id="ed_phone"
              labelText="Contact phone"
              value={editingJob.phone}
              onChange={(v) => setEditingJob({ ...editingJob, phone: v })}
            />
            <FloatingInput
              id="ed_email"
              labelText="Contact email"
              type="email"
              value={editingJob.email}
              onChange={(v) => setEditingJob({ ...editingJob, email: v })}
            />
            <FloatingInput
              id="ed_location"
              labelText="Job location"
              value={editingJob.location}
              onChange={(v) => setEditingJob({ ...editingJob, location: v })}
            />
            <FloatingInput
              id="ed_exp"
              labelText="Experience required"
              value={editingJob.experience}
              onChange={(v) =>
                setEditingJob({ ...editingJob, experience: v })
              }
            />

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={deleteJob}
                className="text-red-600 hover:underline text-sm"
              >
                🗑️ Delete
              </button>

              <div className="space-x-3">
                <button
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-lg border text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  onClick={saveJob}
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
