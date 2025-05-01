import { X } from "lucide-react";
import Button from "../../../components/ui/Button";
import { UserPublicSchema } from "../../../schemas/user";
import {
  UserAvatar,
  UserAvatarFallback,
} from "../../../components/Avatar/UserAvatar";
import { Avatar } from "../../../components/Avatar/Avatar";

interface SelectedUserProps {
  user: UserPublicSchema;
  onRemove?: () => void;
}

const SelectedUser = ({ user, onRemove }: SelectedUserProps) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-2 bg-[#1f1f23] p-2 rounded-2xl justify-between"
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <UserAvatar userId={user.id} avatar={user.avatar} />
          <UserAvatarFallback username={user.username} />
        </Avatar>
        <div className="font-semibold">
          {user.username} ({user.globalName})
        </div>
      </div>

      {onRemove && (
        <Button
          className="p-1 rounded-lg justify-self-end"
          variant="icon"
          type="button"
          onClick={onRemove}
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default SelectedUser;
