import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ProfileHeader from "../components/ProfileHeader";
// import { useAuthStore } from "../store/useAuthStore";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import NoConversationPlaceHolder from "../components/NoConversationPlaceHolder";
import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "./../components/BorderAnimatedContainer";
export default function ChatPage() {
  // const { logOut } = useAuthStore();
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="chat-page-container relative w-full max-w-6xl h-[800px] ">
      <BorderAnimatedContainer>
        {/* left side */}
        <div className="side-bar w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className=" flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
          </div>
        </div>

        {/* Right side */}
        <div className="chatting-user flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
