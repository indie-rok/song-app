'use client'

import * as Tone from 'tone';
import * as cssProgression from '../1/progression.module.css'

import { createRef, useState } from "react";
import { Row, Button, Col } from "react-bootstrap"
import useProgresionGenerator from '@/hooks/useProgresionGenerator';
import { getChordIndex } from '@/utils/getChordIndex';

const MicRecorder = () => {
    const micRef = createRef(null);
    const recorderRef = createRef(null);
    const playerRef = createRef(null);
    const { pianoRef: pianoBackgroundRef } = useProgresionGenerator()
    const partRef = createRef(null)
    const [activeChord, setActiveChord] = useState(null)

    console.log('part', partRef)
    console.log("recorder", recorderRef)

    const startRecording = async () => {
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error("Microphone access denied:", err);
            return;
        }

        micRef.current = new Tone.UserMedia();

        try {
            await micRef.current.open();
            console.log("Microphone open!");

            recorderRef.current = new Tone.Recorder();
            micRef.current.connect(recorderRef.current);
            recorderRef.current.start();
            console.log("Recording started...");
        } catch (err) {
            console.error("Error opening microphone:", err);
        }
    };

    const handleRecord = () => {
        if (Tone.context.state !== 'running') {
            Tone.start().then(() => {
                startRecording();
            });
        } else {
            startRecording();
        }
    };

    const handleStopRecord = async () => {

        const buffer = await recorderRef.current.stop();
        console.log("Recording stopped.");

        let blobUrl = URL.createObjectURL(buffer);
        playerRef.current = new Tone.Player(blobUrl).toDestination();

        console.log("Playing back the recorded audio...");

        playerRef.current.onstop = () => {
            micRef.current.close();
            console.log("Microphone closed.");
        };
    }

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
        partRef.current.loop = true;
        partRef.current.loopEnd = "0:16:0";  // Loop every bar
        partRef.current.start()
    }

    function stopProgression() {
        partRef.current.stop()
    }

    return (
        <>
            <Row>
                <Col>
                    <Button onClick={() => {
                        playProgression()
                    }}>Play progression</Button>
                </Col>

                <Col>
                    <Button onClick={stopProgression}>Stop progression</Button>
                </Col>
            </Row>

            <Row>
                <section className={cssProgression.progressionContainer}>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.red} ${activeChord === 0 ? cssProgression.active : ''} `}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.yellow} ${activeChord === 1 ? cssProgression.active : ''}`}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.blue} ${activeChord === 2 ? cssProgression.active : ''}`}></div>
                    <div className={`${cssProgression.progressionElement} ${cssProgression.green} ${activeChord === 3 ? cssProgression.active : ''}`}></div>
                </section>
            </Row>


            <Row>
                <Col>
                    <Button onClick={() => {
                        handleRecord()
                    }}>Recording</Button>
                </Col>

                <Col>
                    <Button onClick={() => {
                        handleStopRecord()
                    }}>Stop</Button>
                </Col>

                <Button onClick={() => {
                    playProgression()
                    playerRef.current.start()
                }}>Play Record progression</Button>
            </Row>
        </>
    );
};

export default MicRecorder;

