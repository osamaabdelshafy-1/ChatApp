import {
  LoaderIcon,
  LogOutIcon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "./../store/useAuthStore";

// create an instance of the audio class to add an audio click on web site.
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");
const ProfileHeader = () => {
  const { authUser, logOut, updateProfile, isUpdatingProfileImage } =
    useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const fileInputRef = useRef(null);

  const handlerImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    updateProfile(formData);
  };

  return (
    <div className="p-6 border-slate-700/50  ">
      <div className="flex items-center justify-between ">
        {/* left side  >> img and texts */}
        <div className="img-info flex items-center gap-3">
          {/* avatar */}
          {/* classes {avatar online}  in daisyUI library */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              {isUpdatingProfileImage ? (
                <LoaderIcon className="w-full h-5 animate-spin text-center" />
              ) : (
                <img
                  src={authUser.profilePic || "photos/avatar.png"}
                  alt="User image"
                  className="size-full object-cover"
                />
              )}
              <div className=" absolute inset-0  bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlerImageUpload}
            />
          </div>
          {/* userName && online Text */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs"> online</p>
          </div>
        </div>

        {/* buttons */}
        <div className="flex gap-2 items-center">
          {/* logout btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logOut}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* sound Toggle btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound Before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio played failed", error));

              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
