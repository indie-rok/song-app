'use client'

import useProgresionGenerator from '@/hooks/useProgresionGenerator'
import React from 'react'

export default function Page() {
    const { pianoRef: pianoMelodyRef } = useProgresionGenerator()
    return (
        <div>Page
            <button onClick={() => {
                pianoMelodyRef.current.triggerAttackRelease("C4", 2)
            }}>Press</button>
        </div>
    )
}
