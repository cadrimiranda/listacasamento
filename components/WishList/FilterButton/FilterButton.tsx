import React, { useState, useCallback } from "react";
import styles from "./FilterButton.module.css";
import { useClickOutside } from "@/src/useClickOutside";

export enum FilterOptions {
  AscByTitle = "Asc by title",
  DescByTitle = "Desc by title",
  AscByPrice = "Asc by price",
  DescByPrice = "Desc by price",
}

interface FilterButtonProps {
  onFilterSelect: (filter: FilterOptions) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFilterSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions | null>(
    null
  );
  const filterRef = useClickOutside(() => setIsOpen(false));

  const handleFilterClick = (filter: FilterOptions) => {
    setSelectedFilter(filter);
    onFilterSelect(filter);
    setIsOpen(false);
  };

  const isSelected = useCallback(
    (filter: FilterOptions) => filter === selectedFilter,
    [selectedFilter]
  );

  return (
    <div className={styles.filterButtonContainer} ref={filterRef}>
      <button
        className={styles.filterButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-filter"></i>
      </button>
      {isOpen && (
        <div className={styles.dropdownList}>
          {Object.values(FilterOptions).map((filter) => (
            <div
              key={filter}
              className={`dropDownItem ${styles.dropItem} ${
                isSelected(filter) ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
              {isSelected(filter) && (
                <i className={`fas fa-check ${styles.selected}`}></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
