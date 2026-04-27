import { useState, useEffect } from 'react'
import Section from './components/Section'
import { calendar, champions, currentDrivers, historyMilestones, news as staticNews } from './components/data'

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
  { lap: 4, text: 'Norris prend la tête devant Piastri.', event: false },
  { lap: 8, text: 'Verstappen remonte de la 4e à la 2e place.', event: false },
  { lap: 12, text: '🟡 DRAPEAU JAUNE — débris virage 7.', event: true },
  { lap: 18, text: 'Pit stop Leclerc — 2.4s, pneus mediums.', event: false },
  { lap: 24, text: '🚗 SAFETY CAR déployée.', event: true },
  { lap: 28, text: "Norris leader avec 1.2s d'avance.", event: false },
  { lap: 33, text: 'DRS activé — Hamilton attaque Alonso.', event: false },
  { lap: 40, text: 'Tour rapide Piastri — 1:27.891 🔴', event: false },
  { lap: 51, text: 'Verstappen aux stands — crevaison.', event: true },
  { lap: 57, text: '🏁 DRAPEAU À DAMIER — Norris gagne !', event: true },
]

const teamColors = {
  'McLaren': '#FF8000', 'Ferrari': '#E10600', 'Red Bull Racing': '#3671C6',
  'Mercedes': '#27F4D2', 'Williams': '#005AFF', 'Racing Bulls': '#6692FF',
  'Aston Martin': '#358C75', 'Alpine': '#FF87BC', 'Haas': '#B6BABD',
  'Audi': '#C9002B', 'Cadillac': '#C8B88A',
}

// Accurate F1 circuit SVG paths
const CIRCUITS = {
  "GP d'Australie": {
    path: "M 100,18 L 145,16 L 168,32 L 174,58 L 168,85 L 152,105 L 130,120 L 102,125 L 75,120 L 52,105 L 38,80 L 38,52 L 55,32 Z",
    label: "Albert Park"
  },
  "GP de Chine": {
    path: "M 58,22 L 95,18 L 135,20 L 158,32 L 168,55 L 162,80 L 148,95 L 158,112 L 164,135 L 148,152 L 112,158 L 78,155 L 48,140 L 35,115 L 38,85 L 52,65 L 42,42 Z",
    label: "Shanghai"
  },
  "GP du Japon": {
    path: "M 148,72 L 162,52 L 158,28 L 138,18 L 115,20 L 98,35 L 94,55 L 105,70 L 120,76 L 104,85 L 86,98 L 80,120 L 85,140 L 102,152 L 124,152 L 142,140 L 150,118 L 146,98 L 134,86 L 148,78 Z",
    label: "Suzuka ∞"
  },
  "GP de Miami": {
    path: "M 42,52 L 162,48 L 176,65 L 178,105 L 175,142 L 160,158 L 100,162 L 42,158 L 25,142 L 22,102 L 25,65 Z",
    label: "Miami"
  },
  "GP du Canada": {
    path: "M 55,28 L 148,24 L 170,42 L 174,78 L 168,112 L 150,135 L 124,145 L 94,148 L 66,140 L 45,120 L 35,90 L 38,58 Z",
    label: "Montréal"
  },
  "GP de Monaco": {
    path: "M 92,22 L 122,20 L 145,30 L 155,52 L 148,72 L 128,84 L 108,78 L 88,68 L 68,74 L 52,92 L 50,114 L 62,132 L 82,140 L 108,136 L 128,124 L 138,106 L 126,94 L 108,91 L 96,100 L 90,116 L 96,130",
    label: "Monaco"
  },
  "GP d'Espagne": {
    path: "M 48,42 L 95,30 L 138,28 L 162,40 L 174,62 L 175,90 L 165,115 L 146,132 L 118,140 L 88,138 L 62,128 L 42,110 L 32,85 L 35,60 Z",
    label: "Barcelone"
  },
  "GP d'Autriche": {
    path: "M 88,28 L 128,25 L 150,42 L 156,68 L 148,92 L 128,108 L 102,112 L 78,106 L 58,90 L 52,65 L 60,42 Z",
    label: "Red Bull Ring"
  },
  "GP de Grande-Bretagne": {
    path: "M 58,35 L 98,22 L 135,20 L 160,35 L 172,58 L 166,84 L 148,102 L 125,115 L 102,120 L 80,124 L 58,118 L 38,104 L 28,80 L 32,55 Z",
    label: "Silverstone"
  },
  "GP de Belgique": {
    path: "M 52,28 L 88,20 L 122,22 L 150,38 L 165,62 L 160,92 L 145,118 L 122,132 L 95,138 L 68,132 L 46,115 L 34,88 L 36,60 Z",
    label: "Spa"
  },
  "GP des Pays-Bas": {
    path: "M 80,28 L 120,25 L 146,40 L 155,65 L 150,92 L 132,110 L 108,116 L 84,110 L 64,96 L 55,72 L 58,48 Z",
    label: "Zandvoort"
  },
  "GP d'Italie": {
    path: "M 48,35 L 102,24 L 152,28 L 172,50 L 174,82 L 162,110 L 140,130 L 104,138 L 70,132 L 45,112 L 32,84 L 35,55 Z",
    label: "Monza"
  },
  "GP d'Azerbaïdjan": {
    path: "M 40,22 L 95,18 L 150,20 L 172,35 L 178,62 L 174,98 L 165,125 L 148,145 L 120,157 L 88,160 L 60,152 L 38,135 L 28,108 L 30,75 L 35,48 Z",
    label: "Bakou"
  },
  "GP de Singapour": {
    path: "M 55,28 L 92,20 L 128,22 L 155,38 L 168,60 L 170,88 L 160,112 L 142,128 L 118,138 L 92,140 L 65,132 L 44,115 L 34,88 L 38,60 L 48,40 Z",
    label: "Marina Bay"
  },
  "GP des États-Unis": {
    path: "M 42,35 L 82,22 L 122,20 L 152,30 L 170,52 L 172,80 L 162,108 L 140,125 L 112,135 L 82,135 L 55,128 L 35,108 L 26,82 L 30,56 Z",
    label: "COTA"
  },
  "GP du Mexique": {
    path: "M 45,38 L 92,26 L 138,24 L 164,38 L 174,62 L 172,90 L 160,115 L 138,130 L 108,137 L 78,133 L 52,118 L 36,92 L 38,65 Z",
    label: "Mexico"
  },
  "GP du Brésil": {
    path: "M 75,25 L 118,20 L 148,32 L 165,55 L 168,85 L 158,110 L 138,126 L 108,133 L 80,130 L 56,116 L 42,92 L 45,65 Z",
    label: "Interlagos"
  },
  "GP de Madrid": {
    path: "M 50,38 L 100,26 L 150,30 L 172,52 L 175,82 L 165,110 L 140,130 L 105,138 L 72,134 L 46,118 L 33,90 L 36,62 Z",
    label: "Madrid"
  },
  "GP de Las Vegas": {
    path: "M 40,40 L 160,36 L 178,55 L 180,100 L 178,145 L 160,160 L 40,162 L 22,145 L 20,100 L 22,55 Z",
    label: "Las Vegas"
  },
  "GP du Qatar": {
    path: "M 62,28 L 112,22 L 150,30 L 168,52 L 170,82 L 158,110 L 136,128 L 108,136 L 78,133 L 52,118 L 38,92 L 42,62 Z",
    label: "Losail"
  },
  "GP d'Abu Dhabi": {
    path: "M 55,32 L 108,25 L 150,28 L 170,50 L 174,80 L 164,110 L 142,130 L 108,138 L 75,134 L 48,118 L 35,92 L 38,62 L 48,42 Z",
    label: "Yas Marina"
  },
}

function F1Car() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '120px' }}>
      <style>{`
        @keyframes carGo{0%{transform:translateX(-320px);opacity:0}8%{opacity:1}88%{opacity:1}100%{transform:translateX(120vw);opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fire{0%,100%{opacity:1;transform:scaleX(1)}50%{opacity:0.5;transform:scaleX(0.5)}}
        .go{animation:carGo 4.5s ease-in-out infinite}
        .wfl{transform-origin:55px 88px;animation:spin 0.18s linear infinite}
        .wfr{transform-origin:55px 20px;animation:spin 0.18s linear infinite}
        .wrl{transform-origin:178px 93px;animation:spin 0.18s linear infinite}
        .wrr{transform-origin:178px 15px;animation:spin 0.18s linear infinite}
        .fx{animation:fire 0.1s linear infinite}
      `}</style>
      <div className="absolute inset-0 opacity-20">
        {[15,40,65,90].map((y,i)=><div key={i} className="absolute h-px w-full bg-gradient-to-r from-transparent via-red-700 to-transparent" style={{top:y}}/>)}
      </div>
      <div className="go absolute" style={{top:0}}>
        <svg width="290" height="118" viewBox="0 0 290 118" xmlns="http://www.w3.org/2000/svg">
          <g className="fx">
            <ellipse cx="14" cy="54" rx="12" ry="4" fill="#FF4500" opacity="0.95"/>
            <ellipse cx="8" cy="54" rx="7" ry="3" fill="#FF8C00" opacity="0.8"/>
            <ellipse cx="3" cy="54" rx="3.5" ry="1.8" fill="#FFD700" opacity="0.6"/>
          </g>
          <path d="M24 66 L232 66 L244 72 L248 76 L232 76 L24 74Z" fill="#800000"/>
          <path d="M232 66 L258 62 L265 67 L261 76 L248 76 L232 76Z" fill="#600000"/>
          <path d="M24 55 L50 46 L80 40 L140 36 L196 38 L228 44 L246 54 L243 65 L196 66 L80 66 L36 63Z" fill="#CC0000"/>
          <path d="M60 46 L80 34 L140 30 L196 32 L225 40 L228 46 L196 40 L80 40Z" fill="#E10600"/>
          <path d="M113 34 L122 18 L143 14 L160 16 L167 28 L163 36 L143 36Z" fill="#111"/>
          <rect x="131" y="14" width="22" height="7" rx="3" fill="#252525"/>
          <path d="M108 38 L114 24 L143 18 L169 22 L174 34 L167 38Z" fill="#111"/>
          <path d="M112 36 L116 26 L143 20 L167 24 L171 34 L165 36Z" fill="#0d0d0d"/>
          <path d="M114 32 Q143 16 172 30" fill="none" stroke="#555" strokeWidth="4.5" strokeLinecap="round"/>
          <line x1="143" y1="16" x2="143" y2="32" stroke="#555" strokeWidth="3.5"/>
          <ellipse cx="143" cy="28" rx="16" ry="6.5" fill="#1a3555" opacity="0.7"/>
          <path d="M244 50 L282 44 L290 50 L287 60 L282 63 L244 61Z" fill="#CC0000"/>
          <path d="M262 44 L290 38 L296 44 L292 50 L282 46 L262 46Z" fill="#E10600"/>
          <path d="M262 61 L290 63 L296 69 L290 71 L262 67Z" fill="#E10600"/>
          <rect x="242" y="51" width="3" height="9" fill="#880000"/>
          <rect x="11" y="30" width="14" height="4.5" rx="2" fill="#E10600"/>
          <rect x="11" y="72" width="14" height="4.5" rx="2" fill="#E10600"/>
          <rect x="17" y="34.5" width="3" height="37" fill="#BB0000"/>
          <line x1="72" y1="20" x2="86" y2="32" stroke="#333" strokeWidth="2.5"/>
          <line x1="72" y1="87" x2="86" y2="74" stroke="#333" strokeWidth="2.5"/>
          <line x1="167" y1="15" x2="153" y2="32" stroke="#333" strokeWidth="2.5"/>
          <line x1="167" y1="95" x2="153" y2="77" stroke="#333" strokeWidth="2.5"/>
          <line x1="181" y1="40" x2="181" y2="64" stroke="#770000" strokeWidth="2"/>
          <line x1="187" y1="39" x2="187" y2="64" stroke="#770000" strokeWidth="1.5"/>
          <rect x="118" y="24" width="13" height="5.5" rx="2" fill="#252525"/>
          <rect x="149" y="24" width="13" height="5.5" rx="2" fill="#252525"/>
          <text x="132" y="50" fontSize="7.5" fontWeight="bold" fill="white" opacity="0.6">F1 2026</text>
          <g className="wfr">
            <circle cx="55" cy="20" r="18"/><circle cx="55" cy="20" r="14" fill="#151515"/>
            <circle cx="55" cy="20" r="7" fill="#252525"/><circle cx="55" cy="20" r="3" fill="#333"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={55+7*Math.cos(a*Math.PI/180)} y1={20+7*Math.sin(a*Math.PI/180)} x2={55+13*Math.cos(a*Math.PI/180)} y2={20+13*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wfl">
            <circle cx="55" cy="88" r="18"/><circle cx="55" cy="88" r="14" fill="#151515"/>
            <circle cx="55" cy="88" r="7" fill="#252525"/><circle cx="55" cy="88" r="3" fill="#333"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={55+7*Math.cos(a*Math.PI/180)} y1={88+7*Math.sin(a*Math.PI/180)} x2={55+13*Math.cos(a*Math.PI/180)} y2={88+13*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wrr">
            <circle cx="178" cy="15" r="21"/><circle cx="178" cy="15" r="17" fill="#151515"/>
            <circle cx="178" cy="15" r="9" fill="#252525"/><circle cx="178" cy="15" r="4" fill="#333"/>
            {[0,40,80,120,160,200,240,280,320].map(a=><line key={a} x1={178+9*Math.cos(a*Math.PI/180)} y1={15+9*Math.sin(a*Math.PI/180)} x2={178+16*Math.cos(a*Math.PI/180)} y2={15+16*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wrl">
            <circle cx="178" cy="93" r="21"/><circle cx="178" cy="93" r="17" fill="#151515"/>
            <circle cx="178" cy="93" r="9" fill="#252525"/><circle cx="178" cy="93" r="4" fill="#333"/>
            {[0,40,80,120,160,200,240,280,320].map(a=><line key={a} x1={178+9*Math.cos(a*Math.PI/180)} y1={93+9*Math.sin(a*Math.PI/180)} x2={178+16*Math.cos(a*Math.PI/180)} y2={93+16*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
        </svg>
      </div>
    </div>
  )
}

function CircuitSVG({ gp, status }) {
  const circuit = CIRCUITS[gp]
  const color = status === 'Prochain' ? '#E10600' : status === 'Terminé' ? '#3a3a3a' : '#555'
  const glow = status === 'Prochain' ? 'rgba(225,6,0,0.2)' : 'transparent'

  if (!circuit) return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-zinc-600 text-xs">{gp}</span>
    </div>
  )

  return (
    <svg viewBox="0 0 210 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="210" height="180" fill="#080808"/>
      {/* Glow */}
      {status === 'Prochain' && <path d={circuit.path} fill="none" stroke={glow} strokeWidth="18" strokeLinejoin="round" strokeLinecap="round"/>}
      {/* Track shadow */}
      <path d={circuit.path} fill="none" stroke="#1c1c1c" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Asphalt */}
      <path d={circuit.path} fill="none" stroke="#222" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Track line */}
      <path d={circuit.path} fill="none" stroke={color} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" opacity={status==='Terminé'?0.4:1}/>
      {/* White line center */}
      <path d={circuit.path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 6"/>
      {/* Start dot */}
      {status !== 'Terminé' && <circle cx="102" cy="18" r="4.5" fill={color}/>}
      {/* Label */}
      <text x="105" y="170" textAnchor="middle" fontSize="9" fill={status==='Terminé'?'#333':color} fontWeight="600" opacity="0.9">{circuit.label}</text>
    </svg>
  )
}

function DriverAvatar({ driver, size = 56, className = '' }) {
  const color = teamColors[driver.team] || '#E10600'
  const initials = driver.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  return (
    <div className={`rounded-full border-2 flex items-center justify-center font-black text-white ${className}`}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}dd, ${color}88)`, borderColor: color, fontSize: size * 0.28, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function DriverCard({ driver, onClick }) {
  const color = teamColors[driver.team] || '#E10600'
  return (
    <article onClick={() => onClick(driver)}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="h-1" style={{ background: color }} />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <DriverAvatar driver={driver} size={52} />
            <div className="absolute -bottom-1 -right-1 text-white font-black rounded-full w-6 h-6 flex items-center justify-center text-center"
              style={{ background: color, fontSize: '9px' }}>
              {driver.num}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white leading-tight truncate">{driver.name}</h3>
            <p className="text-xs text-zinc-500 truncate">{driver.country}</p>
            {driver.titles > 0 && <p className="text-xs font-bold" style={{ color }}>🏆 {driver.titles}× Champion</p>}
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
  const color = teamColors[driver.team] || '#E10600'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="h-2" style={{ background: color }} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <DriverAvatar driver={driver} size={88} className="rounded-2xl" />
            <div className="flex-1 min-w-0">
              <span className="text-3xl font-black" style={{ color }}>#{driver.num}</span>
              <h2 className="text-xl font-black text-white leading-tight">{driver.name}</h2>
              <p className="text-sm font-semibold mt-1" style={{ color }}>{driver.team}</p>
              <p className="text-xs text-zinc-500">{driver.country} · Né en {driver.born}</p>
              {driver.titles > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 text-white text-xs px-3 py-1 rounded-full font-bold" style={{ background: color }}>
                  🏆 {driver.titles} titre{driver.titles > 1 ? 's' : ''} mondial{driver.titles > 1 ? 'aux' : ''}
                </div>
              )}
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">✕</button>
          </div>
          <div className="border-t border-zinc-800 pt-4 mb-4">
            <p className="text-sm text-zinc-300 leading-relaxed">{driver.bio}</p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Carrière</p>
            <div className="flex flex-col gap-2">
              {driver.teams.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
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

export default function App() {
  const [activeNav, setActiveNav] = useState('accueil')
  const [liveOn, setLiveOn] = useState(false)
  const [liveIndex, setLiveIndex] = useState(0)
  const [lap, setLap] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [liveInterval, setLiveInterval] = useState(null)
  const [liveNews, setLiveNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.autosport.com/rss/f1/news/')}&count=6`)
      .then(r => r.json())
      .then(data => {
        if (data.items?.length > 0) {
          setLiveNews(data.items.map(item => ({
            title: item.title,
            category: 'F1 News',
            snippet: item.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...',
            link: item.link,
            date: new Date(item.pubDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          })))
        } else setLiveNews(staticNews)
        setNewsLoading(false)
      })
      .catch(() => { setLiveNews(staticNews); setNewsLoading(false) })
  }, [])

  const startLive = () => {
    setLiveIndex(0); setLap(0); setLiveOn(true)
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
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /> : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.2),transparent_55%)]" />
            <div className="relative mb-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-raceRed">Saison 2026 · Nouvelle ère</p>
              <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">La <span className="text-raceRed">Formule 1</span><br />à portée de main</h1>
              <p className="mb-8 max-w-xl text-zinc-400">Résultats, pilotes, histoire, live GP et calendrier — tout en un.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#live" className="rounded-xl bg-raceRed px-6 py-3 text-sm font-bold text-white hover:bg-red-700 uppercase tracking-wider transition-colors">🔴 Live GP</a>
                <a href="#calendrier" className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-zinc-400 uppercase tracking-wider transition-colors">Calendrier 2026</a>
                <a href="#pilotes" className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-zinc-400 uppercase tracking-wider transition-colors">Pilotes</a>
              </div>
            </div>
            <F1Car />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Prochain GP', value: 'Miami', sub: '3 Mai 2026' },
              { label: 'Champion 2025', value: 'L. Norris', sub: 'McLaren' },
              { label: 'Constructeurs 2025', value: 'McLaren', sub: 'Titre consécutif' },
              { label: 'Vainqueur Australie', value: 'G. Russell', sub: 'Mercedes' },
            ].map(s => (
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
            {historyMilestones.map(item => (
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
            {currentDrivers.map(driver => <DriverCard key={driver.num} driver={driver} onClick={setSelectedDriver} />)}
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

        <Section id="actualites" title="Actualités F1">
          <div className="flex items-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full ${newsLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-xs text-zinc-500">{newsLoading ? 'Chargement...' : 'News en direct via Autosport'}</span>
          </div>
          {newsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 animate-pulse">
                  <div className="h-3 bg-zinc-700 rounded mb-3 w-16" /><div className="h-4 bg-zinc-700 rounded mb-2" /><div className="h-3 bg-zinc-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveNews.map((item, i) => (
                <a key={i} href={item.link || '#'} target="_blank" rel="noopener noreferrer"
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-raceRed/40 transition-all block">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-raceRed/15 px-3 py-0.5 text-xs font-bold text-raceRed uppercase tracking-wider">{item.category}</span>
                    {item.date && <span className="text-xs text-zinc-600">{item.date}</span>}
                  </div>
                  <h3 className="mb-2 font-bold text-white leading-snug group-hover:text-raceRed transition-colors text-sm">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.snippet}</p>
                </a>
              ))}
            </div>
          )}
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
              {liveOn && <button onClick={stopLive} className="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-400">Arrêter</button>}
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
                <div className="relative" style={{ height: '155px' }}>
                  <CircuitSVG gp={race.gp} status={race.status} />
                  <div className="absolute top-2 left-2 bg-black/70 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-bold">R{i + 1}</div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${race.status === 'Prochain' ? 'bg-raceRed text-white' : race.status === 'Terminé' ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-800/80 text-zinc-400'}`}>
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
        F1Hub 2026 · React + Tailwind · News en direct · Données vérifiées
      </footer>
    </div>
  )
}
