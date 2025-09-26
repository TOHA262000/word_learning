import React, { useState, useEffect } from "react";


const Home = () => {
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("https://vercel-word-learning-server.vercel.app/api/words");
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const data = await res.json();
        setWords(data);

        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomWord(data[randomIndex]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleFlip = () => setFlipped((prev) => !prev);

  const handleNextRandom = () => {
    if (words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
    setFlipped(false); // reset flip to front
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">Error: {error}</p>;
  if (!randomWord) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {/* Flip card */}
      <div className="w-80 h-48 perspective" onClick={handleFlip}>
        <div
          className={`relative w-full h-full duration-700 transform-style preserve-3d transition-transform ${flipped ? "rotate-y-180" : ""
            }`}
        >
          {/* Front side: meaning */}
          <div className="absolute w-full h-full bg-indigo-500 text-white rounded-lg shadow-lg flex items-center justify-center text-xl p-4 backface-hidden">
            {randomWord.meaning}
          </div>

          {/* Back side: word + details */}
          <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-4 rotate-y-180 backface-hidden flex flex-col justify-center">
            <p className="text-2xl font-bold text-indigo-700 mb-2">{randomWord.word}</p>
            <p className="text-gray-600 mb-2">
              <strong>Synonyms:</strong> {randomWord.synonyms}
            </p>
            <div className="text-gray-700 max-h-36 overflow-auto">
              <strong>Examples:</strong>
              <ul className="list-disc list-inside mt-1">
                {randomWord.examples.map((ex, i) => (
                  <li key={i} className="italic">{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Small button/icon for next random word */}
      <button
        onClick={handleNextRandom}
        className="p-2 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition shadow"
        title="Next random word"
      >
        🔄
        {/* Or use Heroicons: <RefreshIcon className="w-6 h-6" /> */}
      </button>

      {/* Tailwind + extra CSS for flip effect */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default Home;
