// АУРА настройки звука
// «Паспорта» голосов, эффектов и каналов.
// Нейминг: [голос][ТипУзла]Settings
//   core  = Ядро  (синт 1, высокая мелодия)
//   halo  = Ореол (синт 2, бас и подклад)
//   pulse = Пульс (барабаны, сэмплер)

// ---------- ЯДРО · синт 1 ----------

// Каждая нота как мягкий звон: быстро звучит и долго тает.
// Фильтр срезает резкие верхние частоты, поэтому даже квадрат
// и пила звучат мягко, а не жужжат
const coreSynthSettings = {
  volume: -7,
  envelope: {
    attack: 0.01,
    decay: 0.6,
    sustain: 0.2,
    release: 2.2
  },
  oscillator: {
    type: 'sine' // начало сета: чистый холодный звон
  },
  filter: {
    type: 'lowpass',
    Q: 0.5,
    rolloff: -24
  },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.4,
    release: 2,
    baseFrequency: 900,
    octaves: 2.5
  }
}

// Характер каждой волны Ядра.
// fat значит несколько слегка расстроенных голосов вместе: звук гуще.
// baseFrequency и octaves управляют фильтром: чем ниже, тем глуше.
// volume выравнивает громкость: густые волны иначе звучат тише
//   sine     покой: чистый звон
//   triangle тепло: мягкий и светлый
//   square   меланхолия: глухо и пусто, как кларнет издалека
//   sawtooth гнев: плотно и напористо, но без визга
const coreWaveSettings = {
  sine: {
    volume: -7,
    oscillator: { type: 'sine' },
    filter: { Q: 0.5 },
    filterEnvelope: { baseFrequency: 900, octaves: 2.5 }
  },
  triangle: {
    volume: -8,
    oscillator: { type: 'triangle' },
    filter: { Q: 0.5 },
    filterEnvelope: { baseFrequency: 900, octaves: 2.5 }
  },
  square: {
    volume: -6,
    oscillator: { type: 'fatsquare', count: 2, spread: 12 },
    filter: { Q: 0.5 },
    filterEnvelope: { baseFrequency: 450, octaves: 1.6 }
  },
  sawtooth: {
    volume: -3,
    oscillator: { type: 'fatsawtooth', count: 3, spread: 25 },
    filter: { Q: 1.5 },
    filterEnvelope: { baseFrequency: 600, octaves: 2.6 }
  }
}

const coreChorusSettings = {
  frequency: 1.5,
  delayTime: 3.5,
  depth: 0.7,
  wet: 0.3
}

const corePingPongDelaySettings = {
  delayTime: '8n.',
  feedback: 0.35,
  wet: 0.35 // в начале сета мелодия звучит эхом, как в пустом пространстве
}

const coreFreeverbSettings = {
  roomSize: 0.85,
  dampening: 2500,
  wet: 0.5
}

const coreChannelSettings = {
  channelCount: 2,
  volume: -6,
  pan: 0.2
}

// ---------- ОРЕОЛ · синт 2 ----------

// Мягкий низ: фильтр оставляет только тёплые низкие частоты
const haloSynthSettings = {
  volume: -8,
  envelope: {
    attack: 0.08,
    decay: 0.5,
    sustain: 0.7,
    release: 1.5
  },
  oscillator: {
    type: 'sine'
  },
  filter: {
    type: 'lowpass',
    Q: 0.7,
    rolloff: -24
  },
  filterEnvelope: {
    attack: 0.1,
    decay: 0.8,
    sustain: 0.6,
    release: 1.5,
    baseFrequency: 220,
    octaves: 2.5
  }
}

// Характер каждой волны Ореола
//   sine     покой: мягкий низ
//   triangle тепло: низ чуть светлее
//   square   меланхолия: тёмный глухой гул
//   sawtooth гнев: рычит, но не жужжит
const haloWaveSettings = {
  sine: {
    volume: -8,
    oscillator: { type: 'sine' },
    filter: { Q: 0.7 },
    filterEnvelope: { baseFrequency: 220, octaves: 2.5 }
  },
  triangle: {
    volume: -9,
    oscillator: { type: 'triangle' },
    filter: { Q: 0.7 },
    filterEnvelope: { baseFrequency: 220, octaves: 2.5 }
  },
  square: {
    volume: -8,
    oscillator: { type: 'fatsquare', count: 2, spread: 10 },
    filter: { Q: 0.7 },
    filterEnvelope: { baseFrequency: 150, octaves: 1.8 }
  },
  sawtooth: {
    volume: -5,
    oscillator: { type: 'fatsawtooth', count: 3, spread: 20 },
    filter: { Q: 2 },
    filterEnvelope: { baseFrequency: 200, octaves: 3 }
  }
}

const haloDistortionSettings = {
  distortion: 0.4,
  wet: 0
}

const haloChorusSettings = {
  frequency: 0.6,
  delayTime: 5,
  depth: 0.6,
  wet: 0.3
}

const haloFreeverbSettings = {
  roomSize: 0.8,
  dampening: 1500,
  wet: 0.35
}

const haloChannelSettings = {
  channelCount: 2,
  volume: -6,
  pan: -0.15,
  mute: true // в начале сета Ореол молчит, звучит одна мелодия
}

// ---------- ПУЛЬС · барабаны (сэмплы Roland TR-909) ----------

const pulseSamplerSettings = {
  urls: {
    C2: 'kick.wav',
    D2: 'snare.wav',
    E2: 'hat-closed.wav',
    F2: 'hat-open.wav',
    G2: 'rim.wav'
  },
  baseUrl: 'samples/',
  volume: -6
}

const pulseBitCrusherSettings = {
  bits: 4,
  wet: 0
}

const pulsePingPongDelaySettings = {
  delayTime: '16n',
  feedback: 0.25,
  wet: 0
}

const pulseFreeverbSettings = {
  roomSize: 0.7,
  dampening: 3000,
  wet: 0.2
}

const pulseChannelSettings = {
  channelCount: 2,
  volume: -6,
  pan: 0,
  mute: true // в начале сета Пульс молчит
}

// ---------- ОБЩИЙ ВЫХОД ----------

const masterChannelSettings = {
  channelCount: 2,
  volume: 0
}

const masterLimiterSettings = {
  threshold: -1
}

const transportSettings = {
  bpm: 80 // сет начинается медленно
}

// С какого настроения начинается музыка: cold холод, warm тепло
const masterHarmonySettings = {
  harmony: 'cold'
}
