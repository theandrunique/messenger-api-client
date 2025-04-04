import { useParams } from "react-router-dom";
import useChannel from "../../../api/hooks/useChannel";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import Avatar from "../../../components/Avatar";
import useUserInfo from "../../../api/hooks/useUserInfo";
import { Info } from "lucide-react";
import { useCurrentUserId } from "../../../components/CurrentUserProvider";

interface UserInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const UserInfoModal = ({ open, onClose }: UserInfoModalProps) => {
  const { channelId } = useParams();
  const { data, isLoading } = useChannel(channelId || null);
  const currentUserId = useCurrentUserId();

  let user = null;

  if (data?.members.length === 1) {
    user = data?.members[0];
  } else {
    user = data?.members.find((member) => member.id !== currentUserId);
  }

  const { data: userInfo } = useUserInfo(user?.id || null);

  if (isLoading || !data || !userInfo) {
    return (
      <Modal open={open} onClose={onClose} closeOnOverlayClick={true}>
        <Loading message="Loading" />
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <div className="w-[400px] text-[#efeff1]">
        <div className="py-3 px-5 font-semibold text-xl">User Info</div>

        <div className="flex gap-5 items-center px-8 py-3">
          <Avatar
            userId={userInfo.id}
            avatar={userInfo.avatar}
            username={userInfo.username}
            className="w-16 h-16"
          />
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xl">{userInfo.username}</div>
          </div>
        </div>

        <div className="px-5 flex gap-5 mb-5">
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
    </Modal>
  );
};

export default UserInfoModal;
