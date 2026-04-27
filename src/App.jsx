import { useState } from 'react'
import Section from './components/Section'
import { calendar, champions, currentDrivers, historyMilestones, news } from './components/data'

const navItems = [
  ['accueil', 'Accueil'],
  ['histoire', 'Histoire'],
  ['pilotes', 'Pilotes'],
  ['champions', 'Champions'],
  ['actualites', 'Actualités'],
  ['live', 'Live GP'],
  ['calendrier', 'Calendrier'],
]

const liveFeed = [
  { lap: 1, text: '🚦 Feux rouges éteints — DÉPART !', event: true },
  { lap: 4, text: 'Norris prend la tête devant Piastri au virage 1.', event: false },
  { lap: 8, text: 'Verstappen remonte de la 4e à la 2e place.', event: false },
  { lap: 12, text: '🟡 DRAPEAU JAUNE — débris signalés virage 7.', event: true },
  { lap: 18, text: 'Pit stop éclair pour Leclerc — 2.4s, pneus mediums.', event: false },
  { lap: 24, text: '🚗 SAFETY CAR déployée — incident en fond de grille.', event: true },
  { lap: 28, text: "Reprise de course ! Norris leader avec 1.2s d'avance.", event: false },
  { lap: 33, text: 'DRS activé — Hamilton attaque Alonso pour la 5e place.', event: false },
  { lap: 40, text: 'Tour rapide de Piastri — 1:27.891 🔴', event: false },
  { lap: 51, text: 'Verstappen aux stands en urgence — crevaison lente.', event: true },
  { lap: 57, text: '🏁 DRAPEAU À DAMIER — Norris remporte le GP de Miami !', event: true },
]

const circuitSVGs = {
  "GP d'Australie": "M50,80 L80,40 L120,35 L160,50 L180,80 L170,120 L140,140 L100,145 L60,130 L40,100 Z",
  "GP de Chine": "M40,60 L100,30 L160,50 L180,100 L160,150 L100,170 L50,150 L30,110 Z",
  "GP du Japon": "M60,40 L120,30 L170,60 L180,120 L150,160 L90,170 L40,140 L30,80 Z",
  "GP de Miami": "M50,50 L150,40 L180,80 L170,140 L120,160 L60,150 L30,110 L40,70 Z",
  "GP du Canada": "M40,70 L90,30 L160,40 L180,90 L160,150 L100,170 L50,150 L25,100 Z",
  "GP de Monaco": "M70,30 L140,35 L170,70 L160,130 L120,160 L70,155 L40,120 L35,70 Z",
  "GP d'Espagne": "M45,65 L110,25 L165,55 L175,115 L145,155 L85,165 L40,135 L30,85 Z",
  "GP d'Autriche": "M55,45 L130,30 L170,75 L165,140 L120,165 L65,155 L30,110 L35,65 Z",
  "GP de Grande-Bretagne": "M45,55 L120,25 L170,65 L175,130 L135,165 L70,160 L30,120 L30,75 Z",
  "GP de Belgique": "M40,60 L100,25 L165,55 L180,115 L150,160 L85,170 L35,140 L25,85 Z",
  "GP des Pays-Bas": "M55,50 L125,30 L170,70 L170,135 L125,165 L60,160 L25,120 L30,70 Z",
  "GP d'Italie": "M45,50 L125,25 L175,65 L180,130 L140,165 L70,165 L25,125 L25,70 Z",
  "GP d'Azerbaïdjan": "M50,45 L140,30 L175,75 L170,145 L115,170 L55,155 L25,105 L35,60 Z",
  "GP de Singapour": "M55,40 L145,35 L175,80 L165,150 L105,170 L50,150 L25,100 L35,55 Z",
  "GP des États-Unis": "M40,65 L110,25 L170,60 L180,125 L145,160 L75,165 L30,130 L25,80 Z",
  "GP du Mexique": "M45,60 L115,25 L170,60 L178,125 L140,160 L75,165 L30,130 L28,80 Z",
  "GP du Brésil": "M50,55 L120,25 L170,65 L175,130 L135,165 L70,160 L28,120 L30,70 Z",
  "GP de Madrid": "M48,58 L118,28 L168,68 L173,133 L133,163 L68,158 L28,118 L30,68 Z",
  "GP de Las Vegas": "M50,50 L150,35 L180,85 L170,145 L115,165 L55,150 L25,100 L35,60 Z",
  "GP du Qatar": "M55,45 L135,30 L175,75 L168,145 L110,168 L52,150 L22,100 L32,58 Z",
  "GP d'Abu Dhabi": "M52,48 L138,32 L178,78 L170,148 L112,168 L54,152 L22,102 L34,58 Z",
}

function F1Car() {
  return (
    <div className="relative w-full overflow-hidden" style={{height: '120px'}}>
      <style>{`
        @keyframes carRace {
          0% { transform: translateX(-300px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes exhaustFlame {
          0%, 100% { opacity: 0.9; transform: scaleX(1); }
          50% { opacity: 0.5; transform: scaleX(0.7); }
        }
        .car-moving { animation: carRace 5s linear infinite; }
        .wheel-front-left { transform-origin: 58px 78px; animation: wheelSpin 0.25s linear infinite; }
        .wheel-front-right { transform-origin: 58px 30px; animation: wheelSpin 0.25s linear infinite; }
        .wheel-rear-left { transform-origin: 172px 82px; animation: wheelSpin 0.25s linear infinite; }
        .wheel-rear-right { transform-origin: 172px 26px; animation: wheelSpin 0.25s linear infinite; }
        .exhaust { animation: exhaustFlame 0.15s linear infinite; }
      `}</style>

      {/* Speed lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-20">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{animationDelay: `${i * 0.2}s`}} />
        ))}
      </div>

      <div className="car-moving absolute" style={{top: '10px'}}>
        <svg width="260" height="100" viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg">
          
          {/* Exhaust flames */}
          <g className="exhaust">
            <ellipse cx="14" cy="54" rx="12" ry="4" fill="#FF6B00" opacity="0.9"/>
            <ellipse cx="8" cy="54" rx="7" ry="3" fill="#FFB800" opacity="0.8"/>
            <ellipse cx="4" cy="54" rx="4" ry="2" fill="#FFF" opacity="0.6"/>
          </g>

          {/* Main body - lower */}
          <path d="M25 58 L55 48 L80 44 L140 42 L185 44 L215 50 L230 58 L225 68 L185 72 L80 72 L40 68 Z" fill="#CC0000"/>
          
          {/* Main body - upper sidepods */}
          <path d="M60 48 L80 38 L140 36 L185 38 L210 44 L215 50 L185 44 L80 44 Z" fill="#E10600"/>
          
          {/* Cockpit surround */}
          <path d="M95 44 L100 28 L130 24 L155 26 L162 36 L155 40 L105 42 Z" fill="#111"/>
          
          {/* Cockpit interior */}
          <path d="M100 40 L103 30 L128 26 L152 28 L158 36 L152 38 L105 40 Z" fill="#1a1a1a"/>
          
          {/* Halo */}
          <path d="M100 34 Q128 20 158 32" fill="none" stroke="#888" strokeWidth="4" strokeLinecap="round"/>
          <path d="M128 20 L128 34" fill="none" stroke="#888" strokeWidth="3"/>
          
          {/* Front wing */}
          <path d="M215 54 L250 50 L255 56 L252 64 L215 62 Z" fill="#CC0000"/>
          <path d="M240 50 L255 46 L258 52 L252 56 L240 52 Z" fill="#E10600"/>
          <path d="M240 62 L255 64 L258 70 L252 66 L240 66 Z" fill="#E10600"/>
          <rect x="214" y="55" width="2" height="8" fill="#111"/>
          
          {/* Rear wing */}
          <path d="M22 38 L30 35 L35 42 L35 66 L30 72 L22 68 Z" fill="#CC0000"/>
          <rect x="18" y="34" width="12" height="4" rx="1" fill="#E10600"/>
          <rect x="18" y="66" width="12" height="4" rx="1" fill="#E10600"/>
          <rect x="22" y="38" width="2" height="28" fill="#111"/>
          
          {/* Floor/diffuser */}
          <path d="M35 68 L215 68 L220 72 L225 72 L40 74 Z" fill="#990000"/>
          
          {/* Bargeboard details */}
          <rect x="165" y="46" width="1.5" height="20" fill="#880000"/>
          <rect x="170" y="46" width="1.5" height="20" fill="#880000"/>
          
          {/* Number plate */}
          <rect x="108" y="44" width="30" height="12" rx="2" fill="#fff" opacity="0.9"/>
          <text x="123" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#E10600">F1</text>

          {/* Rear wheel left */}
          <g className="wheel-rear-left">
            <circle cx="172" cy="82" r="18" fill="#111"/>
            <circle cx="172" cy="82" r="15" fill="#222"/>
            <circle cx="172" cy="82" r="8" fill="#333"/>
            <line x1="172" y1="64" x2="172" y2="100" stroke="#555" strokeWidth="2"/>
            <line x1="154" y1="82" x2="190" y2="82" stroke="#555" strokeWidth="2"/>
            <line x1="159" y1="69" x2="185" y2="95" stroke="#555" strokeWidth="1.5"/>
            <line x1="185" y1="69" x2="159" y2="95" stroke="#555" strokeWidth="1.5"/>
          </g>

          {/* Rear wheel right */}
          <g className="wheel-rear-right">
            <circle cx="172" cy="26" r="18" fill="#111"/>
            <circle cx="172" cy="26" r="15" fill="#222"/>
            <circle cx="172" cy="26" r="8" fill="#333"/>
            <line x1="172" y1="8" x2="172" y2="44" stroke="#555" strokeWidth="2"/>
            <line x1="154" y1="26" x2="190" y2="26" stroke="#555" strokeWidth="2"/>
            <line x1="159" y1="13" x2="185" y2="39" stroke="#555" strokeWidth="1.5"/>
            <line x1="185" y1="13" x2="159" y2="39" stroke="#555" strokeWidth="1.5"/>
          </g>

          {/* Front wheel left */}
          <g className="wheel-front-left">
            <circle cx="58" cy="78" r="15" fill="#111"/>
            <circle cx="58" cy="78" r="12" fill="#222"/>
            <circle cx="58" cy="78" r="6" fill="#333"/>
            <line x1="58" y1="63" x2="58" y2="93" stroke="#555" strokeWidth="2"/>
            <line x1="43" y1="78" x2="73" y2="78" stroke="#555" strokeWidth="2"/>
            <line x1="47" y1="67" x2="69" y2="89" stroke="#555" strokeWidth="1.5"/>
            <line x1="69" y1="67" x2="47" y2="89" stroke="#555" strokeWidth="1.5"/>
          </g>

          {/* Front wheel right */}
          <g className="wheel-front-right">
            <circle cx="58" cy="30" r="15" fill="#111"/>
            <circle cx="58" cy="30" r="12" fill="#222"/>
            <circle cx="58" cy="30" r="6" fill="#333"/>
            <line x1="58" y1="15" x2="58" y2="45" stroke="#555" strokeWidth="2"/>
            <line x1="43" y1="30" x2="73" y2="30" stroke="#555" strokeWidth="2"/>
            <line x1="47" y1="19" x2="69" y2="41" stroke="#555" strokeWidth="1.5"/>
            <line x1="69" y1="19" x2="47" y2="41" stroke="#555" strokeWidth="1.5"/>
          </g>

          {/* Front suspension */}
          <line x1="73" y1="30" x2="90" y2="36" stroke="#555" strokeWidth="2"/>
          <line x1="73" y1="78" x2="90" y2="70" stroke="#555" strokeWidth="2"/>
          
          {/* Rear suspension */}
          <line x1="154" y1="26" x2="140" y2="36" stroke="#555" strokeWidth="2"/>
          <line x1="154" y1="82" x2="140" y2="70" stroke="#555" strokeWidth="2"/>

          {/* Mirror left */}
          <rect x="130" y="32" width="14" height="6" rx="2" fill="#333"/>
          {/* Mirror right */}
          <rect x="108" y="32" width="14" height="6" rx="2" fill="#333"/>

          {/* Engine cover details */}
          <path d="M95 42 L95 36 L162 34 L162 40" fill="none" stroke="#880000" strokeWidth="1"/>
          
          {/* Sponsor stripes */}
          <rect x="85" y="60" width="40" height="3" fill="#fff" opacity="0.15"/>
          <rect x="135" y="60" width="40" height="3" fill="#fff" opacity="0.15"/>
        </svg>
      </div>
    </div>
  )
}

function DriverCard({ driver, onClick }) {
  const teamColors = {
    'McLaren': '#FF8000',
    'Ferrari': '#E10600',
    'Red Bull Racing': '#3671C6',
    'Mercedes': '#00D2BE',
    'Williams': '#005AFF',
    'Racing Bulls': '#6692FF',
    'Aston Martin': '#358C75',
    'Alpine': '#FF87BC',
    'Haas': '#B6BABD',
    'Audi': '#C9002B',
    'Cadillac': '#333333',
  }
  const color = teamColors[driver.team] || '#E10600'

  return (
    <article
      onClick={() => onClick(driver)}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-200 cursor-pointer overflow-hidden"
      style={{'--team-color': color}}
    >
      <div className="h-1" style={{background: color}} />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img
              src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/${driver.name.split(' ')[1]?.toLowerCase() || driver.name.toLowerCase()}`}
              alt={driver.name}
              className="w-14 h-14 rounded-full object-cover border-2 object-top"
              style={{borderColor: color}}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=${color.replace('#','')}&color=fff&size=56&bold=true&font-size=0.4`
              }}
            />
            <div className="absolute -bottom-1 -right-1 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center leading-none text-center" style={{background: color, fontSize: '9px'}}>
              {driver.num}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white leading-tight truncate">{driver.name}</h3>
            <p className="text-xs text-zinc-500 truncate">{driver.country}</p>
            {driver.titles > 0 && <p className="text-xs font-bold" style={{color}}>🏆 {driver.titles}× Champion</p>}
          </div>
        </div>
        <p className="text-xs text-zinc-400 bg-zinc-800/50 rounded-lg px-3 py-1.5 truncate">{driver.team}</p>
        <p className="text-xs text-zinc-600 mt-2 text-center">→ Cliquer pour la biographie</p>
      </div>
    </article>
  )
}

function DriverModal({ driver, onClose }) {
  if (!driver) return null
  const teamColors = {
    'McLaren': '#FF8000', 'Ferrari': '#E10600', 'Red Bull Racing': '#3671C6',
    'Mercedes': '#00D2BE', 'Williams': '#005AFF', 'Racing Bulls': '#6692FF',
    'Aston Martin': '#358C75', 'Alpine': '#FF87BC', 'Haas': '#B6BABD',
    'Audi': '#C9002B', 'Cadillac': '#333333',
  }
  const color = teamColors[driver.team] || '#E10600'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="h-2" style={{background: color}} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <img
              src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/${driver.name.split(' ')[1]?.toLowerCase() || driver.name.toLowerCase()}`}
              alt={driver.name}
              className="w-24 h-24 rounded-2xl object-cover object-top border-2"
              style={{borderColor: color}}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=${color.replace('#','')}&color=fff&size=96&bold=true&font-size=0.35`
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-black" style={{color}}>#{driver.num}</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{driver.name}</h2>
              <p className="text-sm font-semibold mt-1" style={{color}}>{driver.team}</p>
              <p className="text-xs text-zinc-500">{driver.country} · Né en {driver.born}</p>
              {driver.titles > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 text-white text-xs px-3 py-1 rounded-full font-bold" style={{background: color}}>
                  🏆 {driver.titles} titre{driver.titles > 1 ? 's' : ''} mondial{driver.titles > 1 ? 'aux' : ''}
                </div>
              )}
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl leading-none flex-shrink-0">✕</button>
          </div>
          <div className="border-t border-zinc-800 pt-4 mb-4">
            <p className="text-sm text-zinc-300 leading-relaxed">{driver.bio}</p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Carrière</p>
            <div className="flex flex-col gap-2">
              {driver.teams.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background: color}} />
                  <span className="text-xs text-zinc-300">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CircuitMap({ gp, status }) {
  const path = circuitSVGs[gp]
  const color = status === 'Terminé' ? '#555' : status === 'Prochain' ? '#E10600' : '#888'
  if (!path) return null
  return (
    <svg viewBox="0 0 210 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="210" height="200" fill="#0f0f0f"/>
      {/* Fond circuit */}
      <path d={path} fill="none" stroke="#1a1a1a" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Circuit */}
      <path d={path} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={status === 'À venir' ? '8 4' : 'none'} opacity={status === 'Terminé' ? 0.5 : 1}/>
      {/* Ligne de départ */}
      {status !== 'Terminé' && <circle cx="50" cy="80" r="4" fill={color} opacity="0.9"/>}
    </svg>
  )
}

export default function App() {
  const [activeNav, setActiveNav] = useState('accueil')
  const [liveOn, setLiveOn] = useState(false)
  const [liveIndex, setLiveIndex] = useState(0)
  const [lap, setLap] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [liveInterval, setLiveInterval] = useState(null)

  const startLive = () => {
    setLiveIndex(0)
    setLap(0)
    setLiveOn(true)
    const interval = setInterval(() => {
      setLiveIndex(prev => {
        if (prev >= liveFeed.length - 1) { clearInterval(interval); setLiveOn(false); return prev }
        return prev + 1
      })
      setLap(prev => Math.min(prev + 2, 57))
    }, 2200)
    setLiveInterval(interval)
  }

  const stopLive = () => { clearInterval(liveInterval); setLiveOn(false) }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {selectedDriver && <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />}

      <header className="sticky top-0 z-40 border-b-2 border-raceRed bg-black/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#accueil" className="text-xl font-black tracking-widest text-raceRed uppercase">F1<span className="text-white">Hub</span></a>
          <ul className="hidden gap-1 md:flex">
            {navItems.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setActiveNav(id)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${activeNav === id ? 'text-white border-b-2 border-raceRed rounded-none' : 'text-zinc-400 hover:text-white'}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button className="md:hidden text-zinc-300" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/> : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>}
            </svg>
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 px-4 pb-4">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => { setActiveNav(id); setMenuOpen(false) }}
                className="block py-2 text-sm text-zinc-300 hover:text-raceRed">{label}</a>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 md:px-8">

        <Section id="accueil" title="">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-14 mb-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.25),transparent_60%)]" />
            <div className="relative mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-raceRed">Saison 2026</p>
              <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">La <span className="text-raceRed">Formule 1</span><br />à portée de main</h1>
              <p className="mb-8 max-w-xl text-zinc-400">Résultats, pilotes, histoire, live GP et calendrier — tout en un.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#live" className="rounded-xl bg-raceRed px-6 py-3 text-sm font-bold text-white hover:bg-red-700 uppercase tracking-wider transition-colors">Suivre le Live GP</a>
                <a href="#calendrier" className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-zinc-400 uppercase tracking-wider transition-colors">Calendrier 2026</a>
              </div>
            </div>
            <F1Car />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Prochain GP', value: 'Miami', sub: '3 Mai 2026' },
              { label: 'Champion 2025', value: 'L. Norris', sub: 'McLaren' },
              { label: 'Constructeurs 2025', value: 'McLaren', sub: 'Titre consécutif' },
              { label: 'Vainqueur Chine', value: 'K. Antonelli', sub: 'Mercedes' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-zinc-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="histoire" title="Histoire de la F1">
          <div className="relative border-l-2 border-zinc-800 pl-6 space-y-6">
            {historyMilestones.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[1.45rem] top-5 h-3 w-3 rounded-full bg-raceRed ring-4 ring-zinc-950" />
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-raceRed/40 transition-colors">
                  <p className="text-sm font-black text-raceRed mb-1">{item.year}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="pilotes" title="Pilotes 2026 — Cliquez pour la biographie">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentDrivers.map((driver) => (
              <DriverCard key={driver.num} driver={driver} onClick={setSelectedDriver} />
            ))}
          </div>
        </Section>

        <Section id="champions" title="Champions du monde">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Année</th>
                  <th className="px-5 py-4">Champion</th>
                  <th className="px-5 py-4">Équipe</th>
                </tr>
              </thead>
              <tbody>
                {champions.map((item, i) => (
                  <tr key={item.year} className={`border-t border-zinc-800 hover:bg-zinc-900/70 ${i === 0 ? 'bg-raceRed/5' : ''}`}>
                    <td className="px-5 py-3 font-bold text-raceRed">{item.year}</td>
                    <td className="px-5 py-3 font-semibold text-white">{i === 0 ? '🏆 ' : ''}{item.champion}</td>
                    <td className="px-5 py-3 text-zinc-400">{item.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="actualites" title="Actualités">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article key={item.title} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-raceRed/40 transition-all cursor-pointer">
                <span className="rounded-full bg-raceRed/15 px-3 py-0.5 text-xs font-bold text-raceRed uppercase tracking-wider">{item.category}</span>
                <h3 className="mt-3 mb-2 font-bold text-white leading-snug group-hover:text-raceRed transition-colors">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.snippet}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="live" title="Live GP">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-lg font-black text-white">GP de Miami 2026</p>
                <p className="text-xs text-zinc-500">Miami International Autodrome · 57 tours</p>
              </div>
              <div className="flex items-center gap-4">
                {liveOn && (
                  <div className="flex items-center gap-2 rounded-full bg-raceRed/15 px-3 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-raceRed animate-pulse" />
                    <span className="text-xs font-bold text-raceRed uppercase">En direct</span>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-3xl font-black text-raceRed">{lap}</p>
                  <p className="text-xs text-zinc-500">/ 57 tours</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mb-5">
              <button onClick={startLive} disabled={liveOn}
                className="rounded-xl bg-raceRed px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40 uppercase tracking-wider">
                {liveOn ? 'En cours...' : 'Lancer le live'}
              </button>
              {liveOn && (
                <button onClick={stopLive} className="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-400">
                  Arrêter
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {liveIndex === 0 && !liveOn ? (
                <p className="text-center text-sm text-zinc-600 py-8">Appuyez sur "Lancer le live" pour démarrer</p>
              ) : (
                liveFeed.slice(0, liveIndex + 1).reverse().map((msg, idx) => (
                  <div key={idx} className={`rounded-xl px-4 py-2.5 text-sm border ${msg.event ? 'border-raceRed/30 bg-raceRed/5 text-white' : 'border-zinc-800 bg-black/30 text-zinc-300'}`}>
                    <span className="text-zinc-600 text-xs mr-2">Tour {msg.lap}</span>{msg.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        <Section id="calendrier" title="Calendrier 2026 — 22 Grands Prix">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendar.map((race, i) => (
              <article key={race.gp} className={`rounded-2xl border overflow-hidden transition-all ${race.status === 'Prochain' ? 'border-raceRed shadow-lg shadow-red-900/20' : race.status === 'Terminé' ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-600'}`}>
                <div className="relative bg-zinc-950" style={{height: '140px'}}>
                  <CircuitMap gp={race.gp} status={race.status} />
                  <div className="absolute top-2 left-2 bg-black/70 text-zinc-400 text-xs px-2 py-0.5 rounded-full">R{i + 1}</div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${race.status === 'Prochain' ? 'bg-raceRed text-white' : race.status === 'Terminé' ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {race.status}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/80">
                  <h3 className="font-bold text-white text-sm">{race.gp}</h3>
                  <p className="text-xs text-zinc-500">{race.circuit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-zinc-400">{race.location}</p>
                    <p className="text-xs font-semibold text-zinc-300">{new Date(race.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
        F1Hub 2026 · Construit avec React + Tailwind · Données vérifiées
      </footer>
    </div>
  )
}
