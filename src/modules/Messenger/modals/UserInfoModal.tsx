import { useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import useUserInfo from "../../../api/hooks/useUserInfo";
import { Info } from "lucide-react";
import { useCurrentUserId } from "../../../components/CurrentUserProvider";
import useSmartChannel from "../../../api/hooks/useSmartChannel";
import {
  UserAvatar,
  UserAvatarFallback,
} from "../../../components/Avatar/UserAvatar";
import { Avatar } from "../../../components/Avatar/Avatar";
import Dialog from "../../../components/Dialog";

interface UserInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserInfoModal = ({ open, onOpenChange }: UserInfoModalProps) => {
  const { channelId } = useParams();
  const { data, isPending } = useSmartChannel(channelId);
  const currentUserId = useCurrentUserId();

  let user = null;

  if (data?.members.length === 1) {
    user = data?.members[0];
  } else {
    user = data?.members.find((member) => member.id !== currentUserId);
  }

  const { data: userInfo } = useUserInfo(user?.id || null);

  if (isPending || !data || !userInfo) {
    return (
      <Dialog>
        <Dialog.Content>
          <Loading message="Loading" />
        </Dialog.Content>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div className="w-[370px] text-[#efeff1]">
          <Dialog.Title>User info</Dialog.Title>

          <div className="flex gap-5 items-center px-4 my-3">
            <Avatar className="w-16 h-16">
              <UserAvatar userId={userInfo.id} avatar={userInfo.avatar} />
              <UserAvatarFallback username={userInfo.username} />
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-xl">{userInfo.username}</div>
            </div>
          </div>

          <div className="flex gap-5">
            <div>
              <Info className="w-8 h-8 mt-1" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span>@{userInfo.username}</span>
                <span className="opacity-50">Username</span>
              </div>
              <div className="flex flex-col">
                <span>{userInfo.globalName}</span>
                <span className="opacity-50">Global name</span>
              </div>
              {userInfo.bio && (
                <div className="flex flex-col">
                  <span>{userInfo.bio}</span>
                  <span className="opacity-50">Bio</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default UserInfoModal;
