// ---------- ЯДРО · арпеджио четвертями ----------

const coreSequenceI = [
  { time: '0:0:0', noteName: 'F4', duration: '4n', velocity: 0.8 },
  { time: '0:1:0', noteName: 'A4', duration: '4n', velocity: 0.6 },
  { time: '0:2:0', noteName: 'C5', duration: '4n', velocity: 0.7 },
  { time: '0:3:0', noteName: 'E5', duration: '4n', velocity: 0.6 },

  { time: '1:0:0', noteName: 'E4', duration: '4n', velocity: 0.8 },
  { time: '1:1:0', noteName: 'G4', duration: '4n', velocity: 0.6 },
  { time: '1:2:0', noteName: 'B4', duration: '4n', velocity: 0.7 },
  { time: '1:3:0', noteName: 'D5', duration: '4n', velocity: 0.6 },

  { time: '2:0:0', noteName: 'D4', duration: '4n', velocity: 0.8 },
  { time: '2:1:0', noteName: 'F4', duration: '4n', velocity: 0.6 },
  { time: '2:2:0', noteName: 'A4', duration: '4n', velocity: 0.7 },
  { time: '2:3:0', noteName: 'C5', duration: '4n', velocity: 0.6 },

  { time: '3:0:0', noteName: 'C4', duration: '4n', velocity: 0.8 },
  { time: '3:1:0', noteName: 'E4', duration: '4n', velocity: 0.6 },
  { time: '3:2:0', noteName: 'G4', duration: '4n', velocity: 0.7 },
  { time: '3:3:0', noteName: 'B4', duration: '4n', velocity: 0.6 }
]

// ---------- ЯДРО · переливы восьмыми ----------

const coreSequenceII = [
  { time: '0:0:0', noteName: 'F5', duration: '8n', velocity: 0.9 },
  { time: '0:0:2', noteName: 'C5', duration: '8n', velocity: 0.5 },
  { time: '0:1:0', noteName: 'A4', duration: '8n', velocity: 0.6 },
  { time: '0:1:2', noteName: 'C5', duration: '8n', velocity: 0.5 },
  { time: '0:2:0', noteName: 'E5', duration: '8n', velocity: 0.8 },
  { time: '0:2:2', noteName: 'C5', duration: '8n', velocity: 0.5 },
  { time: '0:3:0', noteName: 'A4', duration: '8n', velocity: 0.6 },
  { time: '0:3:2', noteName: 'C5', duration: '8n', velocity: 0.5 },

  { time: '1:0:0', noteName: 'E5', duration: '8n', velocity: 0.9 },
  { time: '1:0:2', noteName: 'B4', duration: '8n', velocity: 0.5 },
  { time: '1:1:0', noteName: 'G4', duration: '8n', velocity: 0.6 },
  { time: '1:1:2', noteName: 'B4', duration: '8n', velocity: 0.5 },
  { time: '1:2:0', noteName: 'D5', duration: '8n', velocity: 0.8 },
  { time: '1:2:2', noteName: 'B4', duration: '8n', velocity: 0.5 },
  { time: '1:3:0', noteName: 'G4', duration: '8n', velocity: 0.6 },
  { time: '1:3:2', noteName: 'B4', duration: '8n', velocity: 0.5 },

  { time: '2:0:0', noteName: 'D5', duration: '8n', velocity: 0.9 },
  { time: '2:0:2', noteName: 'A4', duration: '8n', velocity: 0.5 },
  { time: '2:1:0', noteName: 'F4', duration: '8n', velocity: 0.6 },
  { time: '2:1:2', noteName: 'A4', duration: '8n', velocity: 0.5 },
  { time: '2:2:0', noteName: 'C5', duration: '8n', velocity: 0.8 },
  { time: '2:2:2', noteName: 'A4', duration: '8n', velocity: 0.5 },
  { time: '2:3:0', noteName: 'F4', duration: '8n', velocity: 0.6 },
  { time: '2:3:2', noteName: 'A4', duration: '8n', velocity: 0.5 },

  { time: '3:0:0', noteName: 'C5', duration: '8n', velocity: 0.9 },
  { time: '3:0:2', noteName: 'G4', duration: '8n', velocity: 0.5 },
  { time: '3:1:0', noteName: 'E4', duration: '8n', velocity: 0.6 },
  { time: '3:1:2', noteName: 'G4', duration: '8n', velocity: 0.5 },
  { time: '3:2:0', noteName: 'B4', duration: '8n', velocity: 0.8 },
  { time: '3:2:2', noteName: 'G4', duration: '8n', velocity: 0.5 },
  { time: '3:3:0', noteName: 'E4', duration: '8n', velocity: 0.6 },
  { time: '3:3:2', noteName: 'G4', duration: '8n', velocity: 0.5 }
]

// ---------- ОРЕОЛ · долгие ноты, по одной на такт ----------

const haloSequenceI = [
  { time: '0:0:0', noteName: 'F2', duration: '1m', velocity: 0.8 },
  { time: '1:0:0', noteName: 'E2', duration: '1m', velocity: 0.8 },
  { time: '2:0:0', noteName: 'D2', duration: '1m', velocity: 0.8 },
  { time: '3:0:0', noteName: 'C2', duration: '1m', velocity: 0.8 }
]

// ---------- ОРЕОЛ · пульсирующий бас ----------

const haloSequenceII = [
  { time: '0:0:0', noteName: 'F2', duration: '8n', velocity: 1 },
  { time: '0:0:2', noteName: 'F2', duration: '8n', velocity: 0.6 },
  { time: '0:1:2', noteName: 'F3', duration: '8n', velocity: 0.7 },
  { time: '0:2:0', noteName: 'F2', duration: '8n', velocity: 1 },
  { time: '0:2:2', noteName: 'F2', duration: '8n', velocity: 0.6 },
  { time: '0:3:2', noteName: 'C3', duration: '8n', velocity: 0.7 },

  { time: '1:0:0', noteName: 'E2', duration: '8n', velocity: 1 },
  { time: '1:0:2', noteName: 'E2', duration: '8n', velocity: 0.6 },
  { time: '1:1:2', noteName: 'E3', duration: '8n', velocity: 0.7 },
  { time: '1:2:0', noteName: 'E2', duration: '8n', velocity: 1 },
  { time: '1:2:2', noteName: 'E2', duration: '8n', velocity: 0.6 },
  { time: '1:3:2', noteName: 'B2', duration: '8n', velocity: 0.7 },

  { time: '2:0:0', noteName: 'D2', duration: '8n', velocity: 1 },
  { time: '2:0:2', noteName: 'D2', duration: '8n', velocity: 0.6 },
  { time: '2:1:2', noteName: 'D3', duration: '8n', velocity: 0.7 },
  { time: '2:2:0', noteName: 'D2', duration: '8n', velocity: 1 },
  { time: '2:2:2', noteName: 'D2', duration: '8n', velocity: 0.6 },
  { time: '2:3:2', noteName: 'A2', duration: '8n', velocity: 0.7 },

  { time: '3:0:0', noteName: 'C2', duration: '8n', velocity: 1 },
  { time: '3:0:2', noteName: 'C2', duration: '8n', velocity: 0.6 },
  { time: '3:1:2', noteName: 'C3', duration: '8n', velocity: 0.7 },
  { time: '3:2:0', noteName: 'C2', duration: '8n', velocity: 1 },
  { time: '3:2:2', noteName: 'C2', duration: '8n', velocity: 0.6 },
  { time: '3:3:2', noteName: 'G2', duration: '8n', velocity: 0.7 }
]

// ---------- ПУЛЬС · мягкий шаг, 1 такт по кругу ----------
// C2 бочка · D2 малый · E2 закрытый хэт · F2 открытый хэт · G2 римшот

const pulseSequenceI = [
  { time: '0:0:0', noteName: 'C2', duration: '2n', velocity: 0.9 },
  { time: '0:2:0', noteName: 'C2', duration: '2n', velocity: 0.8 },
  { time: '0:1:2', noteName: 'G2', duration: '8n', velocity: 0.35 },
  { time: '0:3:2', noteName: 'G2', duration: '8n', velocity: 0.35 }
]

// ---------- ПУЛЬС · полный бит ----------

const pulseSequenceII = [
  { time: '0:0:0', noteName: 'C2', duration: '2n', velocity: 1 },
  { time: '0:2:0', noteName: 'C2', duration: '2n', velocity: 1 },
  { time: '0:2:3', noteName: 'C2', duration: '2n', velocity: 0.5 },

  { time: '0:1:0', noteName: 'D2', duration: '2n', velocity: 0.8 },
  { time: '0:3:0', noteName: 'D2', duration: '2n', velocity: 0.8 },

  { time: '0:0:2', noteName: 'E2', duration: '8n', velocity: 0.35 },
  { time: '0:1:2', noteName: 'E2', duration: '8n', velocity: 0.35 },
  { time: '0:2:2', noteName: 'E2', duration: '8n', velocity: 0.35 },
  { time: '0:3:2', noteName: 'F2', duration: '8n', velocity: 0.45 }
]
