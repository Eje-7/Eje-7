const videos = document.querySelectorAll(".video-box");

videos.forEach(box => {
  const video = box.querySelector("video");
  const playBtn = box.querySelector(".play");
  const pauseBtn = box.querySelector(".pause");
  const muteBtn = box.querySelector(".mute");

  playBtn.addEventListener("click", () => video.play());
  pauseBtn.addEventListener("click", () => video.pause());
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔊" : "🔇";
  });
});
