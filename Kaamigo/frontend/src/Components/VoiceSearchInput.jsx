import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FiMic, FiSearch, FiX } from "react-icons/fi";

const VoiceSearchInput = ({ value, onChange, onClear, onSubmit }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript]);

  const handleMic = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });
  };

  const handleClear = () => {
    resetTranscript();
    onClear();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p className="text-red-500">Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div className="flex items-center bg-white rounded-full overflow-hidden px-4 py-2 shadow border">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for workers, jobs..."
        className="flex-1 text-black px-2 outline-none"
      />
      {value && (
        <button onClick={handleClear} className="text-gray-400 hover:text-black mr-2">
          <FiX size={18} />
        </button>
      )}
      <button onClick={onSubmit} className="text-gray-500">
        <FiSearch size={18} />
      </button>
      <button onClick={handleMic} className="ml-3 text-orange-500">
        <FiMic size={22} />
      </button>
      {listening && <span className="ml-2 text-blue-500 animate-pulse text-sm">Listening...</span>}
    </div>
  );
};

export default VoiceSearchInput;
