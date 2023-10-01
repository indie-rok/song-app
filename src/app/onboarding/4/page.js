'use client'

import * as Tone from 'tone';
import useProgresionGenerator from "@/hooks/useProgresionGenerator"
import { createRef } from "react";
import { Row, Button, Col } from "react-bootstrap"

const progression = [
    ["0:0:0", ["C4", "E4", "G4"]],
    ["0:4:0", ["A4", "C5", "E5"]],
    ["0:8:0", ["F4", "A4", "C5"]],
    ["0:12:0", ["G4", "B4", "D5"]],
];

export default function Page() {
    const { pianoRef: pianoBackgroundRef } = useProgresionGenerator()
    const partRef = createRef(null)
    const micRef = createRef(null)
    const recorderRef = createRef(null)
    const playerRef = createRef(null)

    function playProgression() {
        pianoBackgroundRef.current.volume.value = -16

        Tone.start()
        partRef.current = new Tone.Part((time, chord) => {
            pianoBackgroundRef.current.triggerAttackRelease(chord, "1n", time);

            Tone.Draw.schedule(function () {
                // setActiveChord(getChordIndex(chord))
            }, time)
        }, progression);

        Tone.Transport.bpm.value = 180
        Tone.Transport.start()

        partRef.current.loop = true;
        partRef.current.loopEnd = "0:16:0";  // Loop every bar
        partRef.current.start()
    }

    function stopProgression() {
        partRef.current.stop()
    }

    async function startRecord() {
        await Tone.start()
        playProgression()
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
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
    }

    async function stopRecord() {
        const buffer = await recorderRef.current.stop();
        stopProgression()

        let blobUrl = URL.createObjectURL(buffer);

        playerRef.current = new Tone.Player(blobUrl, () => {
            console.log("buffer loaded")
        }).toDestination();



        recorderRef.current.onstop = () => {
            micRef.current.close();
            console.log("Microphone closed.");
        };
    }

    async function playRecording() {
        await Tone.start()
        playerRef.current.start()
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
                <Col>
                    <Button onClick={() => {
                        startRecord()
                    }}>Record</Button>
                </Col>

                <Col>
                    <Button onClick={() => {
                        stopRecord()
                    }}>Stop Record</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button onClick={() => {
                        playRecording()
                        playProgression()
                    }}>Play Recording</Button>
                </Col>
            </Row>
        </>
    )
}
