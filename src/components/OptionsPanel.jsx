import React, { useRef } from 'react'

export default function OptionsPanel({
  options,
  newOption,
  onNewOptionChange,
  onAddOption,
  onUpdateOption,
  onUpdateWeight,
  onUpdateColor,
  onReorder,
  onRemoveOption,
  onClearAll,
  onExport,
  onImportChange,
}) {
  const fileInputRef = useRef(null)

  function triggerImport() {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const totalWeight = options.reduce((sum, o) => sum + (typeof o === 'string' ? 1 : (parseFloat(o.weight) || 1)), 0)

  return (
    <div className="card">
      <h2>Options</h2>
      <div className="input-group">
        <input
          value={newOption}
          onChange={(e) => onNewOptionChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddOption() }}
          placeholder="Add new option..."
        />
        <button className="btn btn-primary" onClick={onAddOption}>Add</button>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: 8 }}>Total weight: <strong>{totalWeight.toFixed(2)}</strong></p>

      <div className="options-list" id="optionsList">
        {options.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>No options yet. Add some above!</p>
        ) : (
          options.map((opt, i) => {
            const item = typeof opt === 'string' ? { label: opt, weight: 1 } : opt
            return (
            <div
              key={i}
              className="option-item"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData('text/plain')); if (!isNaN(from)) onReorder(from, i) }}
              title="Drag to reorder"
            >
              <span
                className="drag-handle"
                role="button"
                aria-label="Drag to reorder"
                draggable
                onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)) }}
              >≡</span>
              <input
                className="label-input"
                value={item.label}
                onChange={(e) => onUpdateOption(i, e.target.value)}
                draggable={false}
              />
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={item.weight}
                onChange={(e) => onUpdateWeight(i, e.target.value)}
                draggable={false}
              />
              <input
                type="number"
                min={0.0001}
                step={0.1}
                value={item.weight}
                onChange={(e) => onUpdateWeight(i, e.target.value)}
                title="Weight"
                draggable={false}
              />
              <input
                type="color"
                value={item.color || '#cccccc'}
                onChange={(e) => onUpdateColor(i, e.target.value)}
                title="Slice color"
                style={{ width: 40, height: 32, padding: 0, border: 'none', background: 'transparent' }}
                draggable={false}
              />
              <button className="btn btn-danger" onClick={() => onRemoveOption(i)}>Remove</button>
            </div>
          )})
        )}
      </div>

      <div className="button-group">
        <button
          className="btn btn-secondary"
          onClick={onClearAll}
        >
          Clear All
        </button>
        <button className="btn btn-secondary" onClick={onExport}>Export</button>
        <button className="btn btn-secondary" onClick={triggerImport}>Import</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={onImportChange}
        />
      </div>
    </div>
  )
}
