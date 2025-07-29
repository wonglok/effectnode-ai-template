import { useFrame } from '@react-three/fiber'
import { suspend } from 'suspend-react'
import { AnimationMixer, Bone, Object3D } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

export const useLoadFBXActions = ({ o3d, ...actionsMap }: any) => {
    const stuff = suspend(async () => {
        let all: any = []
        let actionsAPI: any = {}
        let mixer = new AnimationMixer(new Object3D())
        for (let key in actionsMap) {
            let url = actionsMap[key]
            const res = await fetch(url, {
                mode: 'cors',
            })
            let buffer = await res.arrayBuffer()

            let fbxLoader = new FBXLoader()
            let fbx = await fbxLoader.parse(buffer, '/')

            let action: any = mixer.clipAction(fbx.animations[0], fbx)

            actionsAPI[key] = action

            all.push({
                display: <primitive key={`_${fbx.uuid}`} object={fbx}></primitive>,
                fnc: (st: any) => {
                    mixer.setTime(st.clock.elapsedTime)

                    //
                    o3d.traverse((it: any) => {
                        if (it.isBone && action.canRun) {
                            //
                            let fbxBone = fbx.getObjectByName(it.name)

                            //
                            if (fbxBone) {
                                if (it.name.toLowerCase().includes('hips')) {
                                    it.quaternion.copy(fbxBone.quaternion)
                                } else {
                                    it.quaternion.copy(fbxBone.quaternion)
                                }
                            } else {
                            }
                        }
                    })
                    //
                },
            })
        }

        return {
            all,
            ...actionsAPI,
        }
    }, [o3d, Object.values(actionsMap).join('_')])

    useFrame((st, dt) => {
        stuff.all
            .map((r: any) => r.fnc)
            .forEach((work: (a: any, b: any) => void) => {
                work(st, dt)
            })
    })

    return stuff
}
