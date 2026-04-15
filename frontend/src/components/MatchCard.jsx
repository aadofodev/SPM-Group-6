export default function MatchCard({ match }) {
  const { name, email, subjects, availability, subjectOverlap, availabilityOverlap } = match;

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.avatar}>{name.charAt(0)}</div>
        <div>
          <p style={s.name}>{name}</p>
          <p style={s.email}>{email}</p>
        </div>
      </div>

      <Section label="Subjects">
        {subjects.map(sub => (
          <Tag key={sub} text={sub} highlight={subjectOverlap.includes(sub)} />
        ))}
      </Section>

      <Section label="Availability">
        {availability.map(slot => (
          <Tag key={slot} text={slot} highlight={availabilityOverlap.includes(slot)} />
        ))}
      </Section>

      {(subjectOverlap.length > 0 || availabilityOverlap.length > 0) && (
        <p style={s.overlap}>
          {subjectOverlap.length} subject{subjectOverlap.length !== 1 ? 's' : ''} &amp;{' '}
          {availabilityOverlap.length} slot{availabilityOverlap.length !== 1 ? 's' : ''} in common
        </p>
      )}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>{children}</div>
    </div>
  );
}

function Tag({ text, highlight }) {
  return (
    <span style={{
      padding: '0.2rem 0.55rem',
      borderRadius: 20,
      fontSize: '0.78rem',
      background: highlight ? '#dbeafe' : '#f1f5f9',
      color:      highlight ? '#1d4ed8' : '#475569',
      fontWeight: highlight ? 600 : 400,
      border:     highlight ? '1px solid #bfdbfe' : '1px solid transparent',
    }}>
      {text}
    </span>
  );
}

const s = {
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '1.25rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  header: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: {
    width: 42, height: 42, borderRadius: '50%',
    background: '#3b5bdb', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', fontWeight: 700, flexShrink: 0,
  },
  name:  { margin: 0, fontWeight: 600, fontSize: '1rem', color: '#1e293b' },
  email: { margin: 0, fontSize: '0.8rem', color: '#94a3b8' },
  overlap: {
    margin: 0, fontSize: '0.8rem', color: '#16a34a',
    fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem',
  },
};
