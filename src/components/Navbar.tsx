import { Link } from "react-router-dom";
import { useLoadedCurrentUser } from "./CurrentUserProvider";
import { HTMLAttributes } from "react";
import cn from "../utils/cn";
import { Avatar } from "./Avatar/Avatar";
import { UserAvatar, UserAvatarFallback } from "./Avatar/UserAvatar";

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

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {}

const Navbar = ({ className, ...props }: NavbarProps) => {
  const currentUser = useLoadedCurrentUser();

  return (
    <div
      className={cn(
        "sticky top-0 left-0 w-full bg-[#18181b] border-b border-black",
        className
      )}
      {...props}
    >
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

        <div className="flex items-center space-x-2 mx-2">
          <Link
            to="/settings"
            className="hover:text-purple-400 text-xl font-semibold"
          >
            {currentUser.username}
          </Link>

          <Avatar className="w-8 h-8">
            <UserAvatar userId={currentUser.id} avatar={currentUser.avatar} />
            <UserAvatarFallback username={currentUser.username} />
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
