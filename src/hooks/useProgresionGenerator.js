import { useEffect, useRef } from 'react'
import * as Tone from 'tone';
import C4 from '/public/piano/C4.mp3'
import D4 from '/public/piano/D4.mp3'
import E4 from '/public/piano/E4.mp3'
import F4 from '/public/piano/F4.mp3'
import G4 from '/public/piano/G4.mp3'
import A4 from '/public/piano/A4.mp3'
import B4 from '/public/piano/B4.mp3'
import C5 from '/public/piano/C5.mp3'
import D5 from '/public/piano/D5.mp3'
import E5 from '/public/piano/E5.mp3'

export default function useProgresionGenerator(props) {
    const pianoRef = useRef(null);

    useEffect(() => {
        const piano = new Tone.Sampler(
            { C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 },
            {
                onload: () => {
                    console.log('loaded');
                    // piano.volume.value = props.volume || -1;
                }
            }
        ).toDestination();

        pianoRef.current = piano
    }, [])

    return {
        pianoRef
    }
}
