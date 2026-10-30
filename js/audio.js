const voices = {}

const noteListeners = []

function listenToNotes(listener) {
  noteListeners.push(listener)
}

// ---------- ОБЩИЙ ВЫХОД ----------

function createMaster() {
  const masterChannel = new Tone.Channel(masterChannelSettings)
  const masterLimiter = new Tone.Limiter(masterLimiterSettings)

  masterChannel.chain(masterLimiter, Tone.getDestination())
  Tone.getTransport().bpm.value = transportSettings.bpm

  return masterChannel
}

// Холод или тепло. Меняет аккорды Ядра и Ореола, Пульс не трогает.
let masterHarmony = masterHarmonySettings.harmony

// В холоде нота меняется на ноту холодного аккорда с тем же местом,
// в той же октаве или рядом
function harmonize(note) {
  if (masterHarmony === 'warm') return note.noteName

  const bar = Number(note.time.split(':')[0]) % 4
  const letter = note.noteName.slice(0, -1)
  const octave = Number(note.noteName.slice(-1))
  const place = masterHarmonyChords.warm[bar].indexOf(letter)
  if (place === -1) return note.noteName

  const coldName = masterHarmonyChords.cold[bar][place] + octave
  const step =
    Tone.Frequency(coldName).toMidi() - Tone.Frequency(note.noteName).toMidi()

  // не уезжаем дальше, чем на полоктавы
  if (step > 6) return Tone.Frequency(coldName).transpose(-12).toNote()
  if (step < -6) return Tone.Frequency(coldName).transpose(12).toNote()
  return coldName
}

// Переключаем с начала следующего такта, чтобы аккорд не рвался
function setHarmony(harmonyName) {
  const transport = Tone.getTransport()

  if (transport.state !== 'started') masterHarmony = harmonyName
  else transport.scheduleOnce(() => (masterHarmony = harmonyName), '@1m')

  setAuraHarmony(harmonyName)
}

function createPart(voiceName, instrument, sequence, loopEnd) {
  const part = new Tone.Part((time, note) => {
    // у барабанов нет аккордов, их ноты не меняем
    const noteName = voiceName === 'pulse' ? note.noteName : harmonize(note)

    instrument.triggerAttackRelease(
      noteName,
      note.duration,
      time,
      note.velocity
    )

    Tone.getDraw().schedule(() => {
      noteListeners.forEach((listener) => listener(voiceName, note))
    }, time)
  }, sequence).start(0)

  part.loop = true
  part.loopEnd = loopEnd

  return part
}

function createVoice(voiceName, { source, effects, channel, parts }, master) {
  const meter = new Tone.Meter({ normalRange: true, smoothing: 0.85 })

  source.chain(...Object.values(effects), channel)
  channel.connect(master)
  channel.connect(meter)

  voices[voiceName] = { source, effects, channel, meter, parts }
}

// ---------- ЯДРО · синт 1 ----------

function createCore(master) {
  // MonoSynth это синтезатор с фильтром, он звучит мягче обычного Synth
  const coreSynth = new Tone.PolySynth(Tone.MonoSynth, coreSynthSettings)

  createVoice(
    'core',
    {
      source: coreSynth,
      effects: {
        chorus: new Tone.Chorus(coreChorusSettings).start(),
        delay: new Tone.PingPongDelay(corePingPongDelaySettings),
        reverb: new Tone.Freeverb(coreFreeverbSettings)
      },
      channel: new Tone.Channel(coreChannelSettings),
      parts: {
        I: createPart('core', coreSynth, coreSequenceI, '4m'),
        II: createPart('core', coreSynth, coreSequenceII, '4m')
      }
    },
    master
  )
}

// ---------- ОРЕОЛ · синт 2 ----------

function createHalo(master) {
  const haloSynth = new Tone.PolySynth(Tone.MonoSynth, haloSynthSettings)

  createVoice(
    'halo',
    {
      source: haloSynth,
      effects: {
        distortion: new Tone.Distortion(haloDistortionSettings),
        chorus: new Tone.Chorus(haloChorusSettings).start(),
        reverb: new Tone.Freeverb(haloFreeverbSettings)
      },
      channel: new Tone.Channel(haloChannelSettings),
      parts: {
        I: createPart('halo', haloSynth, haloSequenceI, '4m'),
        II: createPart('halo', haloSynth, haloSequenceII, '4m')
      }
    },
    master
  )
}

// ---------- ПУЛЬС · барабаны ----------

function createPulse(master) {
  const pulseSampler = new Tone.Sampler(pulseSamplerSettings)

  createVoice(
    'pulse',
    {
      source: pulseSampler,
      effects: {
        crusher: new Tone.BitCrusher(pulseBitCrusherSettings),
        delay: new Tone.PingPongDelay(pulsePingPongDelaySettings),
        reverb: new Tone.Freeverb(pulseFreeverbSettings)
      },
      channel: new Tone.Channel(pulseChannelSettings),
      parts: {
        I: createPart('pulse', pulseSampler, pulseSequenceI, '1m'),
        II: createPart('pulse', pulseSampler, pulseSequenceII, '1m')
      }
    },
    master
  )
}

// ---------- УПРАВЛЕНИЕ ----------

// Форма волны: у каждой свой характер (покой, тепло, меланхолия, гнев)
const waveSettings = { core: coreWaveSettings, halo: haloWaveSettings }

function setVoiceWave(voiceName, waveName) {
  voices[voiceName].source.set(waveSettings[voiceName][waveName])
}

function setPattern(voiceName, patternName) {
  Object.entries(voices[voiceName].parts).forEach(([name, part]) => {
    part.mute = name !== patternName
  })
}

function createInstrument() {
  const master = createMaster()

  createCore(master)
  createHalo(master)
  createPulse(master)

  Object.keys(voices).forEach((voiceName) => setPattern(voiceName, 'I'))

  return master
}
