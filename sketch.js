document.addEventListener("DOMContentLoaded", () => {

  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const mediaList = [
    {
      id: "cafe",
      full: "assets/videosm/comec.mp4",
      empty: "assets/videosm/comev.mp4",
      audio1: "assets/audiosm/chico_comiendo.mp3",
      audio2: "assets/audiosm/comedor/voces_comedor.mp3"
    },
    {
      id: "centro",
      full: "assets/videosm/lerc.mp4",
      empty: "assets/videosm/lerv.mp4",
      audio1: "assets/audiosm/CentroLerma/campana_centro.mp3",
      audio2: "assets/audiosm/CentroLerma/voces_centro.mp3"
    },
    {
      id: "combi",
      full: "assets/videosm/combc.mp4",
      empty: "assets/videosm/combv.mp4",
      audio1: "assets/audiosm/Combi/moto.mp3",
      audio2: "assets/audiosm/Combi/voces_combi.mp3"
    },
    {
      id: "oxo",
      full: "assets/videosm/oxc.mp4",
      empty: "assets/videosm/oxv.mp4",
      audio1: "assets/audiosm/oxxo/oxxo_ambiente.mp3",
      audio2: "assets/audiosm/oxxo/coches_oxxo.mp3"
    },
    {
      id: "parque",
      full: "assets/videosm/parc.mp4",
      empty: "assets/videosm/parv.mp4",
      audio1: "assets/audiosm/Parque/vocesparque.mp3",
      audio2: "assets/audiosm/parque/pelotas.mp3"
    },
    {
      id: "velaria",
      full: "assets/videosm/velc.mp4",
      empty: "assets/videosm/velv.mp4",
      audio1: "assets/audiosm/Velarias/voces_velarias.mp3",
      audio2: "assets/audiosm/Velarias/musica_velarias.mp3"
    }
  ];

  const blocks = document.querySelectorAll(".media-block");

  const shuffled = [...mediaList].sort(() => Math.random() - 0.5);

  blocks.forEach((block, index) => {

    const media = shuffled[index % shuffled.length];

    const video = block.querySelector(".video");
    const audio1 = block.querySelector(".audio1");
    const audio2 = block.querySelector(".audio2");

    const sliderA1 = block.querySelector(".audio1-volume-slider");
    const sliderA2 = block.querySelector(".audio2-volume-slider");
    const speedSlider = block.querySelector(".speed-slider");

    const playBtn = block.querySelector(".play-btn");
    const muteBtn = block.querySelector(".mute-btn");

    let isEmpty = false;
    let currentSrc = media.full;

    // para detectar subida/bajada
    let lastA1 = Number(sliderA1.value);
    let lastA2 = Number(sliderA2.value);

    // WebAudio
    const src1 = ctx.createMediaElementSource(audio1);
    const src2 = ctx.createMediaElementSource(audio2);

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    src1.connect(gain1).connect(ctx.destination);
    src2.connect(gain2).connect(ctx.destination);

    gain1.gain.value = sliderA1.value / 100;
    gain2.gain.value = sliderA2.value / 100;

    function loadInitial() {
      video.src = media.full;
      audio1.src = media.audio1;
      audio2.src = media.audio2;

      ctx.resume();

      video.play().catch(() => {
        video.muted = true;
        video.play();
      });

      audio1.play();
      audio2.play();
    }

    loadInitial();

    function evaluateState() {

      const v1 = Number(sliderA1.value);
      const v2 = Number(sliderA2.value);

      const up = v1 > lastA1 || v2 > lastA2;
      const down = v1 < lastA1 || v2 < lastA2;

      if (up && isEmpty) {
        isEmpty = false;
        switchState(media.full);
      }

      if (down && !isEmpty) {
        isEmpty = true;
        switchState(media.empty);
      }

      lastA1 = v1;
      lastA2 = v2;
    }

    //crosfade
    function switchState(newSrc) {
      gsap.to(video, { opacity: 0, duration: 0.4 });
      gsap.to(gain1.gain, { value: 0, duration: 0.3 });
      gsap.to(gain2.gain, { value: 0, duration: 0.3 });

      setTimeout(() => {
        currentSrc = newSrc;
        video.src = newSrc;

        video.currentTime = 0;
        audio1.currentTime = 0;
        audio2.currentTime = 0;

        ctx.resume();
        video.play().catch(() => video.play());
        audio1.play();
        audio2.play();

        gsap.to(video, { opacity: 1, duration: 0.4 });
        gsap.to(gain1.gain, { value: sliderA1.value / 100, duration: 0.4 });
        gsap.to(gain2.gain, { value: sliderA2.value / 100, duration: 0.4 });

      }, 350);
    }

    //sliders
    sliderA1.addEventListener("input", () => {
      gain1.gain.value = sliderA1.value / 100;
      evaluateState();
    });

    sliderA2.addEventListener("input", () => {
      gain2.gain.value = sliderA2.value / 100;
      evaluateState();
    });

    speedSlider.addEventListener("input", () => {
      const r = Number(speedSlider.value);
      audio1.playbackRate = r;
      audio2.playbackRate = r;
      video.playbackRate = r;
    });

    //PLAY 
    playBtn.addEventListener("click", () => {
      ctx.resume();
      if (video.paused) {
        video.play(); audio1.play(); audio2.play();
        playBtn.textContent = "⏸";
      } else {
        video.pause(); audio1.pause(); audio2.pause();
        playBtn.textContent = "▶";
      }
    });

    
    muteBtn.addEventListener("click", () => {
      const muted = !audio1.muted;
      audio1.muted = audio2.muted = muted;
      muteBtn.textContent = muted ? "🔇" : "🔊";
    });

  });

});