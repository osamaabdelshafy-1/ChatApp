import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  const tabs = [
    { id: "chats", label: "Chats" },
    { id: "contacts", label: "Contacts" },
  ];

  return (
    <div className="p-3 flex items-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`rounded-lg w-1/2 text-slate-200 text-sm p-4 flex items-center justify-center transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-cyan-600/50 shadow-lg"
              : "bg-gray-700/50 hover:bg-gray-600/50"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ActiveTabSwitch;
