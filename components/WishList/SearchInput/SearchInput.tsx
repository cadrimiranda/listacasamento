import React, { useState } from "react";
import styles from "./SearchInput.module.css";
import { useClickOutside } from "@/src/useClickOutside";
import { FilterOptions } from "../FilterButton/FilterButton";

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
  const searchRef = useClickOutside(() => setFilteredSuggestions([]));

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

  const getSuggestionsItems = (arr: string[], quantity = 10) => {
    return [...arr].sort((a, b) => a.localeCompare(b)).slice(0, quantity);
  };

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
            {getSuggestionsItems(filteredSuggestions).map(
              (suggestion, index) => (
                <div
                  key={index}
                  className="dropDownItem"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { SearchInput };
