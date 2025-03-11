import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import useAuthStore from "../store/useAuthStore";
import Input from "./ui/Input";


const Icon = () => {
  return (
    <div className="flex items-center">
      <svg
        className="w-8 h-8 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        ></path>
      </svg>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className="mx-4 my-1">
      <Input
        type="text"
        placeholder="Search..."
        className="w-full font-semibold rounded-lg p-1.5"
      />
    </div>
  );
};

const Navbar = () => {
  const currentUser = useAuthStore((store) => store.currentUser);

  if (currentUser === null) throw new Error("User is not logged in");

  return (
    <div className="sticky top-0 left-0 w-full bg-[#18181b] border-b border-black">
      <div className="text-white flex justify-between items-center h-14">
        <div className="flex items-center space-x-6 ml-2">
          <Icon />
          <Link
            to="/messenger"
            className="hover:text-purple-400 text-xl font-semibold"
          >
            Messenger
          </Link>
        </div>

        <div className="w-4/12 space-x-6 m-1">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-2 mx-2">
          <Link
            to="/settings"
            className="hover:text-purple-400 text-xl font-semibold"
          >
            {currentUser.username}
          </Link>

          <Avatar
            userId={currentUser.id}
            avatar={currentUser.avatar}
            username={currentUser.username}
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
