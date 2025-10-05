// custom hook
// array sounds
const keyboardSound = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

//outer function
function useKeyboardSound() {
  //inner function that do the action
  const playRoundKeyStroke = () => {
    const randomSound =
      keyboardSound[Math.floor(Math.random() * keyboardSound.length)];
    randomSound.time = 0; // this is for better UX .
    randomSound
      .play()
      .catch((error) =>
        console.log("sound is not found:", error.response.data.message)
      );
  };

  return { playRoundKeyStroke };
}

export default useKeyboardSound;
