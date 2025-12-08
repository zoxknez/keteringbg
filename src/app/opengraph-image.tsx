import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Ketering Beograd - Ekskluzivni Ketering za Proslave'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
              }}
            />
            <span
              style={{
                fontSize: '18px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#a3a3a3',
              }}
            >
              Premium Ketering · Beograd
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '90px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1,
              marginBottom: '20px',
              fontFamily: 'serif',
            }}
          >
            Savršen
          </div>
          <div
            style={{
              fontSize: '90px',
              fontWeight: 'bold',
              fontStyle: 'italic',
              color: '#f59e0b',
              lineHeight: 1,
              marginBottom: '40px',
              fontFamily: 'serif',
            }}
          >
            Ukus
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#a3a3a3',
              maxWidth: '800px',
            }}
          >
            Ekskluzivni ketering za korporativne događaje i nezaboravne proslave
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            color: '#737373',
            fontSize: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>500+ Događaja</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>10+ Godina Iskustva</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>www.keteringbeo.rs</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
