import ChannelSidebar from "../components/ChannelSidebar";
import ChannelContainer from "../components/ChannelContainer";
import { useEffect } from "react";
import useGateway from "../store/useGateway";

function Messenger() {
  const gateway = useGateway();

  useEffect(() => {
    gateway.connect();

    () => gateway.disconnect();
  }, []);

  return (
    <div className="bg-gray-900 text-white h-screen w-screen flex">
      <ChannelSidebar />
      <ChannelContainer />
    </div>
  );
}

export default Messenger;
