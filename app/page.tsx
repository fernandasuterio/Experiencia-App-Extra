'use client'

import { useState } from 'react'

const blue = '#3483fa'

type Screen = 'login' | 'country' | 'welcome' | 'tariffs' | 'transportistas' | 'tariff-detail' | 'feedback'

function Back({ onClick }: { onClick: () => void }) {
  return <button className="back" onClick={onClick} aria-label="Voltar"><span>‹</span></button>
}

function Button({ children, disabled = false, onClick }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void }) {
  return <button className={`primary-button ${disabled ? 'disabled' : ''}`} disabled={disabled} onClick={onClick}>{children}</button>
}

function Login({ onNext }: { onNext: () => void }) {
  return <div className="screen login-screen">
    <Back onClick={() => {}} />
    <div className="login-content">
      <h1>Olá! Digite o seu telefone, e-mail ou usuário</h1>
      <label htmlFor="login">Digite seu e-mail, telefone ou usuário</label>
      <input id="login" autoFocus />
      <Button onClick={onNext}>Continuar</Button>
      <button className="link">Criar conta</button>
      <button className="link help">Preciso de ajuda para entrar</button>
      <p className="recaptcha">Protegido por reCAPTCHA. <a>Privacidade</a> - <a>Condições</a></p>
    </div>
  </div>
}

function Country({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [country, setCountry] = useState('Brasil')
  return <div className="screen country-screen">
    <div className="yellow-status" />
    <Back onClick={onBack} />
    <main>
      <h1>Olá, ¿en qué país estás?</h1>
      <div className="country-list">{['Chile', 'México', 'Brasil'].map(item => <label key={item} className="radio-row"><input type="radio" checked={country === item} onChange={() => setCountry(item)} /> <span>{item}</span></label>)}</div>
      <Button onClick={onNext}>Continuar</Button>
    </main>
  </div>
}

const items = [
  ['Identidad', '{Nombre}'], ['Ubicación', '{Estado, Ciudad}'], ['Documentación personal', 'Validada.'], ['Documentación vehicular', 'Validada.'], ['Preferencias', 'Indica cómo harás los recorridos.'], ['Condición de tarifas', 'Revisá y aceptá las tarifas de tus centros.'], ['Transportistas', 'Agrega a las personas que harán los recorridos.'],
]
function Welcome({ onTariffs, onTransport, onBack }: { onTariffs: () => void; onTransport: () => void; onBack: () => void }) {
  return <div className="screen welcome-screen"><div className="yellow-status" /><Back onClick={onBack} /><main><h1>Completa tu registro</h1><p className="intro">Sigue estos pasos para comenzar a hacer recorridos.</p><div className="checklist">{items.map(([title, desc], index) => <button key={title} className={`check-item ${index === 4 ? 'active' : ''}`} onClick={index === 5 ? onTariffs : index === 6 ? onTransport : undefined}><span className={`item-icon ${index < 4 ? 'done' : ''}`}>{index < 4 ? '✓' : '○'}</span><span className="item-copy"><strong>{title}</strong><small>{desc}</small></span>{index === 4 && <span className="complete">Completar</span>}</button>)}</div><button className="link account">No soy {'{'}rodrigo.marin@mail.com{'}'}</button></main></div>
}

function Tariffs({ onDetail, onBack }: { onDetail: () => void; onBack: () => void }) {
  return <div className="screen tariffs-screen"><Header title="Condición de tarifas" onBack={onBack} /><main><h1>Tus centros de distribución</h1><p className="large-intro">Cada centro tiene sus propias tarifas.<br />Revisalas y acéptalas para comenzar a recibir rutas.</p><div className="tariff-list">{[['SCF2 - CABA', 'VUC'], ['SCF3 - Zona Norte', 'VAN']].map(([name, type]) => <button className="tariff-row" key={name} onClick={onDetail}><span><strong>{name}</strong><small>{type}</small></span><em>PENDIENTE</em><b>›</b></button>)}</div><Button disabled>Continuar</Button></main></div>
}

function Transportistas({ onBack }: { onBack: () => void }) { return <div className="screen transport-screen"><Header title="Transportistas" onBack={onBack} /><main><h1>Agrega a tus transportistas</h1><p>Habilita a todos los que realizarán recorridos.<br />Si tu también los harás, debes agregarte.</p><button className="soft-button">Agregar transportista</button><button className="link add-self">Agregarme como transportista</button><div className="email-row">juliana.cruz@gmail.com</div><Button disabled>Continuar</Button></main></div> }
function Detail({ onBack }: { onBack: () => void }) { return <div className="screen"><Header title="Detalles de tarifas" onBack={onBack} /><main className="detail"><h1>SCF2 - CABA</h1><p>Revisá las tarifas para comenzar a recibir rutas.</p><div className="empty-detail" /><Button>Continuar</Button></main></div> }
function Feedback({ onBack }: { onBack: () => void }) { return <div className="screen"><Header title="Registro" onBack={onBack} /><main className="feedback"><h1>¡Listo!</h1><p>Tu registro fue enviado correctamente.</p></main></div> }
function Header({ title, onBack }: { title: string; onBack: () => void }) { return <><div className="yellow-status" /><header><Back onClick={onBack} /><span>{title}</span></header></> }

export default function Page() {
  const [screen, setScreen] = useState<Screen>('login')
  return <div className="phone-shell">{screen === 'login' && <Login onNext={() => setScreen('country')} />}{screen === 'country' && <Country onNext={() => setScreen('welcome')} onBack={() => setScreen('login')} />}{screen === 'welcome' && <Welcome onTariffs={() => setScreen('tariffs')} onTransport={() => setScreen('transportistas')} onBack={() => setScreen('country')} />}{screen === 'tariffs' && <Tariffs onDetail={() => setScreen('tariff-detail')} onBack={() => setScreen('welcome')} />}{screen === 'transportistas' && <Transportistas onBack={() => setScreen('welcome')} />}{screen === 'tariff-detail' && <Detail onBack={() => setScreen('tariffs')} />}{screen === 'feedback' && <Feedback onBack={() => setScreen('welcome')} />}</div>
}

export { blue }
