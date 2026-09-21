'use client'

import { useEffect, useState } from 'react'

type Screen = { title: string; file: string }

const screens: Screen[] = [
  { title: 'Portada', file: 'portada_agregador.png' },
  { title: 'Ingreso Extra', file: 'Ingreso Extra.png' },
  { title: 'Login — email', file: 'ml_login_email.png' },
  { title: 'Login — clave', file: 'ml_login_clave.png' },
  { title: 'Elegir país', file: 'Elegir pais.png' },
  { title: 'Bienvenida', file: 'Bienvenida.png' },
  { title: 'Bienvenida — estado 2', file: 'Bienvenida-1.png' },
  { title: 'Bienvenida — estado 3', file: 'Bienvenida-2.png' },
  { title: 'HUB', file: 'HUB.png' },
  { title: 'HUB', file: 'HUB.png' },
  { title: 'Datos del agregador', file: 'datos_agregador.png' },
  { title: 'Datos del agregador — estado 2', file: 'datos_agregador-1.png' },
  { title: 'Modalidad del agregador', file: 'modalidad_agregador.png' },
  { title: 'Modalidad del agregador — estado 2', file: 'modalidad_agregador-1.png' },
  { title: 'Operación y vehículo', file: 'operacion.png' },
  { title: 'Operación y vehículo — estado 2', file: 'operacion-1.png' },
  { title: 'Tipo de vehículo', file: 'tipo-vehiculo.png' },
  { title: 'Registro del vehículo', file: 'registro_vehiculo.png' },
  { title: 'Registro del vehículo — estado 2', file: 'registro_vehiculo-1.png' },
  { title: 'Registro del vehículo — estado 3', file: 'registro_vehiculo-2.png' },
  { title: 'Ubicación', file: 'ubicacion.png' },
  { title: 'Validación CNH', file: 'kyc.png' },
  { title: 'Preferencias SVC', file: 'preferencias.png' },
  { title: 'Tarifas', file: 'Tarifas.png' },
  { title: 'Tarifas — estado 2', file: 'Tarifas-1.png' },
  { title: 'Tarifas — estado 3', file: 'Tarifas-2.png' },
  { title: 'Registro transportistas', file: 'Registro transportistas.png' },
  { title: 'Registro transportistas — estado 2', file: 'Registro transportistas-1.png' },
  { title: 'Registro transportistas — estado 3', file: 'Registro transportistas-2.png' },
  { title: 'Registro transportistas — estado 4', file: 'Registro transportistas-3.png' },
  { title: 'Feedback Registro', file: 'Feedback Registro.png' },
]

export default function Home() {
  const [orderedScreens, setOrderedScreens] = useState(screens)
  const [selected, setSelected] = useState(0)
  const [menuOpen, setMenuOpen] = useState(true)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [storageReady, setStorageReady] = useState(false)
  const current = orderedScreens[selected]
  const storageKey = 'me-extra-menu-state'

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem('me-extra-menu-order')
    if (saved) {
      try {
        const savedScreens = JSON.parse(saved) as Screen[]
        const hasValidFiles = Array.isArray(savedScreens) && savedScreens.length === screens.length && savedScreens.every((screen) => typeof screen.file === 'string' && screens.some((original) => original.file === screen.file))
        const hasEveryScreenOnce = hasValidFiles && screens.every((original) => savedScreens.some((screen) => screen.file === original.file))
        if (hasEveryScreenOnce) setOrderedScreens(savedScreens.map((screen) => ({ file: screen.file, title: typeof screen.title === 'string' && screen.title.trim() ? screen.title : screens.find((original) => original.file === screen.file)!.title })))
      } catch {
        window.localStorage.removeItem(storageKey)
        window.localStorage.removeItem('me-extra-menu-order')
      }
    }
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (storageReady) window.localStorage.setItem(storageKey, JSON.stringify(orderedScreens))
  }, [orderedScreens, storageReady])

  function persistScreens(nextScreens: Screen[]) {
    setOrderedScreens(nextScreens)
    window.localStorage.setItem(storageKey, JSON.stringify(nextScreens))
  }
  function startEditing(index: number) { setEditingIndex(index); setDraftTitle(orderedScreens[index].title) }
  function saveTitle() {
    if (editingIndex === null) return
    const title = draftTitle.trim()
    if (title) persistScreens(orderedScreens.map((item, index) => index === editingIndex ? { ...item, title } : item))
    setEditingIndex(null)
  }
  function moveScreen(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const nextItems = [...orderedScreens]
    const [moved] = nextItems.splice(fromIndex, 1)
    nextItems.splice(toIndex, 0, moved)
    persistScreens(nextItems)
    setSelected((value) => value === fromIndex ? toIndex : fromIndex < value && toIndex >= value ? value - 1 : fromIndex > value && toIndex <= value ? value + 1 : value)
  }
  const previous = () => setSelected((value) => Math.max(0, value - 1))
  const next = () => setSelected((value) => Math.min(orderedScreens.length - 1, value + 1))

  return <main className="experience-shell">
    <header className="experience-header">
      <button className="menu-button" aria-label={menuOpen ? 'Ocultar menu' : 'Mostrar menu'} onClick={() => setMenuOpen((value) => !value)}><span /><span /><span /></button>
      <div><p className="eyebrow">ME.EXTRA APP · FLOTILLEROS</p><h1>Visão completa da experiência</h1></div>
      <span className="counter">{selected + 1} / {orderedScreens.length}</span>
    </header>
    <div className="experience-body">
      <aside className={`flow-menu ${menuOpen ? '' : 'closed'}`} aria-label="Navegação das telas">
        <div className="menu-heading"><span>Ordem do PDF</span><span>{orderedScreens.length} telas</span></div>
        <nav>{orderedScreens.map((screen, index) => <div key={`${screen.file}-${index}`} className={`flow-item ${index === selected ? 'selected' : ''} ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`} onClick={() => editingIndex !== index && setSelected(index)} draggable role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(index) }} onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; setDraggedIndex(index) }} onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null) }} onDragOver={(event) => { event.preventDefault(); if (draggedIndex !== index) setDragOverIndex(index) }} onDragLeave={() => setDragOverIndex(null)} onDrop={(event) => { event.preventDefault(); if (draggedIndex !== null) moveScreen(draggedIndex, index); setDraggedIndex(null); setDragOverIndex(null) }} aria-label={`${screen.title}. Arraste para reordenar`}>
          <span className="drag-handle" aria-hidden="true">⋮⋮</span><span className="flow-index">{String(index + 1).padStart(2, '0')}</span>
          {editingIndex === index ? <input className="flow-name-input" value={draftTitle} autoFocus aria-label="Nome da tela" onChange={(event) => setDraftTitle(event.target.value)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { event.stopPropagation(); if (event.key === 'Enter') saveTitle(); if (event.key === 'Escape') setEditingIndex(null) }} onBlur={saveTitle} /> : <span className="flow-name">{screen.title}</span>}
          <button type="button" className="edit-name-button" aria-label={`Editar nome de ${screen.title}`} onClick={(event) => { event.stopPropagation(); startEditing(index) }}>Editar</button>
        </div>)}</nav>
      </aside>
      <section className="screen-stage" aria-live="polite"><div className="stage-toolbar"><div><span className="stage-dot" /> <strong>{current.title}</strong></div><div className="stage-actions"><button onClick={previous} disabled={selected === 0}>Anterior</button><button onClick={next} disabled={selected === orderedScreens.length - 1}>Próxima</button></div></div><div className="screen-frame"><img src={`/pdf/${encodeURIComponent(current.file)}`} alt={`Tela ${selected + 1}: ${current.title}`} /></div></section>
    </div>
  </main>
}
