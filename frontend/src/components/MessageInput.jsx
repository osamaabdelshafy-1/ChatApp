import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import useKeyboardSound from "../hooks/useKeyBoardSound";
import { useChatStore } from "../store/useChatStore";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playRoundKeyStroke } = useKeyboardSound();
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled, selectedUser } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imagePreview) || isLoading || !selectedUser) return;

    if (isSoundEnabled) playRoundKeyStroke();

    // Create FormData object
    const formData = new FormData();

    // Append text message
    if (text.trim()) {
      formData.append("text", text.trim());
    }

    // Append image file if exists
    if (imagePreview && fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    setIsLoading(true);
    try {
      await sendMessage(formData);
      // Reset the states after successful send
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      // Error handling is done in the store
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 border border-slate-600"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4 items-center"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRoundKeyStroke();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 focus:outline-none focus:border-slate-500"
          disabled={isLoading || !selectedUser}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          disabled={isLoading || !selectedUser}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg p-2 transition-colors ${
            imagePreview ? "text-cyan-400" : ""
          } ${
            isLoading || !selectedUser ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !selectedUser}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={
            (!text.trim() && !imagePreview) || isLoading || !selectedUser
          }
          className="bg-cyan-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
