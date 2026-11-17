import { education, experience, profile, projects, skillGroups } from '../../data/profile';
import type { SectionId } from './sections';

function Chip({ children }: { children: string }) {
  return <span className="chip">{children}</span>;
}

function About() {
  return (
    <>
      <p className="eyebrow">The astronaut · About</p>
      <h2 className="panel-title">{profile.name}</h2>
      <p className="text-lg text-white/80">
        {profile.title} · {profile.location}
      </p>
      <p className="mt-5 leading-relaxed text-white/75">{profile.summary}</p>
      <p className="mt-3 leading-relaxed text-white/60">{profile.summaryExtra}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="btn btn--primary" href={`mailto:${profile.email}`}>Get in touch</a>
        <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </>
  );
}

function ExperiencePanel() {
  return (
    <>
      <p className="eyebrow">Planet 01 · Experience</p>
      <h2 className="panel-title">Career orbit</h2>
      <ol className="mt-6 space-y-6 border-l border-white/10 pl-5">
        {experience.map((job) => (
          <li key={job.company} className="relative">
            <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
            <p className="font-mono text-xs uppercase tracking-wider text-white/50">{job.period}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{job.company}</h3>
            <p className="text-sm text-white/70">
              {job.role} · {job.location}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{job.summary}</p>
            {job.highlights.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-white/60">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            {job.stack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}

function SkillsPanel() {
  return (
    <>
      <p className="eyebrow">Planet 02 · Skills</p>
      <h2 className="panel-title">What I work with</h2>
      <div className="mt-6 space-y-6">
        {skillGroups.map((g) => (
          <section key={g.title}>
            <h3 className="text-lg font-semibold text-white">{g.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">{g.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ProjectsPanel() {
  return (
    <>
      <p className="eyebrow">Planet 03 · Projects</p>
      <h2 className="panel-title">Things I've built</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="project-card group">
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-white/5">
              <img
                src={p.image}
                alt={`${p.name} screenshot`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 font-semibold text-white">
              {p.name} <span className="inline-block transition group-hover:translate-x-0.5">↗</span>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">{p.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

function EducationPanel() {
  return (
    <>
      <p className="eyebrow">Planet 04 · Education</p>
      <h2 className="panel-title">Where I learned</h2>
      <div className="mt-6 space-y-4">
        {education.map((e) => (
          <div key={e.school} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-white/50">{e.period}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{e.school}</h3>
            <p className="text-sm text-white/70">{e.degree}</p>
            <p className="mt-1 text-sm text-white/60">{e.field}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ContactPanel() {
  const items = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', value: 'linkedin.com/in/yavuzguloglu', href: profile.links.linkedin },
    { label: 'GitHub', value: 'github.com/YavuzGuloglu', href: profile.links.github },
  ];
  return (
    <>
      <p className="eyebrow">The ship · Contact</p>
      <h2 className="panel-title">Come aboard</h2>
      <p className="mt-3 leading-relaxed text-white/70">
        Open to interesting frontend work and good conversations. Reach out through any of these channels.
      </p>
      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <a
            key={i.label}
            href={i.href}
            target={i.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
            className="contact-row group"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-white/50">{i.label}</span>
            <span className="text-white group-hover:text-[var(--accent)]">{i.value}</span>
          </a>
        ))}
      </div>
    </>
  );
}

export function PanelContent({ id }: { id: SectionId }) {
  switch (id) {
    case 'about':
      return <About />;
    case 'experience':
      return <ExperiencePanel />;
    case 'skills':
      return <SkillsPanel />;
    case 'projects':
      return <ProjectsPanel />;
    case 'education':
      return <EducationPanel />;
    case 'contact':
      return <ContactPanel />;
  }
}
