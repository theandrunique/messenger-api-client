import { useEffect, useRef, useState } from "react";
import Avatar from "../../../components/Avatar";
import Input from "../../../components/ui/Input";
import { searchUsers } from "../../../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPublicSchema } from "../../../schemas/user";
import { Search } from "lucide-react";

interface SearchResultProps {
  result: UserPublicSchema;
  isActive: boolean;
  onClick: () => void;
}

const SearchResult = ({ result, isActive, onClick }: SearchResultProps) => {
  return (
    <div className="w-full cursor-pointer" onClick={onClick}>
      <div
        className={`flex items-center ${isActive && "bg-[#35353b]"} rounded-md px-1 py-2 gap-2 hover:bg-[#3d3d40]`}
      >
        <Avatar
          userId={result.id}
          avatar={result.avatar}
          username={result.username}
          className="w-8 h-8"
        />
        <div className="font-semibold">
          {result.username} ({result.globalName})
        </div>
      </div>
    </div>
  );
};

interface UsersSearchInputProps {
  onSubmit: (result: UserPublicSchema) => void;
  excludeIds: string[];
}

const UsersSearchInput = ({ onSubmit, excludeIds }: UsersSearchInputProps) => {
  const [query, setQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: suggestions,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["search-users", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 1 * 60 * 1000,
    placeholderData: (prev) => prev,
    select: (data) => data.filter((user) => !excludeIds.includes(user.id)),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeSuggestion === suggestions.length - 1) {
        setActiveSuggestion(-1);
      } else {
        setActiveSuggestion((prev) => prev + 1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (activeSuggestion === -1) {
        setActiveSuggestion(suggestions.length - 1);
      } else {
        setActiveSuggestion((prev) => prev - 1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSubmit(suggestions[activeSuggestion]);
      }
    }
  };

  const handleSubmit = (result: UserPublicSchema) => {
    onSubmit(result);
    setQuery("");
    queryClient.invalidateQueries({ queryKey: ["search-users"] });
  };

  const getDisplayMessage = () => {
    if (query.trim().length === 0) return null;
    if (isPending) return "Loading...";
    if (isError) return "Error loading results";
    if (suggestions?.length === 0) return "No results";
    return null;
  };

  const isShowMessage = () => {
    if (query.trim().length === 0) return true;
    if (isPending) return true;
    if (isError) return true;
    if (suggestions?.length === 0) return true;
    return false;
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Search className="w-5 h-5" />
        </div>

        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search users"
          className="w-full pl-8"
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#18181b] rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.8)] z-50">
          {isShowMessage() && getDisplayMessage() && (
            <div className="p-3 font-semibold text-center">
              {getDisplayMessage()}
            </div>
          )}
          {!isShowMessage() && (
            <div className="max-h-40 p-1 overflow-y-auto">
              {suggestions?.map((suggestion, index) => (
                <SearchResult
                  key={suggestion.id}
                  result={suggestion}
                  isActive={index === activeSuggestion}
                  onClick={() => handleSubmit(suggestion)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersSearchInput;
