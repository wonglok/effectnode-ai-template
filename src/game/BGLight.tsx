import { Environment } from '@react-three/drei'

export default function BGLight() {
    return (
        <>
            <Environment
                background
                backgroundBlurriness={1}
                environmentIntensity={1}
                files={[`/game-asset/hdr/brown_photostudio_02_1k.hdr`]}
            />

            {/* <directionalLight
                castShadow
                color={'#FFFFED'}
                intensity={1.5}
                shadow-bias={-0.0001}
                position={[10, 20, 10]}
            >
                <orthographicCamera attach='shadow-camera' args={[-20, 20, 20, -20]} />
            </directionalLight> */}
        </>
    )
}
