import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import MessengerLayout from "./modules/Messenger/components/MessengerLayout";
import ChannelContainer from "./modules/Messenger/components/ChannelContainer";
import ChannelInfoModal from "./modules/Messenger/modals/ChannelInfoModal";
import AddChannelMembersModal from "./modules/Messenger/modals/AddChannelMembersModal";
import ManageChannelModal from "./modules/Messenger/modals/ManageChannelModal";
import MembersModal from "./modules/Messenger/modals/MembersModal";
import LeaveChannelSubmitModal from "./modules/Messenger/modals/LeaveChannelSubmitModal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/messenger" />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messenger"
        element={
          <ProtectedRoute>
            <MessengerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ChannelContainer />} />

        <Route path=":channelId" element={<ChannelContainer />}>
          <Route path="info" element={<ChannelInfoModal />}>
            <Route path="add-members" element={<AddChannelMembersModal />} />
          </Route>
          <Route path="manage-channel" element={<ManageChannelModal />} />
          <Route path="members" element={<MembersModal />}>
            <Route path="add-members" element={<AddChannelMembersModal />} />
          </Route>
          <Route path="leave" element={<LeaveChannelSubmitModal />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
