import { Autocomplete } from "./components/Autocomplete/Autocomplete";
import { getOptions } from "./services/searchService";
import githubLogo from "./assets/github.svg";
import { Background } from "./components/Background/Background";

function App() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-14">
      <Background />

      <div className="flex flex-col gap-5">
        <img src="/github.svg" alt="github logo" className="h-32" />
        <div className="text-2xl font-medium text-center px-2">
          GitHub users & repositories autocomplete search
        </div>
      </div>

      <div className="px-2 max-w-full">
        <Autocomplete data={getOptions} />
      </div>
    </div>
  );
}

export default App;
