import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsersIds } = useAuthStore();
  const onlineState = onlineUsersIds.includes(selectedUser._id);
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-slate-800/50 max-h-[84px] border-b  border-slat-700/50 px-6 flex-1 ">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${onlineState ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/photos/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        {/* userName */}
        <div className="txt w-32 flex flex-col">
          <h3 className="truncate text-slate-200">{selectedUser.fullName}</h3>

          <p className="text-slate-200/70">
            {onlineState ? "online" : "Offline"}{" "}
          </p>
        </div>
      </div>
      {/* collapse */}
      <button
        onClick={() => {
          setSelectedUser(null);
        }}
      >
        <XIcon className="w-5 h-5  cursor-pointer text-slate-400  hover:text-slate-200 transition-colors" />
      </button>
    </div>
  );
};

export default ChatHeader;
