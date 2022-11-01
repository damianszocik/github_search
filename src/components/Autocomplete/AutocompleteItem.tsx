import { useState } from "react";
import { Option } from "./types";
import repositoryIcon from "../../assets/icons/repository.svg";
import userIcon from "../../assets/icons/user.svg";
import openIcon from "../../assets/icons/openInNew.svg";

type AutocompleteItemProps = {
  label: string;
  onClick: () => void;
  focused: boolean;
  type: Option["type"];
  className?: string;
};

export const AutocompleteItem = ({
  label,
  onClick,
  focused,
  type,
  className = "",
}: AutocompleteItemProps) => {
  const [hovered, setHovered] = useState(false);

  const active = focused || hovered;
  return (
    <li
      className={`py-1 cursor-pointer snap-center ${
        active ? "font-medium text-gray-700" : "font-light text-gray-600"
      } ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid="autocompleteItem"
    >
      <div className="flex items-center gap-2">
        <img
          className="h-5"
          src={type === "user" ? repositoryIcon : userIcon}
          alt={`${type} icon`}
        />
        <div className="text-lg">{label}</div>
        <div className="grow flex justify-end pr-1">
          <img
            src={openIcon}
            alt="open in new tab"
            className={`h-5 ${active ? "visible" : "invisible"}`}
          />
        </div>
      </div>
    </li>
  );
};
