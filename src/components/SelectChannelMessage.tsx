import { MessageSquare } from "lucide-react";

const SelectChannelMessage = () => {
  return (
    <div className={`
      text-white
      flex-1
      flex
      flex-col
      h-full
      bg-[#18181b]
      border-l
      border-gray-700
      overflow-hidden
      items-center
      justify-center
    `}>
      <div className="flex flex-col items-center">
        <MessageSquare className="w-16 h-16" />
        <div className="">Select a channel to start chatting</div>
      </div>
    </div>
  );
};

export default SelectChannelMessage;
