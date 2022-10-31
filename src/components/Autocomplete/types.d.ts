export type SearchFunction = (
  searchStringQuery: string,
  resultsSetter: React.Dispatch<React.SetStateAction<Option[]>>,
  loadingSetter: React.Dispatch<React.SetStateAction<boolean>>,
  errorsSetter: React.Dispatch<React.SetStateAction<string[]>>,
  additionalCallback?: () => void
) => void;

export type Option = {
  label: string;
  url: string;
  id: number;
  type: "repository" | "user";
};
