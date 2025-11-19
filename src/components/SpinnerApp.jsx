import React, { useEffect, useRef, useState } from 'react'
import '../index.css'
import OptionsPanel from './OptionsPanel'

export default function SpinnerApp() {
  const canvasRef = useRef(null)
  const [options, setOptions] = useState([])
  const [newOption, setNewOption] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const rotationRef = useRef(0)
  const rafRef = useRef(null)
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
  ]
  const [settings, setSettings] = useState({ soundEnabled: true, confettiEnabled: true, spinDuration: 3, equalSizeSlices: false })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Load options from localStorage
    const stored = localStorage.getItem('spinnerOptions')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Migrate legacy array of strings to objects with weight 1
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          setOptions(parsed.map((s, i) => ({ label: s, weight: 1, color: colors[i % colors.length] })))
        } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          setOptions(parsed.map((o, i) => ({ label: o.label ?? String(o), weight: parseFloat(o.weight) || 1, color: o.color || colors[i % colors.length] })))
        } else {
          setOptions([
            { label: 'Option 1', weight: 1, color: colors[0] },
            { label: 'Option 2', weight: 1, color: colors[1] },
            { label: 'Option 3', weight: 1, color: colors[2] },
            { label: 'Option 4', weight: 1, color: colors[3] }
          ])
        }
      } catch (e) {
        setOptions([
          { label: 'Option 1', weight: 1, color: colors[0] },
          { label: 'Option 2', weight: 1, color: colors[1] },
          { label: 'Option 3', weight: 1, color: colors[2] },
          { label: 'Option 4', weight: 1, color: colors[3] }
        ])
      }
    } else {
      setOptions([
        { label: 'Option 1', weight: 1, color: colors[0] },
        { label: 'Option 2', weight: 1, color: colors[1] },
        { label: 'Option 3', weight: 1, color: colors[2] },
        { label: 'Option 4', weight: 1, color: colors[3] }
      ])
    }

    const s = localStorage.getItem('spinnerSettings')
    if (s) {
      try { setSettings(prev => ({...prev, ...JSON.parse(s)})) } catch (e) {}
    }
    // Respect prefers-reduced-motion
    try {
      const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
      const handler = (e) => setReducedMotion(e.matches)
      if (mq) {
        setReducedMotion(mq.matches)
        if (mq.addEventListener) mq.addEventListener('change', handler)
        else mq.addListener(handler)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    drawWheel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, settings])

  function saveOptions(newOpts) {
    setOptions(newOpts)
    // persist normalized objects {label, weight, color}
    const toSave = newOpts.map((o, i) => {
      if (typeof o === 'string') return { label: o, weight: 1, color: colors[i % colors.length] }
      return {
        label: o.label,
        weight: Math.max(0.0001, parseFloat(o.weight) || 1),
        color: o.color || colors[i % colors.length]
      }
    })
    localStorage.setItem('spinnerOptions', JSON.stringify(toSave))
  }

  function addOption() {
    if (!newOption.trim()) return
    const next = [...options, { label: newOption.trim(), weight: 1, color: colors[options.length % colors.length] }]
    setNewOption('')
    saveOptions(next)
  }

  function removeOption(i) {
    const next = options.filter((_, idx) => idx !== i)
    saveOptions(next)
  }

  function updateOption(i, val) {
    const next = options.slice()
    const prev = next[i]
    next[i] = typeof prev === 'string' ? { label: val, weight: 1 } : { ...prev, label: val }
    saveOptions(next)
  }

  function updateWeight(i, val) {
    const next = options.slice()
    const prev = next[i]
    const numeric = Math.max(0.0001, parseFloat(val) || 1)
    next[i] = typeof prev === 'string' ? { label: prev, weight: numeric, color: colors[i % colors.length] } : { ...prev, weight: numeric }
    saveOptions(next)
  }

  function updateColor(i, hex) {
    const next = options.slice()
    const prev = next[i]
    const color = /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex) ? hex : (prev.color || colors[i % colors.length])
    next[i] = typeof prev === 'string' ? { label: prev, weight: 1, color } : { ...prev, color }
    saveOptions(next)
  }

  function moveOption(from, to) {
    if (from === to || from < 0 || to < 0 || from >= options.length || to >= options.length) return
    const next = options.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    saveOptions(next)
  }

  function drawWheel() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0,0,canvas.width,canvas.height)

    if (options.length === 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2*Math.PI)
      ctx.fillStyle = '#1e293b'
      ctx.fill()
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Add options to start', centerX, centerY)
      return
    }

    // Segments (weighted widths or equal widths depending on setting)
    const normalized = options.map((o, i) => (typeof o === 'string' ? { label: o, weight: 1, color: colors[i % colors.length] } : { label: o.label, weight: Math.max(0.0001, parseFloat(o.weight) || 1), color: o.color || colors[i % colors.length] }))
    const totalWeight = normalized.reduce((s, o) => s + o.weight, 0)
    let acc = 0
    const useEqual = !!settings.equalSizeSlices

    normalized.forEach((option, index) => {
      const anglePer = useEqual ? ((2*Math.PI) / normalized.length) : ((2*Math.PI) * (option.weight / totalWeight))
      const start = rotationRef.current + acc
      const end = start + anglePer
      acc += anglePer

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, start, end)
      ctx.closePath()
  ctx.fillStyle = option.color || colors[index % colors.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(start + anglePer/2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px Arial'
      let displayText = option.label
      if (displayText.length > 20) displayText = displayText.substring(0,17)+'...'
      ctx.fillText(displayText, radius - 20, 0)
      ctx.restore()
    })

    // center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, 2*Math.PI)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 4
    ctx.stroke()
  }

  function weightedRandomIndex(weights) {
    const sum = weights.reduce((s, w) => s + Math.max(0, w), 0)
    if (sum <= 0) return Math.floor(Math.random() * weights.length)
    let r = Math.random() * sum
    for (let i = 0; i < weights.length; i++) {
      r -= Math.max(0, weights[i])
      if (r <= 0) return i
    }
    return weights.length - 1
  }

  function spin() {
    if (isSpinning || options.length === 0) return
    const normalized = options.map((o, i) => (typeof o === 'string' ? { label: o, weight: 1, color: colors[i % colors.length] } : { label: o.label, weight: Math.max(0.0001, parseFloat(o.weight) || 1), color: o.color || colors[i % colors.length] }))
    const useEqual = !!settings.equalSizeSlices

    // Helper to compute target delta so the pointer lands on the center of a specific equal segment
    const computeDeltaToEqualSegment = (startRotation, index, n) => {
      const angle = 2*Math.PI / n
      // pick a random spot near the center (40%-60%) to avoid dead-center every time
      const within = 0.4 + Math.random()*0.2
      const posTarget = index*angle + angle*within
      const desiredMod = ((3*Math.PI/2) - posTarget) % (2*Math.PI)
      const desiredModNorm = (desiredMod + 2*Math.PI) % (2*Math.PI)
      return (baseSpins) => {
        const base = startRotation + baseSpins*2*Math.PI
        const rem = ((base % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI)
        let target = base - rem + desiredModNorm
        if (target <= base) target += 2*Math.PI
        return target - startRotation
      }
    }

    // Reduced motion path: jump instantly to the selected result
    if (reducedMotion) {
      setIsSpinning(true)
      if (useEqual) {
        const idx = weightedRandomIndex(normalized.map(o => o.weight))
        const startRotation = rotationRef.current
        const deltaFn = computeDeltaToEqualSegment(startRotation, idx, normalized.length)
        const totalDelta = deltaFn(0) // no extra spins when reduced motion
        rotationRef.current = startRotation + totalDelta
        drawWheel()
        finishSpin()
        return
      } else {
        // legacy behavior: random landing based on weighted angles
        const minSpins = 0
        const maxSpins = 0
        const spins = minSpins + Math.random()*(maxSpins-minSpins)
        const totalRotation = spins*2*Math.PI + Math.random()*2*Math.PI
        const startRotation = rotationRef.current
        rotationRef.current = startRotation + totalRotation
        drawWheel()
        finishSpin()
        return
      }
    }

    setIsSpinning(true)
    const minSpins = 5
    const maxSpins = 8
    const spins = minSpins + Math.random()*(maxSpins-minSpins)
    const duration = settings.spinDuration * 1000
    const startTime = performance.now()
    const startRotation = rotationRef.current

    let totalRotation
    if (useEqual) {
      const idx = weightedRandomIndex(normalized.map(o => o.weight))
      const deltaFn = computeDeltaToEqualSegment(startRotation, idx, normalized.length)
      totalRotation = deltaFn(spins)
    } else {
      totalRotation = spins*2*Math.PI + Math.random()*2*Math.PI
    }

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed/duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      rotationRef.current = startRotation + totalRotation * easeOut
      drawWheel()
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else finishSpin()
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  function finishSpin() {
    rotationRef.current = rotationRef.current % (2*Math.PI)
    const normalized = options.map((o, i) => (typeof o === 'string' ? { label: o, weight: 1, color: colors[i % colors.length] } : { label: o.label, weight: Math.max(0.0001, parseFloat(o.weight) || 1), color: o.color || colors[i % colors.length] }))
    const adjusted = (rotationRef.current + Math.PI/2) % (2*Math.PI)
    const pos = (2*Math.PI - adjusted) % (2*Math.PI)
    let winnerIndex = 0
    if (settings.equalSizeSlices) {
      const angle = 2*Math.PI / normalized.length
      winnerIndex = Math.min(normalized.length - 1, Math.floor(pos / angle))
    } else {
      const totalWeight = normalized.reduce((s, o) => s + o.weight, 0)
      const segments = []
      let acc = 0
      for (const o of normalized) {
        const ang = (2*Math.PI) * (o.weight / totalWeight)
        segments.push({ start: acc, end: acc + ang })
        acc += ang
      }
      for (let i=0;i<segments.length;i++) {
        const seg = segments[i]
        if (pos >= seg.start && pos < seg.end) { winnerIndex = i; break }
      }
    }
    const winner = normalized[winnerIndex].label

    const result = document.getElementById('resultDisplay')
    if (result) {
      result.textContent = `🎉 Winner: ${winner}`
      result.classList.add('winner')
    }

    if (settings.confettiEnabled) showConfetti()
    if (settings.soundEnabled) playSound()

    setIsSpinning(false)
  }

  function showConfetti() {
    if (reducedMotion) return
    const confettiEmojis = ['🎉','🎊','✨','🎈','🎆','🎇']
    const container = document.querySelector('.container')
    for (let i=0;i<20;i++){
      const confetti = document.createElement('div')
      confetti.textContent = confettiEmojis[Math.floor(Math.random()*confettiEmojis.length)]
      confetti.style.position = 'fixed'
      confetti.style.left = Math.random()*100 + '%'
      confetti.style.top = '-50px'
      confetti.style.fontSize = '2rem'
      confetti.style.zIndex = '1000'
      confetti.style.pointerEvents = 'none'
      confetti.style.animation = `fall ${2 + Math.random()*2}s linear`
      container.appendChild(confetti)
      setTimeout(()=>confetti.remove(),4000)
    }
    // Ensure the fall keyframes exist (was dynamically injected in the original app)
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style')
      style.id = 'confetti-style'
      style.textContent = `@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`
      document.head.appendChild(style)
    }
  }

  function playSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.connect(gain); gain.connect(audioContext.destination)
      oscillator.frequency.value = 800; oscillator.type = 'sine'
      gain.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) { console.log('Sound not available', e) }
  }

  function exportData() {
    // persist normalized objects
  const normalized = options.map((o, i) => (typeof o === 'string' ? { label: o, weight: 1, color: colors[i % colors.length] } : { label: o.label, weight: Math.max(0.0001, parseFloat(o.weight) || 1), color: o.color || colors[i % colors.length] }))
  const data = { options: normalized, settings, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `spinner-config-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result)
        if (obj.options) {
          let incoming = obj.options
          if (Array.isArray(incoming) && incoming.length && typeof incoming[0] === 'string') {
            incoming = incoming.map((s, i) => ({ label: s, weight: 1, color: colors[i % colors.length] }))
          } else if (Array.isArray(incoming) && incoming.length && typeof incoming[0] === 'object') {
            incoming = incoming.map((o, i) => ({ label: o.label ?? String(o), weight: Math.max(0.0001, parseFloat(o.weight) || 1), color: o.color || colors[i % colors.length] }))
          }
          saveOptions(incoming)
        }
        if (obj.settings) { setSettings(obj.settings); localStorage.setItem('spinnerSettings', JSON.stringify(obj.settings)) }
      } catch (err) { console.error('Invalid import file', err) }
    }
    reader.readAsText(file)
  }

  useEffect(()=>{
    // cleanup on unmount
    return ()=>{ if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  },[])

  return (
    <>
      <section className="spinner-section">
        <div className="spinner-container">
          <canvas id="spinnerCanvas" ref={canvasRef} width={500} height={500}></canvas>
          <div className="spinner-center">
            <button id="spinButton" className="spin-btn" onClick={spin} disabled={isSpinning}>SPIN</button>
          </div>
          <div className="spinner-pointer"></div>
        </div>
        <div id="resultDisplay" className="result-display"></div>
      </section>

      <section className="control-panel">
        <OptionsPanel
          options={options}
          newOption={newOption}
          onNewOptionChange={setNewOption}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onUpdateWeight={updateWeight}
          onUpdateColor={updateColor}
          onReorder={moveOption}
          onRemoveOption={removeOption}
          onClearAll={() => { if (confirm('Are you sure?')) { saveOptions([]); const el = document.getElementById('resultDisplay'); if (el) el.textContent = '' } }}
          onExport={exportData}
          onImportChange={importData}
        />

        <div className="card">
          <h2>Settings</h2>
          <div className="settings-group">
            <label><input type="checkbox" checked={settings.soundEnabled} onChange={e=>{ setSettings(s=>{ const ns = {...s, soundEnabled: e.target.checked}; localStorage.setItem('spinnerSettings', JSON.stringify(ns)); return ns }) }} /> Enable Sound Effects</label>
            <label><input type="checkbox" checked={settings.confettiEnabled} onChange={e=>{ setSettings(s=>{ const ns={...s, confettiEnabled: e.target.checked}; localStorage.setItem('spinnerSettings', JSON.stringify(ns)); return ns }) }} /> Show Confetti</label>
            <label>Spin Duration (seconds): <input type="number" value={settings.spinDuration} min={1} max={10} onChange={e=>{ const v = parseInt(e.target.value)||1; setSettings(s=>{ const ns = {...s, spinDuration: v}; localStorage.setItem('spinnerSettings', JSON.stringify(ns)); return ns }) }} /></label>
            <label><input type="checkbox" checked={!!settings.equalSizeSlices} onChange={e=>{ setSettings(s=>{ const ns={...s, equalSizeSlices: e.target.checked}; localStorage.setItem('spinnerSettings', JSON.stringify(ns)); return ns }) }} /> Equal-size slices (probability-only)</label>
          </div>
        </div>

        <div className="card future-features">
          <h2>Coming Soon</h2>
          <p>🗺️ Map integration with CesiumJS</p>
          <p>☁️ Cloud sync with backend</p>
        </div>
      </section>
    </>
  )
}
