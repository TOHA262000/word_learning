import React, { useState, useEffect } from "react";

const Practice = () => {
  const [words, setWords] = useState([]);       
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("http://localhost:5000/words");
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        const data = await response.json();
        setWords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading words...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">Error: {error}</p>;

  // Pagination logic
  const totalPages = Math.ceil(words.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWords = words.slice(startIndex, startIndex + itemsPerPage);

  // Scroll to top of the list when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        Practice Words
      </h1>

      <ul className="space-y-6">
        {currentWords.map((w, index) => (
          <li
            key={index}
            className="p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-indigo-50"
          >
            <p className="text-2xl font-bold text-indigo-700 mb-2">
              {w.word} <span className="text-base text-gray-500 font-normal">({w.type})</span>
            </p>
            <p className="text-gray-800 mb-3">{w.meaning}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Synonyms:</span> {w.synonyms}
            </p>
            <div className="text-gray-600">
              <span className="font-semibold">Example{w.examples.length > 1 ? 's' : ''}:</span>
              <ul className="list-disc list-inside mt-1">
                {w.examples.map((ex, i) => (
                  <li key={i} className="italic text-gray-700">{ex}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div className="flex justify-center mt-6 flex-wrap gap-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300 hover:bg-indigo-600 transition"
        >
          &#8592; Previous
        </button>

        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded transition ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300 hover:bg-indigo-600 transition"
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default Practice;
