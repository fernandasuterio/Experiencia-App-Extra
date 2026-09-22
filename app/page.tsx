'use client'

import { useEffect, useState } from 'react'

type Screen = { id?: string; title: string; file: string }

const screens: Screen[] = [
  { id: 'portada', title: 'Portada', file: 'portada_agregador.png' },
  { title: 'Ingreso Extra', file: 'Ingreso Extra.png' },
  { title: 'Login — email', file: 'ml_login_email.png' },
  { title: 'Login — clave', file: 'ml_login_clave.png' },
  { title: 'Passo 5', file: 'passo-5.svg' },
  { title: 'Passo 8', file: 'passo-8.svg' },
  { title: 'Elegir país', file: 'Elegir pais.png' },
  { title: 'Bienvenida', file: 'Bienvenida.png' },
  { title: 'Bienvenida — estado 2', file: 'Bienvenida-2.png' },
  { title: 'Passo 9', file: 'passo-9.svg' },
  { title: 'HUB - Entrada', file: 'hub-intermedio.svg' },
  { title: 'HUB', file: 'HUB.png' },
  { title: 'Datos del agregador', file: 'datos_agregador.png' },
  { title: 'Modalidad del agregador', file: 'modalidad_agregador.png' },
  { title: 'Modalidad del agregador — estado 2', file: 'modalidad_agregador-1.png' },
  { title: 'Operación y vehículo', file: 'operacion.png' },
  { title: 'Operación y vehículo — estado 2', file: 'operacion-1.png' },
  { title: 'Tipo de vehículo', file: 'tipo-vehiculo.png' },
  { title: 'Registro del vehículo', file: 'registro_vehiculo.png' },
  { title: 'Registro del vehículo — estado 2', file: 'registro_vehiculo-1.png' },
  { title: 'Registro del vehículo — estado 3', file: 'registro_vehiculo-2.png' },
  { title: 'Ubicación', file: 'ubicacion.png' },
  { title: 'HUB - Ubicacion', file: 'hub-ubicacion.svg' },
  { title: 'Validación CNH', file: 'kyc.png' },
  { title: 'HUB - Identidad', file: 'hub-identidad.svg' },
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
  const storageKey = 'me-extra-menu-state'
  const [orderedScreens, setOrderedScreens] = useState<Screen[]>(screens)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem('me-extra-menu-order')
    if (saved) {
      try {
        const savedScreens = JSON.parse(saved) as Screen[]
        if (Array.isArray(savedScreens)) {
          const restoredScreens = savedScreens.flatMap((savedScreen) => {
            const original = screens.find((screen) => screen.file === savedScreen.file)
            if (!original) return []
            return [{ ...original, title: typeof savedScreen.title === 'string' && savedScreen.title.trim() ? savedScreen.title : original.title }]
          })
          const missingScreens = screens.filter((screen) => !restoredScreens.some((savedScreen) => savedScreen.file === screen.file))
          const restoredWithMissing = [...restoredScreens]
          missingScreens.forEach((screen) => {
            const canonicalIndex = screens.findIndex((item) => item.file === screen.file)
            const nextCanonicalScreen = screens.slice(canonicalIndex + 1).find((item) => restoredWithMissing.some((savedScreen) => savedScreen.file === item.file))
            const insertAt = nextCanonicalScreen ? restoredWithMissing.findIndex((item) => item.file === nextCanonicalScreen.file) : restoredWithMissing.length
            restoredWithMissing.splice(insertAt, 0, screen)
          })
          if (restoredWithMissing.length > 0) setOrderedScreens(restoredWithMissing)
        }
      } catch {
        window.localStorage.removeItem(storageKey)
        window.localStorage.removeItem('me-extra-menu-order')
      }
    } else {
      const initialState = JSON.stringify(screens)
      window.localStorage.setItem(storageKey, initialState)
      window.localStorage.setItem('me-extra-menu-order', initialState)
    }
    setHydrated(true)
  }, [])
  const [selected, setSelected] = useState(0)
  const [menuOpen, setMenuOpen] = useState(true)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const current = orderedScreens[selected]

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  function updateScreens(nextScreens: Screen[]) {
    setOrderedScreens(nextScreens)
    setHasUnsavedChanges(true)
  }

  function saveProject() {
    window.localStorage.setItem(storageKey, JSON.stringify(orderedScreens))
    window.localStorage.setItem('me-extra-menu-order', JSON.stringify(orderedScreens))
    setHasUnsavedChanges(false)
  }
  function startEditing(index: number) { setEditingIndex(index); setDraftTitle(orderedScreens[index].title) }
  function deleteScreen(index: number) {
    const screen = orderedScreens[index]
    if (!window.confirm(`Excluir a tela “${screen.title}”?`)) return
    const nextItems = orderedScreens.filter((_, itemIndex) => itemIndex !== index)
    updateScreens(nextItems)
    setSelected((value) => value > index ? value - 1 : Math.min(value, nextItems.length - 1))
    if (editingIndex === index) setEditingIndex(null)
  }
  function saveTitle() {
    if (editingIndex === null) return
    const title = draftTitle.trim()
    if (title) updateScreens(orderedScreens.map((item, index) => index === editingIndex ? { ...item, title } : item))
    setEditingIndex(null)
  }
  function moveScreen(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const nextItems = [...orderedScreens]
    const [moved] = nextItems.splice(fromIndex, 1)
    nextItems.splice(toIndex, 0, moved)
    updateScreens(nextItems)
    setSelected((value) => value === fromIndex ? toIndex : fromIndex < value && toIndex >= value ? value - 1 : fromIndex > value && toIndex <= value ? value + 1 : value)
  }
  const previous = () => setSelected((value) => Math.max(0, value - 1))
  const next = () => setSelected((value) => Math.min(orderedScreens.length - 1, value + 1))

  if (!hydrated) return <main className="experience-shell loading-state">Carregando projeto salvo…</main>

  return <main className="experience-shell">
    <header className="experience-header">
      <button className="menu-button" aria-label={menuOpen ? 'Ocultar menu' : 'Mostrar menu'} onClick={() => setMenuOpen((value) => !value)}><span /><span /><span /></button>
      <div><p className="eyebrow">ME.EXTRA APP · FLOTILLEROS</p><h1>Visão completa da experiência</h1></div>
      <div className="header-actions">
        <span className={`save-status ${hasUnsavedChanges ? 'pending' : 'saved'}`} aria-live="polite">{hasUnsavedChanges ? 'Alterações não salvas' : 'Projeto salvo'}</span>
        <button className="save-project-button" type="button" onClick={saveProject}>Salvar projeto</button>
        <span className="counter">{selected + 1} / {orderedScreens.length}</span>
      </div>
    </header>
    <div className="experience-body">
      <aside className={`flow-menu ${menuOpen ? '' : 'closed'}`} aria-label="Navegação das telas">
        <div className="menu-heading"><span>Ordem do PDF</span><span>{orderedScreens.length} telas</span></div>
        <nav>{orderedScreens.map((screen, index) => <div key={`${screen.file}-${index}`} className={`flow-item ${index === selected ? 'selected' : ''} ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`} onClick={() => editingIndex !== index && setSelected(index)} draggable role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(index) }} onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; setDraggedIndex(index) }} onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null) }} onDragOver={(event) => { event.preventDefault(); if (draggedIndex !== index) setDragOverIndex(index) }} onDragLeave={() => setDragOverIndex(null)} onDrop={(event) => { event.preventDefault(); if (draggedIndex !== null) moveScreen(draggedIndex, index); setDraggedIndex(null); setDragOverIndex(null) }} aria-label={`${screen.title}. Arraste para reordenar`}>
          <span className="drag-handle" aria-hidden="true">⋮⋮</span><span className="flow-index">{String(index + 1).padStart(2, '0')}</span>
          {editingIndex === index ? <input className="flow-name-input" value={draftTitle} autoFocus aria-label="Nome da tela" onChange={(event) => setDraftTitle(event.target.value)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { event.stopPropagation(); if (event.key === 'Enter') saveTitle(); if (event.key === 'Escape') setEditingIndex(null) }} onBlur={saveTitle} /> : <span className="flow-name">{screen.title}</span>}
          <button type="button" className="edit-name-button" aria-label={`Editar nome de ${screen.title}`} onClick={(event) => { event.stopPropagation(); startEditing(index) }}>Editar</button><button type="button" className="delete-screen-button" aria-label={`Excluir ${screen.title}`} onClick={(event) => { event.stopPropagation(); deleteScreen(index) }}>Excluir</button>
        </div>)}</nav>
      </aside>
      <section className="screen-stage" aria-live="polite"><div className="stage-toolbar"><div><span className="stage-dot" /> <strong>{current.title}</strong></div><div className="stage-actions"><button onClick={previous} disabled={selected === 0}>Anterior</button><button onClick={next} disabled={selected === orderedScreens.length - 1}>Próxima</button></div></div><div className="screen-frame"><img src={`/pdf/${encodeURIComponent(current.file)}`} alt={`Tela ${selected + 1}: ${current.title}`} /></div></section>
    </div>
  </main>
}
