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

function createPart(voiceName, instrument, sequence, loopEnd) {
  const part = new Tone.Part((time, note) => {
    instrument.triggerAttackRelease(
      note.noteName,
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
  const coreSynth = new Tone.PolySynth(Tone.Synth, coreSynthSettings)

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
  const haloSynth = new Tone.PolySynth(Tone.Synth, haloSynthSettings)

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
