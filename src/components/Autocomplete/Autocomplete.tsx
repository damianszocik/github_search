import { DebouncedFunc } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import errorIcon from "../../assets/icons/error.svg";
import infoIcon from "../../assets/icons/info.svg";
import { AutocompleteItem } from "./AutocompleteItem";
import { SearchInput } from "./SearchInput";
import { Option, SearchFunction } from "./types";

type AutocompleteProps = { data: DebouncedFunc<SearchFunction> };

const MIN_SEARCH_VALUE = 3;

export function Autocomplete({ data }: AutocompleteProps) {
  const [searchValue, setSearchValue] = useState("");
  const [optionsVisibile, setOptionVisible] = useState(false);
  const [focusedElementIndex, setFocusedElementIndex] = useState(0);
  const [matchingOptions, setMatchingOptions] = useState<Option[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);
  const optionsContainerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteContainerRef.current &&
        !autocompleteContainerRef.current.contains(event.target as Node)
      ) {
        setOptionVisible(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!searchValue || searchValue.length < MIN_SEARCH_VALUE) {
      data.cancel();
      setMatchingOptions([]);
      setLoading(false);
    } else {
      setLoading(true);
      data(searchValue, setMatchingOptions, setLoading, setErrors, () => {
        setFocusedElementIndex(0);
      });
    }
  }, [searchValue, data]);

  useEffect(() => {
    setOptionVisible(true);
  }, [matchingOptions]);

  const getOptionIntoView = (
    optionIndex: number,
    optionsContainer: HTMLUListElement
  ) => {
    const elementToScroll = Array.from(optionsContainer.children)[
      optionIndex
    ] as HTMLElement;
    scrollIntoView(elementToScroll, {
      scrollMode: "if-needed",
      block: "nearest",
      inline: "nearest",
    });
  };

  useEffect(() => {
    if (
      optionsContainerRef.current &&
      optionsVisibile &&
      matchingOptions.length
    ) {
      getOptionIntoView(focusedElementIndex, optionsContainerRef.current);
    }
  }, [focusedElementIndex, optionsVisibile, matchingOptions.length]);

  const handleKeyboardNavigation = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "ArrowDown") {
      optionsVisibile
        ? setFocusedElementIndex((currentFocusedIndex) =>
            currentFocusedIndex < matchingOptions.length - 1
              ? currentFocusedIndex + 1
              : currentFocusedIndex
          )
        : setOptionVisible(true);
    }

    if (event.key === "ArrowUp") {
      setFocusedElementIndex((currentFocusedIndex) =>
        currentFocusedIndex > 0 ? currentFocusedIndex - 1 : 0
      );
    }

    if (event.key === "Escape") {
      setOptionVisible(false);
    }

    if (event.key === "Enter" && focusedElementIndex > 0) {
      handleSelection(matchingOptions[focusedElementIndex]);
    }
  };

  const handleSelection = (selectedOption: Option) => {
    window.open(selectedOption.url, "_blank");
    setOptionVisible(false);
  };

  const searchLengthEnough = useMemo(
    () => searchValue.length >= MIN_SEARCH_VALUE,
    [searchValue.length]
  );

  return (
    <div
      ref={autocompleteContainerRef}
      className="rounded-2xl shadow-lg p-4 bg-white"
    >
      <SearchInput
        value={searchValue}
        onClick={() => setOptionVisible(true)}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => handleKeyboardNavigation(event)}
        loading={loading}
        expanded={optionsVisibile}
        expandable={Boolean(searchLengthEnough && matchingOptions.length)}
        toggleExpand={() =>
          setOptionVisible((currentVisibility) => !currentVisibility)
        }
      />
      {Boolean(errors.length) &&
        !loading &&
        searchLengthEnough &&
        errors.map((errorMessage) => (
          <div
            key={errorMessage}
            className="mt-4 text-sm text-red-600 mb-4 flex gap-1 items-center justify-center"
          >
            <img src={errorIcon} alt="error icon" className="h-6 opacity-70" />
            {errorMessage}
          </div>
        ))}
      {!searchLengthEnough ? (
        <div className="mt-2 text-sm flex items-center gap-1 justify-center">
          <img src={infoIcon} alt="info icon" className="h-5 opacity-70" />
          Type at least {MIN_SEARCH_VALUE} chars to get suggestions
        </div>
      ) : !matchingOptions.length && !loading ? (
        <div className="mt-4 flex items-center gap-1 justify-center p-2">
          {"¯\\_(ツ)_/¯ No results"}
        </div>
      ) : (
        optionsVisibile &&
        !loading && (
          <ul
            ref={optionsContainerRef}
            className="rounded-md max-h-60 overflow-auto mx-1 mt-4 pr-2 snap-y scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          >
            {matchingOptions.map((suggestion, suggestionIndex) => (
              <AutocompleteItem
                key={`${suggestion.type}-${suggestion.id}`}
                label={suggestion.label}
                type={suggestion.type}
                focused={suggestionIndex === focusedElementIndex}
                onClick={() => handleSelection(suggestion)}
              />
            ))}
          </ul>
        )
      )}
    </div>
  );
}
