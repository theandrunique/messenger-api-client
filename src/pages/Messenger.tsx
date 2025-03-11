import ChannelSidebar from "../components/Messenger/ChannelSidebar";
import ChannelContainer from "../components/Messenger/ChannelContainer";
import { useEffect } from "react";
import useGateway from "../store/useGateway";
import Navbar from "../components/Navbar";

function Messenger() {
  const gateway = useGateway();

  useEffect(() => {
    gateway.connect();

    return () => gateway.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex overflow-hidden h-full">
        <ChannelSidebar />
        <ChannelContainer />
      </div>
    </div>
  );
}

export default Messenger;
