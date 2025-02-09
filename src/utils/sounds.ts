const createAudio = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.3;
  return audio;
};

export const sounds = {
  click: createAudio('/sounds/click.mp3'),
  explosion: createAudio('/sounds/explosion.mp3'),
  flag: createAudio('/sounds/flag.mp3'),
  win: createAudio('/sounds/win.mp3'),
  reveal: createAudio('/sounds/reveal.mp3')
};

export const playSound = (sound: keyof typeof sounds) => {
  const audio = sounds[sound];
  audio.currentTime = 0;
  audio.play().catch(() => {}); // Ignorar errores si el navegador bloquea el audio
}; 