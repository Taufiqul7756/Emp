import React, {useState, useEffect, useCallback, useRef, useMemo} from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

interface ReusableSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (term: string) => void;
}

const SearchBox: React.FC<ReusableSearchInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

const debouncedOnChange = useMemo(
  () => debounce((term: string) => {
      onChange(term);
    }, 400),
    [onChange]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [localValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-gray-400">
        <Search size={20} />
      </div>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        className="w-[300px] h-11 px-[13px] py-3 pl-10"
        value={localValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBox;
