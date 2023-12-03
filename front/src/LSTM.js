import * as cam from "@mediapipe/camera_utils";
import {FaceMesh} from "@mediapipe/face_mesh";
import React, {useEffect, useRef, useState} from "react";
import {angles_points, get_angle, selected_face_mesh_points_dict, target_names} from "./utils";
import * as tf from "@tensorflow/tfjs";

function LSTM() {
    const webcamRef = useRef(null);
    const [emotion, setEmotion] = useState('');
    let camera = null;
    const features_list = []
    const selected_face_mesh_angles = []
    let model;

    async function onResults(results) {
        if (results.multiFaceLandmarks[0] && model) {
            const face_landmark = results.multiFaceLandmarks[0]
            const features = []
            selected_face_mesh_angles.forEach(face_angel => {
                    features.push(get_angle(face_landmark[face_angel[0]], face_landmark[face_angel[1]], face_landmark[face_angel[2]]))
                }
            )
            features_list.push(features)
            while(features_list.length < 10){
                features_list.push(features)
            }
            if (features_list.length > 10){
                features_list.shift()
            }
            await model.predict(tf.tensor3d(features_list.flat(), [features_list.length, 17, 1])).data().then(res =>  {
                let fin = [0, 0, 0, 0, 0, 0]
                for (let i = 0; i < res.length; i++)
                    fin[i%6] += res[i]
                setEmotion(target_names[fin.indexOf(Math.max(...fin))])
            })
        }
    }
    async function loadModel(){
        model = await tf.loadLayersModel('http://localhost:3000/model/model.json')
        console.log("Model loaded")
    }
    useEffect(() => {
        loadModel();
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

export default LSTM;
