document.addEventListener("DOMContentLoaded", () => {

  const mediaPairs = [
    { video: "assets/basket.mp4", audio: "assets/moto.mp3" },
    { video: "assets/boda.mp4", audio: "assets/sonido_voces1.mp3" },
    { video: "assets/miyika.mp4", audio: "assets/voces_comedor.mp3" },
    { video: "assets/cafe.mp4", audio: "assets/cafe_sonido.mp3" }
  ];

  const containers = document.querySelectorAll(".video-container");

  containers.forEach((container) => {
    const video = container.querySelector(".video");
    const audio = container.querySelector(".audio");

    // Video congtroles
    const playBtn = container.querySelector(".play-btn");
    const muteBtn = container.querySelector(".mute-btn");
    const volumeSlider = container.querySelector(".volume-slider");

    // Audio controles
    const audioPlayBtn = container.querySelector(".audio-play-btn");
    const audioMuteBtn = container.querySelector(".audio-mute-btn");
    const audioVolumeSlider = container.querySelector(".audio-volume-slider");
    
    // Web Audio API para efectos(controlar los sonidosc pgraves)
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audio);
    const filter = audioContext.createBiquadFilter();

    filter.type = "lowshelf";  // graves
    filter.frequency.value = 400; // Hertz
    filter.gain.value = 0;

    audioSource.connect(filter);
    filter.connect(audioContext.destination);

    // videos aleatorios
    const randomPair = mediaPairs[Math.floor(Math.random() * mediaPairs.length)];
    video.src = randomPair.video;
    audio.src = randomPair.audio;

    // sinergia de audio y video 

    video.addEventListener("play", () => {
      audioContext.resume();
      audio.play();
    });

    video.addEventListener("pause", () => {
      audio.pause();
    });

    video.loop = true;
    audio.loop = true;

   

    // botones de los video

    playBtn.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });

    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
    });

    volumeSlider.addEventListener("input", (e) => {
      video.volume = e.target.value / 100;
    });

    // botones delo audio
    audioPlayBtn.addEventListener("click", () => {
      if (audio.paused) {
        audioContext.resume();
        audio.play();
        if (video.paused) video.play(); 
      } else {
        audio.pause();
      }
    });

    audioMuteBtn.addEventListener("click", () => {
      audio.muted = !audio.muted;
    });

    audioVolumeSlider.addEventListener("input", (e) => {
      audio.volume = e.target.value / 100;
    });

    //  Control de tonos
    const toneSlider = container.querySelector(".tone-slider");

    if (toneSlider) {
      toneSlider.addEventListener("input", (e) => {
        const val = Number(e.target.value); // -30 a +30
        filter.gain.value = val;
      });
    }

  });
});
