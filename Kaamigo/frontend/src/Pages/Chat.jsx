// === pages/Chat.jsx ===
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("created"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "messages"), {
        text,
        created: new Date(),
      });
      setText("");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-700">💬 Live Chat</h2>

      {/* Chat Message Area */}
      <div className="h-64 overflow-y-auto bg-white border rounded-lg shadow-inner p-4 mb-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <div
              key={i}
              className="bg-orange-100 text-gray-800 px-3 py-2 rounded-md w-fit max-w-[80%]"
            >
              {m.text}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-xs italic">
            No messages yet.
          </p>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg p-2 outline-none focus:border-orange-400 transition"
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
