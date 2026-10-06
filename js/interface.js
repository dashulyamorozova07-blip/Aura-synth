// АУРА · интерфейс
// Связывает кнопки и фейдеры на странице с голосами.
// Голос находится по data-voice, эффект по data-effect.

// Закрашиваем фейдер до текущего значения
function paintFader(fader) {
  const percent = ((fader.value - fader.min) / (fader.max - fader.min)) * 100
  fader.style.setProperty('--fill', `${percent}%`)
}

function bindFader(fader, value, onInput) {
  fader.value = value
  paintFader(fader)
  fader.addEventListener('input', () => {
    paintFader(fader)
    onInput(Number(fader.value))
  })
}

// Одна кнопка из группы нажата, остальные отжаты
function bindChoice(buttons, onChoose) {
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'))
      button.setAttribute('aria-pressed', 'true')
      onChoose(button)
    })
  })
}

function bindVoice(voiceElement) {
  const voiceName = voiceElement.dataset.voice
  const voice = voices[voiceName]

  // Вкл / выкл голоса
  const toggleButton = voiceElement.querySelector('.ToggleButton')
  toggleButton.addEventListener('click', () => {
    const isOn = toggleButton.getAttribute('aria-pressed') === 'true'
    toggleButton.setAttribute('aria-pressed', String(!isOn))
    toggleButton.textContent = isOn ? 'выкл' : 'вкл'
    voice.channel.mute = isOn
    voiceElement.classList.toggle('is-muted', isOn)
  })

  // Узор: спокойный или плотный
  bindChoice(voiceElement.querySelectorAll('[data-pattern]'), (button) => {
    setPattern(voiceName, button.dataset.pattern)
  })

  // Форма волны: меняет звук и цвет ауры
  bindChoice(voiceElement.querySelectorAll('[data-wave]'), (button) => {
    voice.source.set({ oscillator: { type: button.dataset.wave } })
    setAuraWave(voiceName, button.dataset.wave)
  })

  // Сила эффектов
  voiceElement.querySelectorAll('[data-effect]').forEach((fader) => {
    const effect = voice.effects[fader.dataset.effect]
    bindFader(fader, effect.wet.value, (value) =>
      effect.wet.rampTo(value, 0.05)
    )
  })

  // Канал: громкость и панорама (левее или правее)
  bindFader(
    voiceElement.querySelector('[data-volume]'),
    voice.channel.volume.value,
    (value) => voice.channel.volume.rampTo(value, 0.05)
  )
  bindFader(
    voiceElement.querySelector('[data-pan]'),
    voice.channel.pan.value,
    (value) => voice.channel.pan.rampTo(value, 0.05)
  )
}

function bindTopBar(master) {
  const transport = Tone.getTransport()
  const playButton = document.getElementById('playButton')

  playButton.addEventListener('click', async () => {
    await Tone.start()

    const isPlaying = playButton.getAttribute('aria-pressed') === 'true'
    if (isPlaying) transport.stop()
    else transport.start('+0.1')

    playButton.textContent = isPlaying ? 'Играть' : 'Стоп'
    playButton.setAttribute('aria-pressed', String(!isPlaying))

    // снимаем фокус, чтобы вокруг кнопки не было рамки, а пробел работал всегда
    playButton.blur()
  })

  bindFader(
    document.getElementById('tempoFader'),
    transport.bpm.value,
    (value) => transport.bpm.rampTo(value, 0.2)
  )
  bindFader(
    document.getElementById('masterFader'),
    master.volume.value,
    (value) => master.volume.rampTo(value, 0.05)
  )

  // Пробел = играть / стоп
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target === document.body) {
      event.preventDefault()
      playButton.click()
    }
  })

  // Ждём, пока загрузятся сэмплы барабанов
  Tone.loaded()
    .then(() => {
      playButton.disabled = false
      playButton.textContent = 'Играть'
    })
    .catch(showLoadingError)

  // Если сэмплы не загрузились за 8 секунд, скорее всего страницу
  // открыли двойным кликом, а не через сервер
  setTimeout(() => {
    if (playButton.disabled) showLoadingError()
  }, 8000)

  function showLoadingError() {
    playButton.textContent = 'Нужен сервер'
    playButton.title = 'Открой страницу через Live Server или GitHub Pages'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const master = createInstrument()

  document.querySelectorAll('.Voice').forEach(bindVoice)
  bindTopBar(master)
  startAura(document.getElementById('aura'), document.getElementById('grain'))
})
