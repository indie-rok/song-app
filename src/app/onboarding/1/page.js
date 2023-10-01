'use client'

import { useRouter } from 'next/navigation';
import * as Tone from 'tone';
import Form from 'react-bootstrap/Form';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useRef, useState } from 'react';
import * as css from './progression.module.css'
import useProgresionGenerator from '@/hooks/useProgresionGenerator';
import { getChordIndex } from '@/utils/getChordIndex';

export default function One() {
    const { pianoRef: pianoMelodyRef } = useProgresionGenerator()
    const { pianoRef: pianoBackgroundRef } = useProgresionGenerator()
    const [activeChord, setActiveChord] = useState(null)
    const [activePianoNote, setActivePianoNote] = useState(null)
    const partRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        pianoBackgroundRef.current.volume.value = -12
    }, []);

    function playProgression() {
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
                <Col>
                    <h1>Learning SongWritting is easy</h1>
                    <p>Click the play button and write below what do you think about this notes</p>
                </Col>
            </Row>

            <Row>
                <Button onClick={playProgression}>Play try</Button>
            </Row>

            <Row>
                <section className={css.progressionContainer}>
                    <div className={`${css.progressionElement} ${css.red} ${activeChord === 0 ? css.active : ''} `}></div>
                    <div className={`${css.progressionElement} ${css.yellow} ${activeChord === 1 ? css.active : ''}`}></div>
                    <div className={`${css.progressionElement} ${css.blue} ${activeChord === 2 ? css.active : ''}`}></div>
                    <div className={`${css.progressionElement} ${css.green} ${activeChord === 3 ? css.active : ''}`}></div>
                </section>
            </Row>

            <hr />

            <Row>
                <Form.Group className="mb-3" controlId="text">
                    <Form.Control as="textarea"
                        required
                        type="text"
                        placeholder="write here"
                    />
                </Form.Group>
            </Row>

            <hr></hr>

            <Row>
                <Col>
                    <p>How ever, it stills feel a bit empty...</p>
                    <p>Maybe we can add melody?</p>
                </Col>
            </Row>

            <Row>
                <Button onClick={() => {
                    if (partRef.current) {
                        partRef.current.stop()
                    }

                    router.push('/onboarding/2')
                }}>Add Melody</Button>
            </Row>
        </>
    )
}
