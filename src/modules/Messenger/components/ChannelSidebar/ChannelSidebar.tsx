import ChannelCard from "./ChannelCard";
import useUserChannels from "../../../../api/hooks/useUserChannels";
import Loading from "../../../../components/Loading";
import CreateChannelModalForm from "../../modals/CreateChannelModalForm";
import { useState } from "react";
import Button from "../../../../components/ui/Button";
import { MessageCirclePlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import UsersSearchInput from "../UsersSearchInput";
import { UserPublicSchema } from "../../../../schemas/user";
import { getDMChannel } from "../../../../api/api";

const ChannelSidebar = () => {
  const { channelId } = useParams();
  const { isLoading, data: channels } = useUserChannels();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useState(false);
  const navigate = useNavigate();

  const selectChannel = (channelId: string) => {
    navigate(`/messenger/${channelId}`);
  };

  if (isLoading)
    return (
      <Loading
        message="Loading your channels"
        className="md:w-72 w-16 bg-[#1f1f23]"
      />
    );

  const handleUserSelect = async (user: UserPublicSchema) => {
    const channel = await getDMChannel(user.id);
    selectChannel(channel.id);
  };

  return (
    <>
      <div className="relative md:w-72 w-16 h-full bg-[#1f1f23] flex flex-col overflow-y-auto">
        <div className="px-2 pt-2 sticky top-0 z-50 pb-2">
          <UsersSearchInput
            onSubmit={(user) => handleUserSelect(user)}
            clearOnSubmit={false}
          />
        </div>

        <div className="flex-1">
          {channels?.map((channel) => (
            <ChannelCard
              isActive={channel.id === channelId}
              channel={channel}
              key={channel.id}
              onClick={() => selectChannel(channel.id)}
            />
          ))}
        </div>

        <div className="sticky bottom-0 pb-3 flex justify-center md:justify-end pointer-events-none">
          <Button
            className="pointer-events-auto rounded-full p-2 shadow-xl bg-opacity-90 flex items-center gap-1 md:mr-3"
            variant={"secondary"}
            onClick={() => setIsCreateChannelModalOpen(true)}
          >
            <MessageCirclePlus className="w-6 h-6" />
            <span className="hidden md:block">Create</span>
          </Button>
        </div>
      </div>

      <CreateChannelModalForm
        onSubmit={(channel) => selectChannel(channel.id)}
        open={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
      />
    </>
  );
};

export default ChannelSidebar;
