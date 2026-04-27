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

const CIRCUIT_PATHS = {
  "GP d'Australie": "M90,30 L120,25 L150,32 L168,50 L172,75 L165,100 L148,118 L125,128 L98,130 L72,122 L52,105 L40,82 L42,58 L58,40 Z",
  "GP de Chine": "M60,20 L130,18 L155,28 L165,50 L160,75 L145,90 L160,110 L165,135 L148,155 L110,162 L75,158 L45,140 L35,115 L40,85 L55,65 L45,45 Z",
  "GP du Japon": "M100,15 L130,18 L152,32 L158,55 L148,75 L125,80 L108,75 L95,85 L92,105 L100,125 L115,140 L108,158 L85,165 L62,158 L48,140 L45,115 L55,90 L70,75 L65,55 L75,35 Z",
  "GP de Miami": "M40,50 L160,45 L175,60 L178,100 L175,140 L160,158 L100,162 L40,158 L25,140 L22,100 L25,60 Z",
  "GP du Canada": "M55,25 L145,22 L168,40 L172,75 L165,110 L148,132 L125,142 L95,145 L68,138 L48,118 L38,88 L40,58 L55,35 Z",
  "GP de Monaco": "M95,20 L125,18 L148,28 L158,48 L155,68 L138,82 L115,88 L95,82 L75,72 L58,78 L48,98 L52,118 L68,130 L92,135 L115,128 L132,112 L125,95 L108,90 L95,98 L88,112 L92,125",
  "GP d'Espagne": "M50,40 L90,30 L130,28 L158,38 L172,58 L175,85 L168,110 L150,128 L125,138 L95,142 L68,135 L45,118 L35,92 L38,65 Z",
  "GP d'Autriche": "M85,28 L125,25 L148,40 L155,65 L148,88 L128,102 L105,108 L82,102 L62,88 L55,65 L62,40 Z",
  "GP de Grande-Bretagne": "M60,35 L95,22 L130,20 L158,32 L170,55 L165,82 L150,100 L125,112 L105,118 L85,122 L65,118 L45,105 L35,82 L38,58 Z",
  "GP de Belgique": "M55,30 L88,22 L122,25 L150,38 L165,62 L162,90 L148,115 L125,130 L98,138 L70,130 L48,115 L36,88 L38,62 Z",
  "GP des Pays-Bas": "M78,28 L118,25 L145,40 L155,65 L150,90 L132,108 L108,115 L85,110 L65,97 L55,72 L58,48 Z",
  "GP d'Italie": "M50,35 L100,25 L148,30 L168,50 L172,80 L160,108 L140,128 L105,135 L72,130 L48,112 L35,85 L38,58 Z",
  "GP d'Azerbaïdjan": "M45,25 L95,20 L148,22 L170,35 L178,62 L172,98 L162,122 L145,142 L118,155 L88,158 L60,150 L40,135 L30,108 L33,78 L40,50 Z",
  "GP de Singapour": "M55,30 L90,22 L125,25 L152,35 L165,55 L168,82 L160,108 L145,125 L120,135 L95,138 L68,130 L48,115 L36,90 L38,62 L48,42 Z",
  "GP des États-Unis": "M45,35 L80,22 L118,20 L150,28 L168,48 L172,75 L162,102 L142,122 L115,135 L85,138 L58,130 L38,112 L28,88 L32,58 Z",
  "GP du Mexique": "M48,38 L92,25 L135,22 L162,35 L172,58 L170,88 L158,112 L138,128 L108,135 L78,130 L52,118 L38,92 L40,65 Z",
  "GP du Brésil": "M75,25 L115,20 L145,30 L162,52 L165,82 L155,108 L135,125 L108,132 L82,130 L58,118 L45,95 L48,68 Z",
  "GP de Madrid": "M50,38 L100,28 L148,32 L170,52 L175,82 L165,110 L140,130 L105,138 L72,132 L46,118 L33,90 L36,62 Z",
  "GP de Las Vegas": "M42,38 L158,35 L175,52 L178,95 L175,138 L158,152 L42,155 L25,138 L22,95 L25,52 Z",
  "GP du Qatar": "M60,28 L110,22 L148,30 L165,52 L168,82 L158,110 L138,128 L108,136 L78,132 L52,118 L38,92 L42,62 Z",
  "GP d'Abu Dhabi": "M55,32 L105,25 L148,28 L168,50 L172,80 L162,110 L140,130 L108,138 L75,134 L48,118 L36,92 L38,62 L48,42 Z",
}

const teamColors = {
  'McLaren': '#FF8000', 'Ferrari': '#E10600', 'Red Bull Racing': '#3671C6',
  'Mercedes': '#27F4D2', 'Williams': '#005AFF', 'Racing Bulls': '#6692FF',
  'Aston Martin': '#358C75', 'Alpine': '#FF87BC', 'Haas': '#B6BABD',
  'Audi': '#C9002B', 'Cadillac': '#C8B88A',
}

const DRIVER_PHOTOS = {
  'Lando Norris': 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png',
  'Oscar Piastri': 'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png',
  'Charles Leclerc': 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png',
  'Lewis Hamilton': 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png',
  'Max Verstappen': 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png',
  'George Russell': 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png',
  'Carlos Sainz': 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png',
  'Alexander Albon': 'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png',
  'Pierre Gasly': 'https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png',
  'Esteban Ocon': 'https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png',
  'Oliver Bearman': 'https://www.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/2col/image.png',
  'Nico Hülkenberg': 'https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png',
  'Fernando Alonso': 'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png',
  'Lance Stroll': 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png',
  'Sergio Pérez': 'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png',
  'Valtteri Bottas': 'https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png',
  'Liam Lawson': 'https://www.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/2col/image.png',
  'Isack Hadjar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Isack_Hadjar_2024.jpg/200px-Isack_Hadjar_2024.jpg',
  'Kimi Antonelli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Andrea_Kimi_Antonelli_2024.jpg/200px-Andrea_Kimi_Antonelli_2024.jpg',
  'Gabriel Bortoleto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Gabriel_Bortoleto_2024.jpg/200px-Gabriel_Bortoleto_2024.jpg',
  'Franco Colapinto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franco_Colapinto_2024.jpg/200px-Franco_Colapinto_2024.jpg',
  'Arvid Lindblad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Arvid_Lindblad_2024.jpg/200px-Arvid_Lindblad_2024.jpg',
}

function F1Car() {
  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: '140px' }}>
      <style>{`
        @keyframes carRace { 0% { transform:translateX(-380px);opacity:0; } 5% { opacity:1; } 90% { opacity:1; } 100% { transform:translateX(120vw);opacity:0; } }
        @keyframes wheelSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes flame { 0%,100% { opacity:1;transform:scaleX(1); } 50% { opacity:0.6;transform:scaleX(0.6); } }
        .f1-animate { animation: carRace 4s ease-in-out infinite; }
        .w-spin-fl { transform-origin:62px 95px; animation:wheelSpin 0.2s linear infinite; }
        .w-spin-fr { transform-origin:62px 25px; animation:wheelSpin 0.2s linear infinite; }
        .w-spin-rl { transform-origin:188px 100px; animation:wheelSpin 0.2s linear infinite; }
        .w-spin-rr { transform-origin:188px 20px; animation:wheelSpin 0.2s linear infinite; }
        .flame-anim { animation:flame 0.12s linear infinite; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden opacity-25">
        {[20,50,80,110].map((y,i) => <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-red-600 to-transparent w-full" style={{top:`${y}px`}} />)}
      </div>
      <div className="f1-animate absolute left-0" style={{top:'5px'}}>
        <svg width="320" height="130" viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg">
          <g className="flame-anim">
            <ellipse cx="18" cy="60" rx="14" ry="5" fill="#FF4500" opacity="0.95"/>
            <ellipse cx="11" cy="60" rx="9" ry="3.5" fill="#FF8C00" opacity="0.85"/>
            <ellipse cx="5" cy="60" rx="5" ry="2" fill="#FFD700" opacity="0.7"/>
            <ellipse cx="2" cy="60" rx="2.5" ry="1.5" fill="white" opacity="0.5"/>
          </g>
          <path d="M28 72 L240 72 L250 78 L255 78 L255 82 L240 82 L28 80 Z" fill="#8B0000"/>
          <path d="M240 72 L270 68 L278 72 L275 82 L255 82 L240 82 Z" fill="#660000"/>
          <path d="M28 60 L55 50 L85 44 L145 40 L200 42 L235 48 L255 58 L252 70 L200 72 L85 72 L40 68 Z" fill="#CC0000"/>
          <path d="M65 50 L85 38 L145 34 L200 36 L230 44 L235 50 L200 44 L85 44 Z" fill="#E10600"/>
          <path d="M118 38 L128 22 L148 18 L165 20 L172 32 L168 40 L148 40 Z" fill="#1a1a1a"/>
          <rect x="136" y="18" width="24" height="8" rx="3" fill="#333"/>
          <path d="M112 42 L118 28 L148 22 L175 26 L180 38 L172 42 Z" fill="#111"/>
          <path d="M116 40 L121 30 L148 24 L173 28 L177 38 L170 40 Z" fill="#1a1a1a"/>
          <path d="M118 36 Q148 20 178 34" fill="none" stroke="#666" strokeWidth="5" strokeLinecap="round"/>
          <path d="M148 20 L148 36" fill="none" stroke="#666" strokeWidth="4"/>
          <ellipse cx="148" cy="32" rx="18" ry="7" fill="#1a3a5c" opacity="0.7"/>
          <path d="M252 54 L290 48 L298 54 L296 64 L290 68 L252 66 Z" fill="#CC0000"/>
          <path d="M270 48 L298 42 L304 48 L300 54 L290 50 L270 50 Z" fill="#E10600"/>
          <path d="M270 66 L298 68 L304 74 L298 76 L270 72 Z" fill="#E10600"/>
          <rect x="250" y="55" width="3" height="10" fill="#990000"/>
          <rect x="15" y="34" width="16" height="5" rx="2" fill="#E10600"/>
          <rect x="15" y="78" width="16" height="5" rx="2" fill="#E10600"/>
          <rect x="21" y="39" width="3" height="39" fill="#CC0000"/>
          <path d="M185 46 L185 70" stroke="#880000" strokeWidth="2"/>
          <path d="M192 45 L192 70" stroke="#880000" strokeWidth="1.5"/>
          <line x1="78" y1="25" x2="92" y2="36" stroke="#444" strokeWidth="2.5"/>
          <line x1="78" y1="95" x2="92" y2="80" stroke="#444" strokeWidth="2.5"/>
          <line x1="172" y1="22" x2="158" y2="36" stroke="#444" strokeWidth="2.5"/>
          <line x1="172" y1="100" x2="158" y2="82" stroke="#444" strokeWidth="2.5"/>
          <g className="w-spin-fr">
            <circle cx="62" cy="25" r="20" fill="#111"/><circle cx="62" cy="25" r="17" fill="#1a1a1a"/>
            <circle cx="62" cy="25" r="8" fill="#333"/><circle cx="62" cy="25" r="4" fill="#444"/>
            {[0,60,120,180,240,300].map(a=><line key={a} x1={62+8*Math.cos(a*Math.PI/180)} y1={25+8*Math.sin(a*Math.PI/180)} x2={62+16*Math.cos(a*Math.PI/180)} y2={25+16*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="2"/>)}
          </g>
          <g className="w-spin-fl">
            <circle cx="62" cy="95" r="20" fill="#111"/><circle cx="62" cy="95" r="17" fill="#1a1a1a"/>
            <circle cx="62" cy="95" r="8" fill="#333"/><circle cx="62" cy="95" r="4" fill="#444"/>
            {[0,60,120,180,240,300].map(a=><line key={a} x1={62+8*Math.cos(a*Math.PI/180)} y1={95+8*Math.sin(a*Math.PI/180)} x2={62+16*Math.cos(a*Math.PI/180)} y2={95+16*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="2"/>)}
          </g>
          <g className="w-spin-rr">
            <circle cx="188" cy="20" r="24" fill="#111"/><circle cx="188" cy="20" r="20" fill="#1a1a1a"/>
            <circle cx="188" cy="20" r="10" fill="#333"/><circle cx="188" cy="20" r="5" fill="#444"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={188+10*Math.cos(a*Math.PI/180)} y1={20+10*Math.sin(a*Math.PI/180)} x2={188+19*Math.cos(a*Math.PI/180)} y2={20+19*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="2"/>)}
          </g>
          <g className="w-spin-rl">
            <circle cx="188" cy="100" r="24" fill="#111"/><circle cx="188" cy="100" r="20" fill="#1a1a1a"/>
            <circle cx="188" cy="100" r="10" fill="#333"/><circle cx="188" cy="100" r="5" fill="#444"/>
            {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={188+10*Math.cos(a*Math.PI/180)} y1={100+10*Math.sin(a*Math.PI/180)} x2={188+19*Math.cos(a*Math.PI/180)} y2={100+19*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="2"/>)}
          </g>
          <rect x="122" y="28" width="16" height="7" rx="2" fill="#333"/>
          <rect x="155" y="28" width="16" height="7" rx="2" fill="#333"/>
          <text x="138" y="55" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" opacity="0.8">F1 2026</text>
        </svg>
      </div>
    </div>
  )
}

function CircuitSVG({ gp, status }) {
  const path = CIRCUIT_PATHS[gp]
  const color = status === 'Terminé' ? '#444' : status === 'Prochain' ? '#E10600' : '#666'
  if (!path) return <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Circuit à venir</div>
  return (
    <svg viewBox="0 0 210 195" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="210" height="195" fill="#0a0a0a"/>
      {status === 'Prochain' && <path d={path} fill="none" stroke="rgba(225,6,0,0.25)" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round"/>}
      <path d={path} fill="none" stroke="#1a1a1a" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
      <path d={path} fill="none" stroke="#2a2a2a" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
      <path d={path} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" opacity={status === 'Terminé' ? 0.5 : 1} strokeDasharray={status === 'À venir' ? 'none' : 'none'}/>
      {status !== 'Terminé' && <circle cx="92" cy="30" r="4" fill={color} opacity="0.9"/>}
    </svg>
  )
}

function DriverCard({ driver, onClick }) {
  const color = teamColors[driver.team] || '#E10600'
  const photoUrl = DRIVER_PHOTOS[driver.name]
  return (
    <article onClick={() => onClick(driver)} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="h-1 flex-shrink-0" style={{background: color}}/>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img src={photoUrl} alt={driver.name} className="w-14 h-14 rounded-full object-cover object-top border-2" style={{borderColor: color}}
              onError={(e) => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=${color.replace('#','')}&color=fff&size=56&bold=true` }}/>
            <div className="absolute -bottom-1 -right-1 text-white font-black rounded-full w-6 h-6 flex items-center justify-center leading-none" style={{background: color, fontSize:'9px'}}>
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
  const color = teamColors[driver.team] || '#E10600'
  const photoUrl = DRIVER_PHOTOS[driver.name]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="h-2" style={{background: color}}/>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <img src={photoUrl} alt={driver.name} className="w-24 h-24 rounded-2xl object-cover object-top border-2 flex-shrink-0" style={{borderColor: color}}
              onError={(e) => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=${color.replace('#','')}&color=fff&size=96&bold=true` }}/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-black" style={{color}}>#{driver.num}</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{driver.name}</h2>
              <p className="text-sm font-semibold mt-1" style={{color}}>{driver.team}</p>
              <p className="text-xs text-zinc-500">{driver.country} · Né en {driver.born}</p>
              {driver.titles > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 text-white text-xs px-3 py-1 rounded-full font-bold" style={{background: color}}>
                  🏆 {driver.titles} titre{driver.titles>1?'s':''} mondial{driver.titles>1?'aux':''}
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
              {driver.teams.map((t,i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background: color}}/>
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
    const rssUrl = 'https://www.autosport.com/rss/f1/news/'
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=6`)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setLiveNews(data.items.map(item => ({
            title: item.title,
            category: 'F1 News',
            snippet: item.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...',
            link: item.link,
            date: new Date(item.pubDate).toLocaleDateString('fr-FR', {day:'2-digit', month:'short'}),
          })))
        } else {
          setLiveNews(staticNews)
        }
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
      {selectedDriver && <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)}/>}

      <header className="sticky top-0 z-40 border-b-2 border-raceRed bg-black/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#accueil" className="text-xl font-black tracking-widest text-raceRed uppercase">F1<span className="text-white">Hub</span></a>
          <ul className="hidden gap-1 md:flex">
            {navItems.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setActiveNav(id)}
                  className={`px-3 py-1.5 rounded text-sm transition-all ${activeNav===id?'text-white border-b-2 border-raceRed rounded-none':'text-zinc-400 hover:text-white'}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button className="md:hidden text-zinc-300" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen?<path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>:<path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>}
            </svg>
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 px-4 pb-4">
            {navItems.map(([id,label]) => (
              <a key={id} href={`#${id}`} onClick={() => {setActiveNav(id);setMenuOpen(false)}}
                className="block py-2 text-sm text-zinc-300 hover:text-raceRed">{label}</a>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 md:px-8">

        <Section id="accueil" title="">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-14 mb-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.2),transparent_55%)]"/>
            <div className="relative mb-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-raceRed">Saison 2026 · Nouvelle ère</p>
              <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">La <span className="text-raceRed">Formule 1</span><br/>à portée de main</h1>
              <p className="mb-8 max-w-xl text-zinc-400">Résultats, pilotes, histoire, live GP et calendrier — tout en un.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#live" className="rounded-xl bg-raceRed px-6 py-3 text-sm font-bold text-white hover:bg-red-700 uppercase tracking-wider transition-colors">🔴 Suivre le Live GP</a>
                <a href="#calendrier" className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-zinc-400 uppercase tracking-wider transition-colors">Calendrier 2026</a>
              </div>
            </div>
            <F1Car/>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {label:'Prochain GP', value:'Miami', sub:'3 Mai 2026'},
              {label:'Champion 2025', value:'L. Norris', sub:'McLaren'},
              {label:'Constructeurs 2025', value:'McLaren', sub:'Titre consécutif'},
              {label:'Vainqueur Australie', value:'G. Russell', sub:'Mercedes'},
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
                <span className="absolute -left-[1.45rem] top-5 h-3 w-3 rounded-full bg-raceRed ring-4 ring-zinc-950"/>
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
            {currentDrivers.map(driver => <DriverCard key={driver.num} driver={driver} onClick={setSelectedDriver}/>)}
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
                {champions.map((item,i) => (
                  <tr key={item.year} className={`border-t border-zinc-800 hover:bg-zinc-900/70 ${i===0?'bg-raceRed/5':''}`}>
                    <td className="px-5 py-3 font-bold text-raceRed">{item.year}</td>
                    <td className="px-5 py-3 font-semibold text-white">{i===0?'🏆 ':''}{item.champion}</td>
                    <td className="px-5 py-3 text-zinc-400">{item.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="actualites" title="Actualités F1">
          <div className="flex items-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full ${newsLoading?'bg-yellow-500 animate-pulse':'bg-green-500'}`}/>
            <span className="text-xs text-zinc-500">{newsLoading?'Chargement des news en temps réel...':'News en direct via Autosport · Mise à jour automatique'}</span>
          </div>
          {newsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 animate-pulse">
                  <div className="h-3 bg-zinc-700 rounded mb-3 w-16"/>
                  <div className="h-4 bg-zinc-700 rounded mb-2"/>
                  <div className="h-3 bg-zinc-800 rounded w-3/4"/>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveNews.map((item,i) => (
                <a key={i} href={item.link||'#'} target="_blank" rel="noopener noreferrer"
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-raceRed/40 transition-all cursor-pointer block">
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
                    <span className="h-2 w-2 rounded-full bg-raceRed animate-pulse"/>
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
                {liveOn?'En cours...':'Lancer le live'}
              </button>
              {liveOn && <button onClick={stopLive} className="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-400">Arrêter</button>}
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {liveIndex===0 && !liveOn ? (
                <p className="text-center text-sm text-zinc-600 py-8">Appuyez sur "Lancer le live" pour démarrer</p>
              ) : (
                liveFeed.slice(0, liveIndex+1).reverse().map((msg,idx) => (
                  <div key={idx} className={`rounded-xl px-4 py-2.5 text-sm border ${msg.event?'border-raceRed/30 bg-raceRed/5 text-white':'border-zinc-800 bg-black/30 text-zinc-300'}`}>
                    <span className="text-zinc-600 text-xs mr-2">Tour {msg.lap}</span>{msg.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        <Section id="calendrier" title="Calendrier 2026 — 22 Grands Prix">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendar.map((race,i) => (
              <article key={race.gp} className={`rounded-2xl border overflow-hidden transition-all ${race.status==='Prochain'?'border-raceRed shadow-lg shadow-red-900/20':race.status==='Terminé'?'border-zinc-800 opacity-60':'border-zinc-800 hover:border-zinc-600'}`}>
                <div className="relative bg-zinc-950" style={{height:'150px'}}>
                  <CircuitSVG gp={race.gp} status={race.status}/>
                  <div className="absolute top-2 left-2 bg-black/70 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-bold">R{i+1}</div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${race.status==='Prochain'?'bg-raceRed text-white':race.status==='Terminé'?'bg-zinc-700 text-zinc-400':'bg-zinc-800/80 text-zinc-400'}`}>
                      {race.status}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/80">
                  <h3 className="font-bold text-white text-sm">{race.gp}</h3>
                  <p className="text-xs text-zinc-500">{race.circuit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-zinc-400">{race.location}</p>
                    <p className="text-xs font-semibold text-zinc-300">{new Date(race.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
        F1Hub 2026 · React + Tailwind · News en direct via Autosport · Données vérifiées
      </footer>
    </div>
  )
}
