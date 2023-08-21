import React, { useRef, useState } from "react";
import styles from "./SearchInput.module.css";
import { useClickOutside } from "@/src/useClickOutside";
import { FilterOptions } from "../FilterButton/FilterButton";
import queries from "@/src/query";
import { LogType } from "@/src/schemas";

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
  const refSearch = useRef<number>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  if (inputValue.length === 0) {
    onSuggestionClear();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (refSearch.current) {
      clearTimeout(refSearch.current);
      // @ts-ignore
      refSearch.current = null;
    }

    // @ts-ignore
    refSearch.current = setTimeout(() => {
      if (value.length > 0) {
        queries.log({ logType: LogType.filter, filter: value });
        const filtered = suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, 5000);
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
  const searchRef = useClickOutside(handleClearClick);

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
