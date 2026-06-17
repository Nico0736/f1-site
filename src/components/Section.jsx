export default function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <h2 className="section-title mb-6">{title}</h2>
      {children}
    </section>
  )
}
