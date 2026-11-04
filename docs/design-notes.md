# Design implementation

Approved direction: warm, calm, attentive; cream and original navy, existing planet logo and portraits. Composition inspired by the first supplied Behance reference; warm secondary surfaces informed by the other two. No third-party reference images are reused.

The original wireframe's section order, contact destinations, pricing, and terms are retained. Spacing follows a 4px rhythm, surfaces use warm neutral steps, type pairs Georgia (Cyrillic display) with Arial, and controls use the original navy. Request cards, portrait-led introduction, numbered first-session steps, price panel, native FAQ, and navy contact section create different reading rhythms. Mobile prioritizes copy, price, and actions before photography. Hover/focus states and reduced-motion handling are included.

Assets are downloaded from the practitioner's existing Tilda site with user permission. No generated photographs, testimonials, or additional qualifications have been introduced.

Workflow guided by unslop by Damir Sokolovsky (@heydamir), CC BY 4.0: https://github.com/heydamir/unslop. Skill instructions and styles have not been copied into the product.

## Motion revision

Research reference: Webby Awards 2026, Best Use of Animation or Motion Graphics — Aether 1 (Webby Winner), The Spark (People's Voice Winner), Madar (nominee): https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics
Primary implementation case study: https://videinfra.com/work/madar — coherent scene sequencing and brand-specific motion. These sources informed the direction; the local effects are an original, quieter interpretation, not copied animation code or measured timing from those sites.

Replaced whole-section 480ms transitions with per-element Web Animations: text 1200ms, cards 1400ms with 70–120ms offsets, portrait 1800–2000ms, gentle scale settling and line drawing. Each element triggers at its own viewport position, avoiding premature reveals in long mobile sections. FAQ animates real opening/closing height in 600ms. Reduced-motion changes cancel running entrance animations and restore content. Native scrolling remains intact. Browser verification covered content visibility, FAQ open/close, mobile overflow, and console errors.
