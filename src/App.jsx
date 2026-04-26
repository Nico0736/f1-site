import { useEffect, useMemo, useState } from 'react'
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
  { lap: 1,  text: '🚦 Feux rouges éteints — DÉPART !', event: true },
  { lap: 4,  text: 'Norris prend la tête devant Piastri au virage 1.', event: false },
  { lap: 8,  text: 'Verstappen remonte de la 4e à la 2e place.', event: false },
  { lap: 12, text: '🟡 DRAPEAU JAUNE — débris signalés virage 7.', event: true },
  { lap: 18, text: 'Pit stop éclair pour Leclerc — 2.4s, pneus mediums.', event: false },
  { lap: 24, text: '🚗 SAFETY CAR déployée — incident en fond de grille.', event: true },
  { lap: 28, text: "Reprise de course ! Norris leader avec 1.2s d'avance.", event: false },
  { lap: 33, text: 'DRS activé — Hamilton attaque Alonso pour la 5e place.', event: false },
  { lap: 40, text: 'Tour rapide de Piastri — 1:27.891 🔴', event: false },
  { lap: 51, text: 'Verstappen aux stands en urgence — crevaison lente.', event: true },
  { lap: 57, text: '🏁 DRAPEAU À DAMIER — Norris remporte le GP de Miami !', event: true },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('accueil')
  const [liveOn, setLiveOn] = useState(false)
  const [liveIndex, setLiveIndex] = useState(0)
  const [lap, setLap] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!liveOn) return
    const timer = setInterval(() => {
      setLiveIndex((prev) => {
        if (prev >= liveFeed.length - 1) { setLiveOn(false); return prev }
        return prev + 1
      })
      setLap((prev) => Math.min(prev + 2, 57))
    }, 2200)
    return () => clearInterval(timer)
  }, [liveOn])

  const startLive = () => { setLiveIndex(0); setLap(0); setLiveOn(true) }
  const visibleFeed = useMemo(() => liveFeed.slice(0, liveIndex + 1).reverse(), [liveIndex])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b-2 border-raceRed bg-black/90 backdrop-blur-md">
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
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-14 mb-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.25),transparent_60%)]" />
            <div className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-raceRed">Saison 2026</p>
              <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">La <span className="text-raceRed">Formule 1</span><br />à portée de main</h1>
              <p className="mb-8 max-w-xl text-zinc-400">Résultats, pilotes, histoire, live GP et calendrier — tout en un.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#live" className="rounded-xl bg-raceRed px-6 py-3 text-sm font-bold text-white hover:bg-red-700 uppercase tracking-wider">Suivre le Live GP</a>
                <a href="#calendrier" className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-bold text-zinc-200 hover:border-zinc-400 uppercase tracking-wider">Calendrier 2026</a>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Prochain GP', value: 'Miami', sub: '4 Mai 2026' },
              { label: 'Leader championnat', value: 'L. Norris', sub: 'McLaren · 94 pts' },
              { label: 'Constructeurs', value: 'McLaren', sub: '168 pts · 1er' },
              { label: 'Dernier vainqueur', value: 'O. Piastri', sub: 'GP de Chine' },
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

        <Section id="pilotes" title="Pilotes 2026">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentDrivers.map((driver) => (
              <article key={driver.name} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-raceRed/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-raceRed/10 border border-raceRed/20">
                    <span className="text-xs font-black text-raceRed">#{driver.number ?? driver.num ?? '?'}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{driver.name}</h3>
                    <p className="text-xs text-zinc-500">{driver.country}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 bg-zinc-800/50 rounded-lg px-3 py-1.5">{driver.team}</p>
              </article>
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
                <button onClick={() => setLiveOn(false)}
                  className="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-400">
                  Pause
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {liveIndex === 0 && !liveOn ? (
                <p className="text-center text-sm text-zinc-600 py-8">Appuyez sur "Lancer le live" pour démarrer</p>
              ) : (
                visibleFeed.map((msg, idx) => (
                  <div key={idx} className={`rounded-xl px-4 py-2.5 text-sm border ${msg.event ? 'border-raceRed/30 bg-raceRed/5 text-white' : 'border-zinc-800 bg-black/30 text-zinc-300'}`}>
                    <span className="text-zinc-600 text-xs mr-2">Tour {msg.lap}</span>{msg.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        <Section id="calendrier" title="Calendrier 2026">
          <div className="grid gap-3 lg:grid-cols-2">
            {calendar.map((race, i) => (
              <article key={race.gp} className={`rounded-2xl border p-4 flex items-center gap-4 transition-all ${race.status === 'Prochain' ? 'border-raceRed bg-raceRed/5' : race.status === 'Terminé' ? 'border-zinc-800 bg-zinc-900/30 opacity-60' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-xs font-black text-zinc-400 flex-shrink-0">R{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{race.gp}</h3>
                  <p className="text-xs text-zinc-500 truncate">{race.circuit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-zinc-400 mb-1">{new Date(race.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${race.status === 'Prochain' ? 'bg-raceRed text-white' : race.status === 'Terminé' ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-800 text-zinc-400'}`}>{race.status}</span>
                </div>
              </article>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-600">
        F1Hub 2026 · Construit avec React + Tailwind
      </footer>
    </div>
  )
}
