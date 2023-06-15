import React, { useState, useRef, useEffect, MouseEventHandler } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  label: string;
  suggestions: string[];
  disabled: boolean;
  onSuggestionSelect: (suggestion: string) => void;
  onSuggestionClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  suggestions,
  disabled,
  onSuggestionSelect,
  onSuggestionClear,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  if (inputValue.length === 0) {
    onSuggestionClear();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    onSuggestionSelect(suggestion);
  };

  const handleClearClick = () => {
    setInputValue("");
    setFilteredSuggestions([]);
    onSuggestionClear();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.dropdownContainer} ref={searchRef}>
        <div className={styles.searchInputContainer}>
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
          <input
            placeholder={label}
            className={styles.searchInput}
            value={inputValue}
            onChange={handleChange}
            disabled={disabled}
          />
          <button className={styles.clearButton} onClick={handleClearClick}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {filteredSuggestions.length > 0 && (
          <div className={styles.autocompleteList}>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={styles.autocompleteItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { SearchInput };
