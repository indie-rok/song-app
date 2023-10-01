import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>
        <Link href={'/onboarding/1'}>Start</Link>
      </h1>
    </div>
  )
}
