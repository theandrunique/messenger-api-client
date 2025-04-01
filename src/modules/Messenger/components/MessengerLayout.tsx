import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import ChannelSidebar from "./ChannelSidebar";

const MessengerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex overflow-hidden h-full">
        <ChannelSidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default MessengerLayout;
