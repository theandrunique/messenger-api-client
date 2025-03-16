import ChannelSidebar from "../components/Messenger/ChannelSidebar";
import ChannelContainer from "../components/Messenger/ChannelContainer";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import useGateway from "../hooks/useGateway";

function Messenger() {
  const { connect, disconnect } = useGateway();

  useEffect(() => {
    connect();

    return () => disconnect();
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
