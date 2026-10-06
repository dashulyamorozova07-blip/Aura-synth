// АУРА настройки звука
// «Паспорта» голосов, эффектов и каналов.
// Нейминг: [голос][ТипУзла]Settings
//   core  = Ядро  (синт 1, высокая мелодия)
//   halo  = Ореол (синт 2, бас и подклад)
//   pulse = Пульс (барабаны, сэмплер)

// ---------- ЯДРО · синт 1 ----------

const coreSynthSettings = {
  volume: -8,
  envelope: {
    attack: 0.02,
    decay: 0.4,
    sustain: 0.3,
    release: 1.4
  },
  oscillator: {
    type: 'triangle'
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
  wet: 0.25
}

const coreFreeverbSettings = {
  roomSize: 0.85,
  dampening: 3500,
  wet: 0.4
}

const coreChannelSettings = {
  channelCount: 2,
  volume: -6,
  pan: 0.2
}

// ---------- ОРЕОЛ · синт 2 ----------

const haloSynthSettings = {
  volume: -6,
  envelope: {
    attack: 0.3,
    decay: 0.6,
    sustain: 0.7,
    release: 2
  },
  oscillator: {
    type: 'sine'
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
  dampening: 2500,
  wet: 0.35
}

const haloChannelSettings = {
  channelCount: 2,
  volume: -6,
  pan: -0.15
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
  pan: 0
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
  bpm: 96
}
