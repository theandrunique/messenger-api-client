import ChannelCard from "./ChannelCard";
import useUserChannels from "../../../../api/hooks/useUserChannels";
import Loading from "../../../../components/Loading";
import useSelectedChannelStore from "../../stores/useSelectedChannelStore";
import CreateChannelModalForm from "../../modals/CreateChannelModalForm";
import { useState } from "react";
import Button from "../../../../components/ui/Button";
import { Plus } from "lucide-react";

const ChannelSidebar = () => {
  const { isLoading, data: channels } = useUserChannels();
  const { selectChannel } = useSelectedChannelStore();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useState(false);

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

        <div className="sticky bottom-0 pb-3 pr-1 flex justify-end pointer-events-none">
          <Button
            className="pointer-events-auto rounded-full pr-2 pl-1 shadow-xl bg-opacity-90"
            variant={"secondary"}
            onClick={() => setIsCreateChannelModalOpen(true)}
          >
            <div className="flex items-center gap-1">
              <Plus className="w-6 h-6" />
              Create
            </div>
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
