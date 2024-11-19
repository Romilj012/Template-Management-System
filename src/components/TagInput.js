import React, { useState, useEffect } from 'react';

function TagInput({ tags, setTags, templateId }) {
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('TagInput rendered with tags:', tags);
  }, [tags]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTag = () => {
    if (input.trim()) {
      const newTags = [...tags, input.trim()];
      setTags(newTags);
      setInput('');
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
  };

  return (
    <div>
      {tags && tags.length > 0 ? (
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>
              {tag}
              <button onClick={() => handleRemoveTag(index)}>x</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags available</p>
      )}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Add a tag"
      />
      <button onClick={handleAddTag}>Add Tag</button>
    </div>
  );
}

export default TagInput;