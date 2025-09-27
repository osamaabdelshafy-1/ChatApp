import { useAuthStore } from "../store/useAuthStore";
export default function ChatPage() {
  const { logOut } = useAuthStore();
  return (
    <div>
      <button className="relative block z-10" onClick={logOut}>
        Log out
      </button>
      ChatPage
    </div>
  );
}
