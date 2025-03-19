import ChannelCard from "./ChannelCard";
import useUserChannels from "../../../api/hooks/useUserChannels";
import Loading from "../../../components/Loading";
import useSelectedChannelStore from "../stores/useSelectedChannelStore";
import CreateChannelModalForm from "../modals/CreateChannelModalForm";
import { useState } from "react";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";

const ChannelSidebar = () => {
  const { isLoading, data: channels } = useUserChannels();
  const { selectChannel } = useSelectedChannelStore();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  if (isLoading)
    return (
      <Loading message="Loading your channels" className="w-64 bg-[#1f1f23]" />
    );

  return (
    <>
      <div className="relative h-full w-64 bg-[#1f1f23] flex flex-col overflow-y-auto">
        <div className="flex-1">
          {channels?.map((channel) => (
            <ChannelCard
              channel={channel}
              key={channel.id}
              onClick={() => selectChannel(channel)}
            />
          ))}
        </div>
        <div>
          <Button
            className="absolute right-5 bottom-5 rounded-full p-3"
            variant={"secondary"}
            onClick={() => setIsCreateChannelModalOpen(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <CreateChannelModalForm
        onSubmit={(channel) => selectChannel(channel)}
        open={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
      />
    </>
  );
};

export default ChannelSidebar;
