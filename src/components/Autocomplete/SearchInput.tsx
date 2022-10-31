import searchIcon from "../../assets/icons/search.svg";
import loadingSpinner from "../../assets/icons/loadingSpinner.svg";
import expandIcon from "../../assets/icons/expand.svg";
import { useRef } from "react";

type SearchInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  loading: boolean;
  expandable: boolean;
  expanded: boolean;
  toggleExpand: () => void;
};

export const SearchInput = ({
  loading,
  expanded,
  expandable,
  toggleExpand,
  ...inputProps
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="relative">
      <label htmlFor="searchInput">
        <img
          src={searchIcon}
          alt="search icon"
          className="absolute h-2/4 left-3 top-0 bottom-0 my-auto opacity-70"
        />
      </label>
      <input
        className="pl-10 rounded-xl bg-gray-100 border-gray-200 w-full focus:outline-dashed focus:outline-gray-400 p-2 text-xl"
        type="text"
        name="search"
        id="searchInput"
        autoComplete="off"
        autoFocus
        ref={inputRef}
        {...inputProps}
      />
      <img
        src={loadingSpinner}
        alt="loading spinner"
        className={`${
          loading ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000 animate-spin absolute h-2/4 right-3 top-0 bottom-0 my-auto flex`}
      />
      <button
        onClick={() => {
          toggleExpand();
          inputRef.current?.focus();
        }}
      >
        <img
          src={expandIcon}
          alt="expand autocomplete icon"
          className={`${loading || !expandable ? "opacity-0" : "opacity-100"} ${
            expanded ? "rotate-0" : "rotate-180"
          } transition-all duration-500 absolute h-2/4 right-3 top-0 bottom-0 my-auto `}
        />
      </button>
    </div>
  );
};
