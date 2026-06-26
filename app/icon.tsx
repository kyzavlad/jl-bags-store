import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Dynamically generated favicon: the existing JL logo masked into a clean
 * circle (transparent corners) so the browser tab shows a round mark rather
 * than a square white image. Lightweight 64×64 PNG.
 */
export const runtime = 'nodejs'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  const logo = readFileSync(join(process.cwd(), 'public', 'logo.png'))
  const src = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={64}
          height={64}
          alt="JL"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>
    ),
    { ...size },
  )
}
