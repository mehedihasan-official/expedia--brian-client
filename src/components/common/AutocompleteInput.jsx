import { useCallback, useEffect, useRef, useState } from "react";
import { FaMapPin } from "react-icons/fa";

const EMPTY_ARRAY = [];

const AutocompleteInput = ({
  value,
  onChange,
  onSelect,
  options = EMPTY_ARRAY,
  displayKey = null,
  getOptionLabel = null,
  placeholder = "",
  icon = null,
  label = "",
  filterFields = EMPTY_ARRAY,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);

  const getDisplayText = useCallback((option) => {
    if (getOptionLabel) return getOptionLabel(option);
    if (typeof option === "string") return option;
    if (displayKey) return option[displayKey] || "";
    return JSON.stringify(option);
  }, [displayKey, getOptionLabel]);

  useEffect(() => {
    if (!value.trim()) {
      setFilteredOptions(options);
      return;
    }

    const query = value.toLowerCase();
    const filtered = options.filter((option) => {
      if (getDisplayText(option).toLowerCase().includes(query)) return true;
      if (typeof option === "string") return false;

      return filterFields.some((field) => {
        const fieldValue = option[field];
        return fieldValue?.toString().toLowerCase().includes(query);
      });
    });

    setFilteredOptions(filtered);
  }, [value, options, filterFields, getDisplayText]);

  const handleFocus = () => {
    if (disabled) return;
    setFilteredOptions(options);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleSelectOption = (option) => {
    onChange(getDisplayText(option));
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const randomSuggestions = filteredOptions.length
    ? []
    : [...options].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex w-full items-center rounded-lg border border-gray-300 bg-white p-3 focus-within:ring-2 focus-within:ring-blue-200 ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        {icon || <FaMapPin className="mr-3 shrink-0 text-lg text-gray-500" />}
        <div className="flex w-full flex-col">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-[250px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="sticky top-0 border-b border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
            Showing available destinations
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={`${getDisplayText(option)}-${index}`}
                type="button"
                onMouseDown={() => handleSelectOption(option)}
                className="flex w-full cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 last:border-b-0 hover:bg-blue-50"
              >
                <FaMapPin className="shrink-0 text-xs text-blue-600" />
                <span>{getDisplayText(option)}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-gray-600">
              <p className="mb-2 font-medium">No matches &mdash; try:</p>
              <div className="space-y-1">
                {randomSuggestions.map((suggestion, index) => (
                  <button
                    key={`${getDisplayText(suggestion)}-${index}`}
                    type="button"
                    onMouseDown={() => handleSelectOption(suggestion)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <FaMapPin className="shrink-0 text-xs text-blue-600" />
                    <span>{getDisplayText(suggestion)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
