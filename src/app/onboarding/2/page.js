'use client'

import * as Tone from 'tone';
import useProgresionGenerator from '@/hooks/useProgresionGenerator'
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import * as css from './keyboard.module.css'
import * as cssProgression from '../1/progression.module.css'
import { useState, useRef } from 'react';
import { getChordIndex } from '@/utils/getChordIndex';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { pianoRef: pianoMelodyRef } = useProgresionGenerator()
    const { pianoRef: pianoBackgroundRef } = useProgresionGenerator()
    const router = useRouter()

    const [activeChord, setActiveChord] = useState(null)
    const partRef = useRef(null)


    function playProgression() {
        pianoBackgroundRef.current.volume.value = -12
        Tone.start()
        const progression = [
            ["0:0:0", ["C4", "E4", "G4"]],
            ["0:4:0", ["A4", "C5", "E5"]],
            ["0:8:0", ["F4", "A4", "C5"]],
            ["0:12:0", ["G4", "B4", "D5"]],
        ];

        const part = new Tone.Part((time, chord) => {
            pianoBackgroundRef.current.triggerAttackRelease(chord, "1n", time);

            Tone.Draw.schedule(function () {
                setActiveChord(getChordIndex(chord))
            }, time)
        }, progression);

        Tone.Transport.bpm.value = 180
        Tone.Transport.start()

        partRef.current = part
        part.loop = true;
        part.loopEnd = "0:16:0";  // Loop every bar
        part.start()
    }

    function play(note) {
        pianoMelodyRef.current.triggerAttackRelease(note, 0.75)
    }

    return (
        <>
            <Row>
                <h3>Melody is what makes your song complete</h3>

                <p>Press the Play button and then any of the white piano keys (it will sound good, I promise)</p>
                <Button onClick={playProgression}>Play</Button>
            </Row>

            <Row>
                <section className={cssProgression.progressionContainer}>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.red} ${activeChord === 0 ? cssProgression.active : ''} `}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.yellow} ${activeChord === 1 ? cssProgression.active : ''}`}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.blue} ${activeChord === 2 ? cssProgression.active : ''}`}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.green} ${activeChord === 3 ? cssProgression.active : ''}`}></div>
                </section>
            </Row>

            <ul className={css.keyboard}>
                <li className={css.white} onClick={() => play('C4')}></li>
                <li className={css.black} onClick={() => play('C#4')}></li>
                <li className={`${css.white} ${css.offset}`} onClick={() => play('D4')}></li>
                <li className={css.black} onClick={() => play('D#4')}></li>
                <li className={`${css.white} ${css.offset}`} onClick={() => play('E4')}></li>
                <li className={css.white} onClick={() => play('F4')}></li>
                <li className={css.black} onClick={() => play('F#4')}></li>
                <li className={`${css.white} ${css.offset}`} onClick={() => play('G4')}></li>
                <li className={css.black} onClick={() => play('G#4')}></li>
                <li className={`${css.white} ${css.offset}`} onClick={() => play('A4')}></li>
                <li className={css.black} onClick={() => play('A#4')}></li>
                <li className={`${css.white} ${css.offset}`} onClick={() => play('B4')}></li>
            </ul>

            <hr />

            <Row>
                <Col>
                    <p>However, most of songs you know, dont have only piano keys</p>
                    <p>They have a voice</p>
                    <p>Lets use your voice instead of piano keys</p>
                </Col>
            </Row>

            <Row>
                <Button onClick={() => {
                    if (partRef.current) {
                        partRef.current.stop()
                    }

                    router.push('/onboarding/3')
                }}>Use my voice</Button>
            </Row>
        </>
    )
}
