document.addEventListener("DOMContentLoaded", () => {

  const mediaList = [
    { video: "assets/basket.mp4", audio1: "assets/moto.mp3", audio2: "assets/voces_velarias.mp3" },
    { video: "assets/combi4.mp4", audio1: "assets/sonido_voces1.mp3", audio2: "assets/voces_combi.mp3" },
    { video: "assets/cafe.mp4", audio1: "assets/voces_comedor.mp3", audio2: "assets/cubiertos_comedor.mp3" }
  ];

  const blocks = document.querySelectorAll(".media-block");

  blocks.forEach((block, blockIndex) => {

    const video = block.querySelector(".video");
    const audio1 = block.querySelector(".audio1");
    const audio2 = block.querySelector(".audio2");

    const playBtn = block.querySelector(".play-btn");
    const muteBtn = block.querySelector(".mute-btn");
    
    const sliderA1 = block.querySelector(".audio1-volume-slider");
    const sliderA2 = block.querySelector(".audio2-volume-slider");
    const speedSlider = block.querySelector(".speed-slider");
    


   
    let currentMediaIndex = blockIndex % mediaList.length;
    loadMediaInstant(currentMediaIndex);

    
    // AUDIO CONTEXT, aqui es la webapi
    
    const ctx = new AudioContext();
    const src1 = ctx.createMediaElementSource(audio1);
    const src2 = ctx.createMediaElementSource(audio2);

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    gain1.gain.value = 1;
    gain2.gain.value = 1;

    src1.connect(gain1).connect(ctx.destination);
    src2.connect(gain2).connect(ctx.destination);

    
  
    
    playBtn.addEventListener("click", () => {
      ctx.resume();
      if (video.paused) {
        video.play();
        audio1.play();
        audio2.play();
        playBtn.textContent = "⏸";
      } else {
        video.pause();
        audio1.pause();
        audio2.pause();
        playBtn.textContent = "▶";
      }
    });

  
   
    muteBtn.addEventListener("click", () => {
      const state = !audio1.muted;
      audio1.muted = state;
      audio2.muted = state;
      muteBtn.textContent = state ? "🔇" : "🔊";
    });

    // sliderse de transiciones de video/audio
    sliderA1.addEventListener("input", e => {
      gain1.gain.value = e.target.value / 100;
      evaluateVideoChange();
    });

    sliderA2.addEventListener("input", e => {
      gain2.gain.value = e.target.value / 100;
      evaluateVideoChange();
    });

    speedSlider.addEventListener("input", e => {
      const r = Number(e.target.value);
      video.playbackRate = r;
      audio1.playbackRate = r;
      audio2.playbackRate = r;
    });

    function evaluateVideoChange() {
      const total = Number(sliderA1.value) + Number(sliderA2.value);

      let newIndex = 0;
      if (total <= 80) newIndex = 0;
      else if (total <= 140) newIndex = 1;
      else newIndex = 2;

      if (newIndex !== currentMediaIndex) {
        fadeChange(newIndex);
        currentMediaIndex = newIndex;
      }
    }

    //crossfade
    
    function fadeChange(newIndex) {
      const media = mediaList[newIndex];

      // 1) Fade-out en 300ms
      gsap.to(video, { opacity: 0, duration: 0.3 });
      gsap.to([gain1.gain, gain2.gain], { value: 0, duration: 0.3 });

      // 2) Cuando termina -> cambiar media
      setTimeout(() => {
        video.src = media.video;
        audio1.src = media.audio1;
        audio2.src = media.audio2;

        video.currentTime = 0;
        audio1.currentTime = 0;
        audio2.currentTime = 0;

        video.play();
        audio1.play();
        audio2.play();

        // 3) Fade-in en 400ms
        gsap.to(video, { opacity: 1, duration: 0.4 });
        gsap.to(gain1.gain, { value: sliderA1.value / 100, duration: 0.4 });
        gsap.to(gain2.gain, { value: sliderA2.value / 100, duration: 0.4 });

      }, 300);
    }

   
    function loadMediaInstant(i) {
      const media = mediaList[i];
      video.src = media.video;
      audio1.src = media.audio1;
      audio2.src = media.audio2;

      video.play();
      audio1.play();
      audio2.play();
    }

  });

});

