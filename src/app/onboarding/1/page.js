'use client'


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

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useRef, useState } from 'react';
import * as css from './progression.module.css'

const CHORDS = [
    ["C4", "E4", "G4"],
    ["A4", "C5", "E5"],
    ["F4", "A4", "C5"],
    ["G4", "B4", "D5"],
];

function getChordIndex(chord) {
    for (let i = 0; i < CHORDS.length; i++) {
        if (JSON.stringify(chord) === JSON.stringify(CHORDS[i])) {
            return i;
        }
    }
    return -1;  // Return -1 if chord is not found
}

export default function One() {
    const pianoBackgroundRef = useRef(null); // Initialize the reference
    const pianoMelodyRef = useRef(null); // Initialize the reference
    const [activeChord, setActiveChord] = useState(null)
    const [activePianoNote, setActivePianoNote] = useState(null)

    useEffect(() => {
        const pianoBackGround = new Tone.Sampler(
            { C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 },
            {
                onload: () => {
                    console.log('loaded');
                }
            }
        ).toDestination();

        const pianoMelody = new Tone.Sampler(
            { C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 },
            {
                onload: () => {
                    console.log('loaded');
                }
            }
        ).toDestination();

        pianoBackGround.volume.value = -12

        pianoBackgroundRef.current = pianoBackGround;
        pianoMelodyRef.current = pianoMelody;
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
                <Col>Learning Music is easy</Col>
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



        </>
    )
}
