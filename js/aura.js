const waveColors = {
  sine: [244, 170, 196],
  triangle: [250, 196, 168],
  square: [206, 186, 238],
  sawtooth: [246, 140, 128]
}

const auraColors = {
  calm: [176, 192, 224],
  warm: [236, 190, 204],
  deep: [150, 126, 196],
  glow: [251, 232, 176],
  light: [255, 252, 242],
  mist: [222, 214, 236]
}

const auraState = {
  core: 0,
  halo: 0,
  pulse: 0,
  energy: 0,
  coreFlash: 0,
  kick: 0,
  kickTarget: 0,
  coreColor: [...waveColors.triangle],
  haloColor: [...waveColors.sine],
  coreTarget: waveColors.triangle,
  haloTarget: waveColors.sine,
  harshWave: 0,
  harshTarget: 0,
  // сколько каждого голоса «видно»: выключенный голос теряет свой цвет
  presence: { core: 1, halo: 1, pulse: 1 },
  // панорама каждого канала: -1 левее, 1 правее
  pan: { core: 0, halo: 0, pulse: 0 },
  effects: { reverb: 0, chorus: 0, echo: 0, distortion: 0, crusher: 0 }
}

// Размытые круги на фоне: где живёт каждый (доля экрана) и его размер
const bokehCircles = [
  { x: 0.08, y: 0.2, size: 0.16, seed: 1 },
  { x: 0.24, y: 0.84, size: 0.12, seed: 2 },
  { x: 0.4, y: 0.1, size: 0.09, seed: 3 },
  { x: 0.62, y: 0.9, size: 0.14, seed: 4 },
  { x: 0.78, y: 0.14, size: 0.11, seed: 5 },
  { x: 0.93, y: 0.6, size: 0.17, seed: 6 },
  { x: 0.14, y: 0.52, size: 0.1, seed: 7 },
  { x: 0.86, y: 0.38, size: 0.08, seed: 8 },
  { x: 0.56, y: 0.28, size: 0.07, seed: 9 },
  { x: 0.33, y: 0.64, size: 0.08, seed: 10 },
  { x: 0.7, y: 0.72, size: 0.09, seed: 11 },
  { x: 0.48, y: 0.96, size: 0.13, seed: 12 }
]

// Интерфейс сообщает ауре, какую форму волны выбрали
const harshWaves = { sine: 0, triangle: 0.2, square: 0.6, sawtooth: 1 }
const chosenWaves = { core: 'triangle', halo: 'sine' }

function setAuraWave(voiceName, waveType) {
  if (voiceName === 'core') auraState.coreTarget = waveColors[waveType]
  if (voiceName === 'halo') auraState.haloTarget = waveColors[waveType]

  // чем резче волны, тем «тяжелее» настроение фона
  chosenWaves[voiceName] = waveType
  auraState.harshTarget =
    (harshWaves[chosenWaves.core] + harshWaves[chosenWaves.halo]) / 2
}

// Аура слышит ноты: Ядро вспыхивает, Пульс толкает шар
listenToNotes((voiceName, note) => {
  if (voiceName === 'core') {
    auraState.coreFlash = Math.max(auraState.coreFlash, note.velocity)
  }
  if (
    voiceName === 'pulse' &&
    (note.noteName === 'C2' || note.noteName === 'D2')
  ) {
    auraState.kickTarget = Math.max(auraState.kickTarget, note.velocity)
  }
})

// ---------- помощники ----------

const clamp = (value) => Math.min(1, Math.max(0, value))
const ease = (current, target, speed) => current + (target - current) * speed
const mix = (a, b, t) => a.map((channel, i) => channel + (b[i] - channel) * t)
const rgba = (color, alpha) =>
  `rgba(${color.map(Math.round).join(', ')}, ${clamp(alpha)})`

function wet(voiceName, effectName) {
  return voices[voiceName].effects[effectName].wet.value
}

// ---------- 1. слушаем инструмент ----------
// Все значения меняются не скачком, а плавно подтягиваются

function listen() {
  const s = auraState

  s.core = ease(s.core, clamp(voices.core.meter.getValue() * 12), 0.08)
  s.halo = ease(s.halo, clamp(voices.halo.meter.getValue() * 7), 0.05)
  s.pulse = ease(s.pulse, clamp(voices.pulse.meter.getValue() * 6), 0.08)
  s.energy = ease(
    s.energy,
    clamp(s.core * 0.45 + s.halo * 0.55 + s.pulse * 0.45),
    0.03
  )

  // удар: быстро нарастает, медленно отпускает
  s.kick = ease(s.kick, s.kickTarget, 0.25)
  s.kickTarget *= 0.88
  s.coreFlash *= 0.93

  s.coreColor = mix(s.coreColor, s.coreTarget, 0.03)
  s.haloColor = mix(s.haloColor, s.haloTarget, 0.03)
  s.harshWave = ease(s.harshWave, s.harshTarget, 0.02)

  // выключенный голос плавно теряет цвет, панорама сдвигает его часть ауры
  Object.keys(s.presence).forEach((name) => {
    const channel = voices[name].channel
    s.presence[name] = ease(s.presence[name], channel.mute ? 0 : 1, 0.04)
    s.pan[name] = ease(s.pan[name], channel.pan.value, 0.08)
  })
  s.haloShown = mix(auraColors.mist, s.haloColor, s.presence.halo)
  s.coreShown = mix(auraColors.light, s.coreColor, s.presence.core)

  const fx = s.effects
  fx.reverb = ease(
    fx.reverb,
    (wet('core', 'reverb') + wet('halo', 'reverb') + wet('pulse', 'reverb')) /
      3,
    0.05
  )
  fx.chorus = ease(
    fx.chorus,
    Math.max(wet('core', 'chorus'), wet('halo', 'chorus')),
    0.05
  )
  fx.echo = ease(
    fx.echo,
    Math.max(wet('core', 'delay'), wet('pulse', 'delay')),
    0.05
  )
  fx.distortion = ease(fx.distortion, wet('halo', 'distortion'), 0.05)
  fx.crusher = ease(fx.crusher, wet('pulse', 'crusher'), 0.05)
}

// ---------- 2. рисуем ----------

// Мягкий эллипс с радиальным градиентом.
// Чуть разные радиусы по осям и медленный поворот = живая форма без углов.
function softOrb(ctx, x, y, radius, squash, angle, stops) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(1 + squash, 1 - squash)

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Фон: настроение музыки
//   тишина и спокойные узоры → прохладный голубой
//   много энергии            → тёплый розово-персиковый
//   резкий звук (искажение, крошка, пила) → глубокий фиолетовый
function drawSky(p, ctx, x, y, radius, time) {
  const s = auraState
  const harsh = clamp(
    s.effects.distortion * 1.2 + s.effects.crusher + s.harshWave * 0.5
  )

  let mood = mix(auraColors.calm, auraColors.warm, s.energy)
  mood = mix(mood, auraColors.deep, harsh * 0.7)
  mood = mix(mood, s.haloShown, 0.12)

  const sky = ctx.createLinearGradient(0, 0, 0, p.height)
  sky.addColorStop(0, rgba(mix(mood, auraColors.light, 0.12), 1))
  sky.addColorStop(1, rgba(mix(mood, s.coreShown, 0.2), 1))
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, p.width, p.height)

  const glow = ctx.createRadialGradient(
    x,
    y,
    radius * 0.6,
    x,
    y,
    radius * (2.6 + s.effects.reverb * 0.8)
  )
  glow.addColorStop(0, rgba(s.haloShown, 0.55 + s.energy * 0.35))
  glow.addColorStop(1, rgba(s.haloShown, 0))
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, p.width, p.height)

  drawBokeh(p, ctx, mood, time)
}

// Размытые круги: медленно плывут по фону, почти незаметные.
// Их цвет смешан из настроения и цветов голосов, поэтому меняется вместе с музыкой
function drawBokeh(p, ctx, mood, time) {
  const s = auraState
  const span = Math.max(p.width, p.height)
  const tints = [auraColors.light, s.haloShown, s.coreShown, auraColors.mist]
  const alpha = 0.3 + s.energy * 0.12 + s.kick * 0.06

  bokehCircles.forEach((circle, i) => {
    const drift = time * 0.12
    const x =
      (circle.x + (p.noise(circle.seed * 13, drift) - 0.5) * 0.14) * p.width
    const y =
      (circle.y + (p.noise(circle.seed * 13 + 40, drift) - 0.5) * 0.14) *
      p.height
    const radius = circle.size * span * 0.5
    const color = mix(
      mix(mood, tints[i % tints.length], 0.55),
      auraColors.light,
      0.4
    )

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, rgba(color, alpha))
    gradient.addColorStop(0.75, rgba(color, alpha * 0.9))
    gradient.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
}

// Тонкие кольца: дышат, на ударах расходятся, эхо добавляет колец
function drawRings(p, ctx, x, y, radius, time) {
  const s = auraState
  x += s.pan.pulse * radius * 0.3
  const count = 2 + Math.round(s.effects.echo * 2)

  for (let i = 0; i < count; i++) {
    const breath = Math.sin(time * 0.8 + i * 1.3) * 0.015
    const ringRadius =
      radius * (1.42 + i * 0.42 + s.kick * 0.06 * (i + 1) + breath)
    const squash = (p.noise(i * 7, time * 0.4) - 0.5) * 0.04

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(time * 0.05 * (i % 2 ? -1 : 1))
    ctx.scale(1 + squash, 1 - squash)
    ctx.strokeStyle = rgba(
      auraColors.light,
      (0.55 - i * 0.12) * (0.6 + s.energy * 0.4 + s.kick * 0.3)
    )
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

// Шар: несколько слоёв, чуть сдвинутых друг от друга, поэтому форма живая
function drawOrb(p, ctx, x, y, radius, time) {
  const s = auraState
  const coreX = x + s.pan.core * radius * 0.35
  x += s.pan.halo * radius * 0.2
  const fx = s.effects
  const wobble = 0.03 + fx.distortion * 0.08 + s.energy * 0.03
  const drift = radius * (0.03 + fx.distortion * 0.06)

  // мягкое свечение вокруг
  softOrb(ctx, x, y, radius * (1.35 + fx.reverb * 0.3), 0, 0, [
    [0, rgba(auraColors.glow, 0.35 + s.energy * 0.3)],
    [0.6, rgba(auraColors.glow, 0.25 + s.energy * 0.2)],
    [1, rgba(auraColors.glow, 0)]
  ])

  // тело шара: три слоя плавают вокруг центра
  for (let i = 0; i < 3; i++) {
    const angle = time * (0.3 + fx.chorus * 0.8) + i * 2.1
    const ox = Math.cos(angle) * drift * p.noise(i * 3, time)
    const oy = Math.sin(angle) * drift * p.noise(i * 3 + 9, time)
    const squash = (p.noise(i * 5 + 20, time * 0.7) - 0.5) * 2 * wobble

    softOrb(ctx, x + ox, y + oy, radius, squash, angle * 0.5, [
      [0, rgba(mix(s.coreShown, auraColors.light, 0.4), 0.45)],
      [0.45, rgba(mix(s.haloShown, s.coreShown, 0.3), 0.45)],
      [0.68, rgba(s.haloShown, 0.4)],
      [0.82, rgba(auraColors.glow, 0.5)],
      [0.92, rgba(mix(auraColors.glow, s.haloShown, 0.5), 0.25)],
      [1, rgba(s.haloShown, 0)]
    ])
  }

  // белая серединка: Ядро, вспыхивает на нотах
  const coreRadius = radius * (0.38 + s.core * 0.12 + s.coreFlash * 0.1)
  softOrb(ctx, coreX, y, coreRadius, 0, 0, [
    [0, rgba(auraColors.light, 0.85 + s.coreFlash * 0.15)],
    [0.5, rgba(auraColors.light, 0.55 + s.core * 0.3)],
    [1, rgba(auraColors.light, 0)]
  ])
}

// ---------- 3. запуск ----------

function startAura(container, grain) {
  new p5((p) => {
    let time = 0

    p.setup = () => {
      p.pixelDensity(1)
      p.createCanvas(window.innerWidth, window.innerHeight).parent(container)
    }

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight)
    }

    p.draw = () => {
      const ctx = p.drawingContext
      const s = auraState

      listen()
      time += 0.01 + s.effects.chorus * 0.01 + s.energy * 0.006

      const x = p.width / 2
      const y = p.height / 2
      const radius =
        Math.min(p.width, p.height) *
        (0.2 + s.energy * 0.1 + s.halo * 0.03) *
        (1 + s.kick * 0.05)

      drawSky(p, ctx, x, y, radius, time)
      drawRings(p, ctx, x, y, radius, time)
      drawOrb(p, ctx, x, y, radius, time)

      grain.style.opacity = String(0.18 + s.effects.crusher * 0.5)
    }
  })
}
