import React, { PureComponent } from 'react';

export default class Nav extends PureComponent {
  state = {
    searchTerm: '',
    suggestions: [],
    words: [],
    selectedWord: null, // new state for showing the card
  };

  componentDidMount() {
    fetch('http://localhost:5000/words')
      .then((res) => res.json())
      .then((data) => this.setState({ words: data }))
      .catch((err) => console.error('Error fetching words:', err));
  }

  handleChange = (e) => {
    const value = e.target.value;
    const { words } = this.state;
    const suggestions = value
      ? words.filter((w) =>
          w.word.toLowerCase().startsWith(value.toLowerCase())
        )
      : [];
    this.setState({ searchTerm: value, suggestions });
  };

  handleSuggestionClick = (word) => {
    this.setState({ selectedWord: word, searchTerm: '', suggestions: [] });
  };

  handleCloseCard = () => {
    this.setState({ selectedWord: null });
  };

  render() {
    const { searchTerm, suggestions, selectedWord } = this.state;

    return (
      <>
        {/* Navbar */}
        <nav className="flex items-center p-4 bg-indigo-100 space-x-4 relative z-20">
          <a href="/" className="hover:underline">Home</a>
          <a href="/practice" className="hover:underline">Practice</a>
          <a href="/insert" className="hover:underline">Insert</a>

          <div className="ml-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={this.handleChange}
              placeholder="Search words..."
              className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-50 max-h-48 overflow-auto">
                {suggestions.map((w, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => this.handleSuggestionClick(w)}
                  >
                    {w.word}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Floating Word Card */}
        {selectedWord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={this.handleCloseCard}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>

              <p className="font-bold text-2xl mb-2">{selectedWord.word} <span className="text-gray-500">({selectedWord.type})</span></p>
              <p className="mb-2 text-gray-700"><strong>Meaning:</strong> {selectedWord.meaning}</p>
              <p className="mb-2 text-gray-600"><strong>Synonyms:</strong> {selectedWord.synonyms}</p>
              <p className="text-gray-600"><strong>Examples:</strong> {selectedWord.examples}</p>
            </div>
          </div>
        )}
      </>
    );
  }
}
