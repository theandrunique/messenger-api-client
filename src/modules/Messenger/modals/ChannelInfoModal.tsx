import { useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import SelectedUser from "../components/SelectedUser";
import { UserPlusIcon, Users } from "lucide-react";
import Loading from "../../../components/Loading";
import { Avatar } from "../../../components/Avatar/Avatar";
import {
  ChannelImage,
  ChannelImageFallback,
} from "../../../components/Avatar/ChannelImage";
import Dialog from "../../../components/Dialog";
import AddChannelMembersDialog from "./AddChannelMembersModal";
import { useState } from "react";
import useSmartChannel from "../../../api/hooks/useSmartChannel";

const ChannelInfoDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { channelId } = useParams();
  const { data, isPending } = useSmartChannel(channelId);
  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState(false);

  if (!channelId) {
    console.error("Channel ID not found");
    return;
  }

  if (isPending || !data)
    return (
      <Dialog>
        <Dialog.Content>
          <Loading message="Loading" />
        </Dialog.Content>
      </Dialog>
    );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <div className="w-[370px]">
            <Dialog.Title>Channel Info</Dialog.Title>

            <div className="flex gap-5 items-center px-4 py-3">
              <Avatar className="w-16 h-16">
                <ChannelImage channelId={data.id} image={data.image} />
                <ChannelImageFallback name={data.name} />
              </Avatar>

              <div className="flex flex-col gap-1">
                <div className="font-semibold text-xl">{data.name}</div>
                <div className="text-sm opacity-50">
                  {data.members.length} members
                </div>
              </div>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-5">
                  <Users className="opacity-70" />
                  <div>{data.members.length} Members</div>
                </div>

                <Button variant="icon" className="p-1">
                  <UserPlusIcon
                    className="opacity-70"
                    onClick={() => setIsAddMembersDialogOpen(true)}
                  />
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                {data.members.map((member) => (
                  <SelectedUser key={member.id} user={member} />
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>

      <AddChannelMembersDialog
        open={isAddMembersDialogOpen}
        onOpenChange={setIsAddMembersDialogOpen}
      />
    </>
  );
};

export default ChannelInfoDialog;
