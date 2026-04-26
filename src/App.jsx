import { useEffect, useMemo, useState } from 'react'
import Section from './components/Section'
import { calendar, champions, currentDrivers, historyMilestones, news } from './components/data'

const navItems = [
  ['accueil', 'Accueil'],
  ['histoire', 'Histoire de la F1'],
  ['pilotes', 'Pilotes actuels'],
  ['champions', 'Derniers champions du monde'],
  ['actualites', 'Actualités'],
  ['live', 'Live GP'],
  ['calendrier', 'Calendrier']
]

const liveFeed = [
  'Tour 12: dépassement à l’extérieur dans le secteur 1.',
  'Tour 18: arrêt éclair de 2.2s au stand pour la voiture #16.',
  'Tour 24: drapeau jaune, débris signalés virage 7.',
  'Tour 31: bataille DRS intense pour la 3e place.',
  'Tour 44: le leader augmente l’écart de +1.8s.'
]

function formatRaceDate(input) {
  return new Date(input).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function App() {
  const [liveOn, setLiveOn] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!liveOn) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % liveFeed.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [liveOn])

  const visibleFeed = useMemo(() => {
    const start = Math.max(0, index - 2)
    return liveFeed.slice(start, index + 1)
  }, [index])

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#accueil" className="text-sm font-black uppercase tracking-[0.2em] text-raceRed">Formula 1 Hub</a>
          <ul className="hidden gap-5 md:flex">
            {navItems.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-sm text-zinc-200 transition hover:text-raceRed">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8">
        <Section id="accueil" title="Accueil">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="card">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-raceRed">Plateforme immersive</p>
              <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">Toute la F1 dans une expérience moderne et premium.</h1>
              <p className="max-w-2xl text-zinc-300">Suivez l’histoire, les pilotes, les news et les courses live dans une interface optimisée mobile, tablette et desktop.</p>
            </div>
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,6,0,0.35),transparent_45%)]" />
              <div className="relative animate-drift">
                <div className="h-8 w-44 rounded-full bg-raceRed shadow-neon" />
                <div className="mx-auto -mt-2 h-4 w-20 rounded-full bg-zinc-200/80" />
                <div className="mt-3 flex justify-between px-3">
                  <span className="h-6 w-6 rounded-full bg-zinc-800 ring-2 ring-zinc-500" />
                  <span className="h-6 w-6 rounded-full bg-zinc-800 ring-2 ring-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="histoire" title="Histoire de la F1">
          <div className="space-y-4 border-l border-zinc-700 pl-4 md:pl-8">
            {historyMilestones.map((item) => (
              <div key={item.year} className="relative card">
                <span className="absolute -left-[1.6rem] top-6 h-3 w-3 rounded-full bg-raceRed md:-left-[2.1rem]" />
                <p className="text-sm font-bold text-raceRed">{item.year}</p>
                <p className="text-zinc-300">{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="pilotes" title="Pilotes actuels">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentDrivers.map((driver) => (
              <article key={driver.name} className="card">
                <h3 className="text-lg font-semibold">{driver.name}</h3>
                <p className="mt-2 text-sm text-zinc-300">Équipe: <span className="text-zinc-100">{driver.team}</span></p>
                <p className="text-sm text-zinc-300">Nationalité: <span className="text-zinc-100">{driver.country}</span></p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="champions" title="Derniers champions du monde">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Année</th>
                  <th className="px-4 py-3">Champion</th>
                  <th className="px-4 py-3">Équipe</th>
                </tr>
              </thead>
              <tbody>
                {champions.map((item) => (
                  <tr key={item.year} className="border-t border-zinc-800 hover:bg-zinc-900/70">
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3">{item.champion}</td>
                    <td className="px-4 py-3">{item.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="actualites" title="Actualités">
          <div className="grid gap-4 md:grid-cols-3">
            {news.map((item) => (
              <article key={item.title} className="card">
                <p className="text-xs uppercase tracking-wider text-raceRed">{item.category}</p>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.snippet}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="live" title="Live GP">
          <div className="card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-300">Commentaires simulés en direct.</p>
              <button
                type="button"
                onClick={() => setLiveOn((prev) => !prev)}
                className="rounded-xl border border-raceRed/80 px-4 py-2 text-sm font-semibold transition hover:bg-raceRed hover:text-white"
              >
                {liveOn ? 'Désactiver le live' : 'Activer le live'}
              </button>
            </div>

            <div className="space-y-2">
              {(liveOn ? visibleFeed : liveFeed.slice(0, 3)).map((line, idx) => (
                <p key={`${line}-${idx}`} className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-200">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Section>

        <Section id="calendrier" title="Calendrier">
          <div className="grid gap-4 lg:grid-cols-2">
            {calendar.map((race) => (
              <article key={race.gp} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{race.gp}</h3>
                    <p className="text-sm text-zinc-300">{race.circuit}</p>
                  </div>
                  <span className="rounded-full bg-raceRed/20 px-3 py-1 text-xs text-raceRed">{race.status}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-200">{formatRaceDate(race.date)}</p>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
