import React, { PureComponent } from 'react';
import words from '../assets/words.json'; 

export default class Practice extends PureComponent {
  render() {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Practice Words
        </h1>
        <ul className="space-y-4">
          {words.map((w, index) => (
            <li 
              key={index} 
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <p className="text-lg font-semibold">
                {w.word} <span className="text-sm text-gray-500">({w.type})</span>
              </p>
              <p className="text-gray-700 my-1">{w.meaning}</p>
              <p className="text-gray-600">
                <strong>Synonyms:</strong> {w.synonyms}
              </p>
              <p className="text-gray-600">
                <strong>Example:</strong> {w.examples}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
