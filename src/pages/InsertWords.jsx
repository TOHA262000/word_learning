import React, { PureComponent } from "react";

export default class InsertWords extends PureComponent {
  state = {
    words: [],
    form: { word: "", type: "", meaning: "", synonyms: "", examples: "" }, // adding new word
    modalForm: { word: "", type: "", meaning: "", synonyms: "", examples: "" }, // editing
    editId: null,
    showModal: false,
    loading: true,
    error: null,
    searchQuery: "",
    selectedWord: null,
  };

  componentDidMount() {
    this.getWords();
  }

  // Fetch all words
  getWords = async () => {
    try {
      const res = await fetch("http://localhost:5000/words");
      if (!res.ok) throw new Error("Failed to fetch words");
      const data = await res.json();
      this.setState({ words: data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  // Add word form
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { form } = this.state;

    try {
      const res = await fetch("http://localhost:5000/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add word");
      const data = await res.json();
      this.setState((prevState) => ({
        words: [...prevState.words, data],
        form: { word: "", type: "", meaning: "", synonyms: "", examples: "" },
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete word
  handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this word?")) return;
    try {
      const res = await fetch(`http://localhost:5000/words/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete word");
      this.setState((prevState) => ({
        words: prevState.words.filter((w) => w._id !== id),
        selectedWord: prevState.selectedWord?._id === id ? null : prevState.selectedWord
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Open modal for editing
  handleEdit = (word) => {
    this.setState({
      showModal: true,
      editId: word._id,
      modalForm: { ...word },
    });
  };

  // Modal input changes
  handleModalChange = (e) => {
    const { name, value } = e.target;
    this.setState({ modalForm: { ...this.state.modalForm, [name]: value } });
  };

  // Update word from modal
  handleUpdate = async (e) => {
    e.preventDefault();
    const { modalForm, editId } = this.state;
    if (!editId) return;

    try {
      const payload = { ...modalForm };
      delete payload._id;

      const res = await fetch(`http://localhost:5000/words/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update word");

      // Refetch all words
      await this.getWords();

      this.setState({
        showModal: false,
        editId: null,
        modalForm: { word: "", type: "", meaning: "", synonyms: "", examples: "" },
        selectedWord: { ...modalForm, _id: editId } // update selected word if being edited
      });
    } catch (err) {
      alert(err.message);
    }
  };

  render() {
    const { words, form, loading, error, showModal, modalForm, searchQuery, selectedWord } = this.state;

    // Filter suggestions based on search query
    const suggestions = words
      .filter((w) => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Manage Words</h1>

        {/* Add Word Form */}
        <form onSubmit={this.handleSubmit} className="mb-6 space-y-2 p-4 border rounded-lg bg-white shadow-sm">
          <input type="text" name="word" placeholder="Word" value={form.word} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="type" placeholder="Type" value={form.type} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="meaning" placeholder="Meaning" value={form.meaning} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="synonyms" placeholder="Synonyms" value={form.synonyms} onChange={this.handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="examples" placeholder="Examples" value={form.examples} onChange={this.handleChange} className="w-full p-2 border rounded" />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Add Word
          </button>
        </form>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search word to edit or delete..."
            value={searchQuery}
            onChange={(e) => this.setState({ searchQuery: e.target.value, selectedWord: null })}
            className="w-full p-2 border rounded"
          />
          {/* Suggestions */}
          {searchQuery && suggestions.length > 0 && (
            <ul className="border rounded max-h-48 overflow-auto bg-white mt-1">
              {suggestions.map((w) => (
                <li
                  key={w._id}
                  onClick={() => this.setState({ selectedWord: w, searchQuery: w.word })}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                >
                  {w.word}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected Word Card */}
        {selectedWord && (
          <div className="p-4 border rounded-lg shadow-sm flex justify-between items-start bg-white">
            <div>
              <p className="font-semibold">{selectedWord.word} <span className="text-gray-500">({selectedWord.type})</span></p>
              <p className="text-gray-700">{selectedWord.meaning}</p>
              <p className="text-gray-600"><strong>Synonyms:</strong> {selectedWord.synonyms}</p>
              <p className="text-gray-600"><strong>Example:</strong> {selectedWord.examples}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => this.handleEdit(selectedWord)}
                className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => this.handleDelete(selectedWord._id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Word</h2>
              <form onSubmit={this.handleUpdate} className="space-y-2">
                <input type="text" name="word" value={modalForm.word} onChange={this.handleModalChange} className="w-full p-2 border rounded" required />
                <input type="text" name="type" value={modalForm.type} onChange={this.handleModalChange} className="w-full p-2 border rounded" required />
                <input type="text" name="meaning" value={modalForm.meaning} onChange={this.handleModalChange} className="w-full p-2 border rounded" required />
                <input type="text" name="synonyms" value={modalForm.synonyms} onChange={this.handleModalChange} className="w-full p-2 border rounded" />
                <input type="text" name="examples" value={modalForm.examples} onChange={this.handleModalChange} className="w-full p-2 border rounded" />
                <div className="flex justify-end space-x-2 mt-2">
                  <button type="button" onClick={() => this.setState({ showModal: false })} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading / Error */}
        {loading && <p className="text-center">Loading words...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

      </div>
    );
  }
}
