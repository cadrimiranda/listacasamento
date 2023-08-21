import React, { useState, useCallback } from "react";
import styles from "./FilterButton.module.css";
import { useClickOutside } from "@/src/useClickOutside";
import { logger } from "@/src/logger";
import queries from "@/src/query";
import { LogType } from "@/src/schemas";

export enum FilterOptions {
  AscByTitle = "Ascendente por título",
  DescByTitle = "Descendente por título",
  AscByPrice = "Ascendente por preço",
  DescByPrice = "Descendente por preço",
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
    queries.log({
      logType: LogType.ordered,
      filter,
    });
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
