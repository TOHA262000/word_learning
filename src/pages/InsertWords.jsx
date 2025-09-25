import React, { PureComponent } from 'react';
import wordsData from '../assets/words.json'; // your JSON file

export default class InsertWords extends PureComponent {
  state = {
    words: wordsData, // load initial words from JSON
    form: { word: '', type: '', meaning: '', synonyms: '', examples: '' },
    editIndex: null,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, words, editIndex } = this.state;

    if (editIndex !== null) {
      const updatedWords = [...words];
      updatedWords[editIndex] = form;
      this.setState({ words: updatedWords, form: { word: '', type: '', meaning: '', synonyms: '', examples: '' }, editIndex: null });
    } else {
      this.setState({ words: [...words, form], form: { word: '', type: '', meaning: '', synonyms: '', examples: '' } });
    }
  };

  handleEdit = (index) => {
    this.setState({ form: this.state.words[index], editIndex: index });
  };

  handleDelete = (index) => {
    const updatedWords = this.state.words.filter((_, i) => i !== index);
    this.setState({ words: updatedWords });
  };

  render() {
    const { words, form, editIndex } = this.state;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Manage Words</h1>

        <form onSubmit={this.handleSubmit} className="mb-6 space-y-2 p-4 border rounded-lg bg-white shadow-sm">
          <input type="text" name="word" placeholder="Word" value={form.word} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="type" placeholder="Type" value={form.type} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="meaning" placeholder="Meaning" value={form.meaning} onChange={this.handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="synonyms" placeholder="Synonyms" value={form.synonyms} onChange={this.handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="examples" placeholder="Examples" value={form.examples} onChange={this.handleChange} className="w-full p-2 border rounded" />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            {editIndex !== null ? 'Update Word' : 'Add Word'}
          </button>
        </form>

        <ul className="space-y-3">
          {words.map((w, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-sm flex justify-between items-start bg-white">
              <div>
                <p className="font-semibold">{w.word} <span className="text-gray-500">({w.type})</span></p>
                <p className="text-gray-700">{w.meaning}</p>
                <p className="text-gray-600"><strong>Synonyms:</strong> {w.synonyms}</p>
                <p className="text-gray-600"><strong>Example:</strong> {w.examples}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => this.handleEdit(index)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">Edit</button>
                <button onClick={() => this.handleDelete(index)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
