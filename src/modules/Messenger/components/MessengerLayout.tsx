import { Outlet, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import ChannelSidebar from "./ChannelSidebar";

const MessengerLayout = () => {
  const { channelId } = useParams();

  return (
    <div className="flex flex-col h-[100dvh]">
      <Navbar className={`${channelId ? "hidden sm:block" : "block"}`} />

      <div className="flex overflow-hidden h-full">
        <ChannelSidebar
          className={`${channelId ? "hidden sm:flex" : "flex"} w-full sm:w-72`}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default MessengerLayout;
