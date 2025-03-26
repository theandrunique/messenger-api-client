import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getTokens } from "../api/api";
import env from "../env";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChannelCreateEventSchema,
  ChannelMemberAddEventSchema,
  ChannelMemberRemoveEventSchema,
  ChannelUpdateEventSchema,
  MessageCreateEventSchema,
  MessageUpdateEventSchema,
} from "../schemas/gateway";
import {
  updateUseUserChannelsOnNewMessage,
  updateUseUserChannelsOnNewChannel,
  updateUseUserChannelOnMemberRemove,
  updateUseUserChannelOnMemberAdd,
  updateUseUserChannelOnChannelUpdate,
} from "../api/hooks/useUserChannels";
import {
  updateUseMessagesOnMessageCreate,
  updateUseMessagesOnMessageUpdate,
} from "../api/hooks/useMessages";
import { invalidateUseChannel } from "../api/hooks/useChannel";
import useCurrentUser from "../api/hooks/useCurrentUser";
import { useNavigate, useParams } from "react-router-dom";
import notifications from "../utils/notifications";

const useGateway = () => {
  const socket = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { channelId } = useParams();

  const connect = () => {
    const token = getTokens();

    socket.current = io(env.GATEWAY_ENDPOINT, {
      query: {
        accessToken: token?.accessToken,
      },
    });

    setupEventListeners(socket.current);
  };

  const disconnect = () => {
    if (socket.current) socket.current.disconnect();
  };

  const setupEventListeners = (socket: Socket) => {
    socket.on("connect", () => {
      console.log(`Connected to gateway on ${env.GATEWAY_ENDPOINT}`);
    });

    socket.on("error", (error) => {
      console.error("Gateway error:", error);
    });

    socket.on("message:new", (event: MessageCreateEventSchema) => {
      updateUseUserChannelsOnNewMessage(queryClient, event);
      updateUseMessagesOnMessageCreate(queryClient, event);
    });
    socket.on("message:update", (event: MessageUpdateEventSchema) => {
      updateUseMessagesOnMessageUpdate(queryClient, event);
    });

    socket.on("channel:member-add", (event: ChannelMemberAddEventSchema) => {
      updateUseUserChannelOnMemberAdd(queryClient, event, currentUser!.id);
      invalidateUseChannel(queryClient, event.channelId);
    });

    socket.on(
      "channel:member-remove",
      (event: ChannelMemberRemoveEventSchema) => {
        updateUseUserChannelOnMemberRemove(queryClient, event, currentUser!.id);
        invalidateUseChannel(queryClient, event.channelId);
        if (
          currentUser!.id === event.user.id &&
          channelId === event.channelId
        ) {
          navigate("/messenger");
          notifications.info("You have been removed from this channel");
        }
      }
    );

    socket.on("channel:new", (event: ChannelCreateEventSchema) => {
      updateUseUserChannelsOnNewChannel(queryClient, event.payload);
    });

    socket.on("channel:update", (event: ChannelUpdateEventSchema) => {
      updateUseUserChannelOnChannelUpdate(queryClient, event);
      invalidateUseChannel(queryClient, event.payload.id);
    });
  };

  useEffect(() => {
    if (currentUser) {
      connect();
    }
    return () => disconnect();
  }, [currentUser]);
};

export default useGateway;
