import ChannelSidebar from "../components/ChannelSidebar";
import ChannelContainer from "../components/ChannelContainer";

function Messenger() {
  return (
    <div className="bg-gray-900 text-white h-screen w-screen flex">
      <ChannelSidebar />

      <ChannelContainer />
    </div>
  );
}

export default Messenger;
