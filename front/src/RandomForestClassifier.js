import * as cam from "@mediapipe/camera_utils";
import {FaceMesh} from "@mediapipe/face_mesh";
import React, {useEffect, useRef, useState} from "react";
import data from "./model.json"
import {RandomForestClassifier as RFClassifier} from 'ml-random-forest';
import {angles_points, get_angle, selected_face_mesh_points_dict, target_names} from "./utils";

function RandomForestClassifier() {
    const webcamRef = useRef(null);
    const [emotion, setEmotion] = useState('');
    let camera = null;
    const selected_face_mesh_angles = []
    let rf;

    async function onResults(results) {
        if (results.multiFaceLandmarks[0]) {
            const face_landmark = results.multiFaceLandmarks[0]
            const features = []
            selected_face_mesh_angles.forEach(face_angel => {
                    features.push(get_angle(face_landmark[face_angel[0]], face_landmark[face_angel[1]], face_landmark[face_angel[2]]))
                }
            )
            setEmotion(target_names[rf.predict([features])[0]])
        }
    }
    useEffect(() => {
        rf = RFClassifier.load(data)
        angles_points.forEach(x => {
            selected_face_mesh_angles.push([selected_face_mesh_points_dict[x[0]], selected_face_mesh_points_dict[x[1]],
                selected_face_mesh_points_dict[x[2]]])
        })

        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        faceMesh.onResults(onResults);
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            camera = new cam.Camera(webcamRef.current, {
                onFrame: async () => {
                    if( Math.floor(Math.random() * 200) > 180) {
                        await faceMesh.send({image: webcamRef.current});
                    }
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
        return () => {
            camera.stop()
        }
    }, []);

    return (
        <div className="App">
            <video ref={webcamRef}/>
            <p>Recognized emotion: {emotion}</p>
        </div>
    );
}

export default RandomForestClassifier;
