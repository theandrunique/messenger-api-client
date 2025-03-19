import { MessageSquare } from "lucide-react";

const SelectChannelMessage = () => {
  return (
    <div
      className={`
      text-[#efeff1]
      flex-1
      flex
      flex-col
      h-full
      bg-[#0e0e10]
      items-center
      justify-center
    `}
    >
      <div className="flex flex-col items-center">
        <MessageSquare className="w-16 h-16" />
        <div>Select a channel to start chatting</div>
      </div>
    </div>
  );
};

export default SelectChannelMessage;
