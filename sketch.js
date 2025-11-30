document.addEventListener("DOMContentLoaded", () => {

  const mediaList = [
    { video: "assets/basket.mp4", audio1: "assets/moto.mp3", audio2: "assets/voces_velarias.mp3" },
    { video: "assets/boda.mp4", audio1: "assets/sonido_voces1.mp3", audio2: "assets/voces_combi.mp3" },
    { video: "assets/cafe.mp4", audio1: "assets/voces_comedor.mp3", audio2: "assets/cubiertos_comedor.mp3" }
  ];

  const blocks = document.querySelectorAll(".media-block");

  blocks.forEach(block => {

    const video = block.querySelector(".video");
    const audio1 = block.querySelector(".audio1");
    const audio2 = block.querySelector(".audio2");

    const playBtn = block.querySelector(".play-btn");
    const muteBtn = block.querySelector(".mute-btn");

    const sliderA1 = block.querySelector(".audio1-volume-slider");
    const sliderA2 = block.querySelector(".audio2-volume-slider");
    const speedSlider = block.querySelector(".speed-slider");

    // cargar videos
    const media = mediaList[Math.floor(Math.random() * mediaList.length)];
    video.src = media.video;
    audio1.src = media.audio1;
    audio2.src = media.audio2;

    video.loop = true;
    audio1.loop = true;
    audio2.loop = true;

    video.muted = true;
    audio1.muted = false;
    audio2.muted = false;

    // audio context/web api
    const ctx = new AudioContext();
    const src1 = ctx.createMediaElementSource(audio1);
    const src2 = ctx.createMediaElementSource(audio2);

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    gain1.gain.value = 1;
    gain2.gain.value = 1;

    src1.connect(gain1).connect(ctx.destination);
    src2.connect(gain2).connect(ctx.destination);

    // play/pausar
    playBtn.addEventListener("click", () => {
      ctx.resume();
      if (video.paused) {
        video.play();
        audio1.play();
        audio2.play();
      } else {
        video.pause();
        audio1.pause();
        audio2.pause();
      }
    });

    // mute audios
    muteBtn.addEventListener("click", () => {
      const muteState = !audio1.muted;
      audio1.muted = muteState;
      audio2.muted = muteState;
    });

    // sliders
    sliderA1.addEventListener("input", e => {
      gain1.gain.value = e.target.value / 100;
    });

    sliderA2.addEventListener("input", e => {
      gain2.gain.value = e.target.value / 100;
    });

    speedSlider.addEventListener("input", e => {
      const r = Number(e.target.value);
      video.playbackRate = r;
      audio1.playbackRate = r;
      audio2.playbackRate = r;
    });

  });

});
