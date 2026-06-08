// src/components/ui/Card.jsx
export const Card = ({ children, title, subtitle, className = '' }) => {
  return (
    <div 
      className={`card-container ${className}`}
      style={{
        background: '#0f172a',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {(title || subtitle) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {title && <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc' }}>{title}</h2>}
          {subtitle && <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};