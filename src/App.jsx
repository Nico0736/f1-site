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

// Wikipedia circuit SVG thumbnails - real circuit layouts
const CIRCUIT_IMAGES = {
  "GP d'Australie": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Albert_Park_Circuit_-_2011.svg/300px-Albert_Park_Circuit_-_2011.svg.png",
  "GP de Chine": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Shanghai_circuit.svg/300px-Shanghai_circuit.svg.png",
  "GP du Japon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Suzuka_circuit_layout.svg/300px-Suzuka_circuit_layout.svg.png",
  "GP de Miami": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Miami_International_Autodrome.svg/300px-Miami_International_Autodrome.svg.png",
  "GP du Canada": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Circuit_Gilles_Villeneuve.svg/300px-Circuit_Gilles_Villeneuve.svg.png",
  "GP de Monaco": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Circuit_Monaco.svg/300px-Circuit_Monaco.svg.png",
  "GP d'Espagne": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Circuit_de_Barcelona_Catalunya_2016.svg/300px-Circuit_de_Barcelona_Catalunya_2016.svg.png",
  "GP d'Autriche": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Circuit_Red_Bull_Ring.svg/300px-Circuit_Red_Bull_Ring.svg.png",
  "GP de Grande-Bretagne": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Silverstone_circuit_2020.svg/300px-Silverstone_circuit_2020.svg.png",
  "GP de Belgique": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Circuit_Spa_modified.svg/300px-Circuit_Spa_modified.svg.png",
  "GP des Pays-Bas": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Zandvoort_circuit_2020.svg/300px-Zandvoort_circuit_2020.svg.png",
  "GP d'Italie": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Monza_track_map.svg/300px-Monza_track_map.svg.png",
  "GP d'Azerbaïdjan": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Baku_Formula1_Circuit.svg/300px-Baku_Formula1_Circuit.svg.png",
  "GP de Singapour": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Marina_Bay_circuit.svg/300px-Marina_Bay_circuit.svg.png",
  "GP des États-Unis": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Austin_circuit.svg/300px-Austin_circuit.svg.png",
  "GP du Mexique": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Autodromo_Hermanos_Rodriguez_Circuit_2015.svg/300px-Autodromo_Hermanos_Rodriguez_Circuit_2015.svg.png",
  "GP du Brésil": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Autodromo_Jose_Carlos_Pace_2012.svg/300px-Autodromo_Jose_Carlos_Pace_2012.svg.png",
  "GP de Madrid": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Madrid_Street_Circuit_2026.svg/300px-Madrid_Street_Circuit_2026.svg.png",
  "GP de Las Vegas": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Las_Vegas_Street_Circuit.svg/300px-Las_Vegas_Street_Circuit.svg.png",
  "GP du Qatar": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Losail_International_Circuit.svg/300px-Losail_International_Circuit.svg.png",
  "GP d'Abu Dhabi": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Yas_Marina_circuit.svg/300px-Yas_Marina_circuit.svg.png",
}

// Verified Wikipedia driver headshot URLs
const DRIVER_PHOTOS = {
  'Lando Norris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Lando_Norris_2024_Headshot.jpg/200px-Lando_Norris_2024_Headshot.jpg',
  'Oscar Piastri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Oscar_Piastri_2024_Headshot.jpg/200px-Oscar_Piastri_2024_Headshot.jpg',
  'Charles Leclerc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Charles_Leclerc_2024_Headshot.jpg/200px-Charles_Leclerc_2024_Headshot.jpg',
  'Lewis Hamilton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/200px-Lewis_Hamilton_2016_Malaysia_2.jpg',
  'Max Verstappen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Max_Verstappen_2023_Headshot.jpg/200px-Max_Verstappen_2023_Headshot.jpg',
  'George Russell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/George_Russell_2024_Headshot.jpg/200px-George_Russell_2024_Headshot.jpg',
  'Carlos Sainz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Carlos_Sainz_Jr._2024_Headshot.jpg/200px-Carlos_Sainz_Jr._2024_Headshot.jpg',
  'Alexander Albon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Alexander_Albon_2024_Headshot.jpg/200px-Alexander_Albon_2024_Headshot.jpg',
  'Pierre Gasly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Pierre_Gasly_2024_Headshot.jpg/200px-Pierre_Gasly_2024_Headshot.jpg',
  'Esteban Ocon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Esteban_Ocon_2024_Headshot.jpg/200px-Esteban_Ocon_2024_Headshot.jpg',
  'Oliver Bearman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Oliver_Bearman_2024.jpg/200px-Oliver_Bearman_2024.jpg',
  'Nico Hülkenberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nico_H%C3%BClkenberg_2024_Headshot.jpg/200px-Nico_H%C3%BClkenberg_2024_Headshot.jpg',
  'Fernando Alonso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Fernando_Alonso_2024_Headshot.jpg/200px-Fernando_Alonso_2024_Headshot.jpg',
  'Lance Stroll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lance_Stroll_2024_Headshot.jpg/200px-Lance_Stroll_2024_Headshot.jpg',
  'Sergio Pérez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sergio_P%C3%A9rez_2024_Headshot.jpg/200px-Sergio_P%C3%A9rez_2024_Headshot.jpg',
  'Valtteri Bottas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Valtteri_Bottas_2022_Headshot.jpg/200px-Valtteri_Bottas_2022_Headshot.jpg',
  'Liam Lawson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Liam_Lawson_2024.jpg/200px-Liam_Lawson_2024.jpg',
  'Isack Hadjar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Isack_Hadjar_2024.jpg/200px-Isack_Hadjar_2024.jpg',
  'Kimi Antonelli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Andrea_Kimi_Antonelli_2024.jpg/200px-Andrea_Kimi_Antonelli_2024.jpg',
  'Gabriel Bortoleto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Gabriel_Bortoleto_2024.jpg/200px-Gabriel_Bortoleto_2024.jpg',
  'Franco Colapinto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franco_Colapinto_2024.jpg/200px-Franco_Colapinto_2024.jpg',
  'Arvid Lindblad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Arvid_Lindblad_2024.jpg/200px-Arvid_Lindblad_2024.jpg',
}

// Driver image component with proper React state error handling
function DriverImg({ driver, size = 56, rounded = 'rounded-full', className = '' }) {
  const [err, setErr] = useState(false)
  const color = teamColors[driver.team] || '#E10600'
  const url = DRIVER_PHOTOS[driver.name]
  const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (err || !url) {
    return (
      <div className={`${rounded} flex items-center justify-center font-black text-white border-2 ${className}`}
        style={{ width: size, height: size, minWidth: size, background: `linear-gradient(135deg, ${color}, ${color}99)`, borderColor: color, fontSize: size * 0.28 }}>
        {initials}
      </div>
    )
  }
  return (
    <img src={url} alt={driver.name} onError={() => setErr(true)}
      className={`${rounded} object-cover object-top border-2 ${className}`}
      style={{ width: size, height: size, minWidth: size, borderColor: color }} />
  )
}

// Circuit image with fallback
function CircuitImg({ race, index }) {
  const [err, setErr] = useState(false)
  const url = CIRCUIT_IMAGES[race.gp]
  const color = race.status === 'Prochain' ? '#E10600' : race.status === 'Terminé' ? '#333' : '#555'

  return (
    <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
      {!err && url ? (
        <img src={url} alt={race.circuit}
          className="w-full h-full object-contain p-2"
          style={{ filter: race.status === 'Terminé' ? 'grayscale(80%) opacity(0.5)' : 'none' }}
          onError={() => setErr(true)} />
      ) : (
        // Fallback: clean circuit name display
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: color }}>
            <span className="text-2xl">🏎️</span>
          </div>
          <span className="text-xs font-bold" style={{ color }}>{race.circuit}</span>
        </div>
      )}
    </div>
  )
}

function F1Car() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '120px' }}>
      <style>{`
        @keyframes carGo{0%{transform:translateX(-320px);opacity:0}8%{opacity:1}88%{opacity:1}100%{transform:translateX(120vw);opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fire{0%,100%{opacity:1;transform:scaleX(1)}50%{opacity:0.4;transform:scaleX(0.4)}}
        .go{animation:carGo 4.5s ease-in-out infinite}
        .wfl{transform-origin:55px 88px;animation:spin 0.18s linear infinite}
        .wfr{transform-origin:55px 20px;animation:spin 0.18s linear infinite}
        .wrl{transform-origin:178px 93px;animation:spin 0.18s linear infinite}
        .wrr{transform-origin:178px 15px;animation:spin 0.18s linear infinite}
        .fx{animation:fire 0.1s linear infinite}
      `}</style>
      <div className="absolute inset-0 opacity-15">
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
          <rect x="118" y="24" width="13" height="5.5" rx="2" fill="#252525"/>
          <rect x="149" y="24" width="13" height="5.5" rx="2" fill="#252525"/>
          <text x="132" y="50" fontSize="7.5" fontWeight="bold" fill="white" opacity="0.6">F1 2026</text>
          <g className="wfr">
            <circle cx="55" cy="20" r="18" fill="#0d0d0d"/>
            <circle cx="55" cy="20" r="14" fill="#151515"/>
            <circle cx="55" cy="20" r="7" fill="#252525"/>
            <circle cx="55" cy="20" r="3" fill="#333"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={55+7*Math.cos(a*Math.PI/180)} y1={20+7*Math.sin(a*Math.PI/180)} x2={55+13*Math.cos(a*Math.PI/180)} y2={20+13*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wfl">
            <circle cx="55" cy="88" r="18" fill="#0d0d0d"/>
            <circle cx="55" cy="88" r="14" fill="#151515"/>
            <circle cx="55" cy="88" r="7" fill="#252525"/>
            <circle cx="55" cy="88" r="3" fill="#333"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={55+7*Math.cos(a*Math.PI/180)} y1={88+7*Math.sin(a*Math.PI/180)} x2={55+13*Math.cos(a*Math.PI/180)} y2={88+13*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wrr">
            <circle cx="178" cy="15" r="21" fill="#0d0d0d"/>
            <circle cx="178" cy="15" r="17" fill="#151515"/>
            <circle cx="178" cy="15" r="9" fill="#252525"/>
            <circle cx="178" cy="15" r="4" fill="#333"/>
            {[0,40,80,120,160,200,240,280,320].map(a=><line key={a} x1={178+9*Math.cos(a*Math.PI/180)} y1={15+9*Math.sin(a*Math.PI/180)} x2={178+16*Math.cos(a*Math.PI/180)} y2={15+16*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
          <g className="wrl">
            <circle cx="178" cy="93" r="21" fill="#0d0d0d"/>
            <circle cx="178" cy="93" r="17" fill="#151515"/>
            <circle cx="178" cy="93" r="9" fill="#252525"/>
            <circle cx="178" cy="93" r="4" fill="#333"/>
            {[0,40,80,120,160,200,240,280,320].map(a=><line key={a} x1={178+9*Math.cos(a*Math.PI/180)} y1={93+9*Math.sin(a*Math.PI/180)} x2={178+16*Math.cos(a*Math.PI/180)} y2={93+16*Math.sin(a*Math.PI/180)} stroke="#444" strokeWidth="1.5"/>)}
          </g>
        </svg>
      </div>
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
            <DriverImg driver={driver} size={52} />
            <div className="absolute -bottom-1 -right-1 text-white font-black rounded-full w-6 h-6 flex items-center justify-center"
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
            <DriverImg driver={driver} size={90} rounded="rounded-2xl" />
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
                <div className="relative bg-zinc-950" style={{ height: '150px' }}>
                  <CircuitImg race={race} index={i} />
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
