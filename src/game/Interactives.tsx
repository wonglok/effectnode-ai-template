import gsap from 'gsap'
import { useEffect, useState } from 'react'
import { Mesh } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { BVHEcctrlApi } from 'bvhecctrl'

export function Interactives({ sceneAPI, ecctrlRef }: { sceneAPI?: any; ecctrlRef?: { current: BVHEcctrlApi } | any }) {
    useEffect(() => {
        //

        let list: Mesh[] = []
        sceneAPI.glb.scene.traverse((it: Mesh) => {
            if (it.material) {
                //
                let object = it

                if (object.name.toLowerCase().includes('opendoor')) {
                    //
                    if (typeof object.userData.opened === 'undefined') {
                        object.userData.opened = true
                        object.userData.rotY = object.rotation.y
                    } else {
                        object.userData.opened = !object.userData.opened
                    }

                    list.push(it)
                }
            }
        })

        let tt = setInterval(() => {
            list.forEach((object) => {
                //
                if (ecctrlRef?.current) {
                    if (ecctrlRef?.current.group.position.distanceTo(object.position) <= 5) {
                        if (object.userData.opened !== true) {
                            object.userData.opened = true
                        }
                    } else {
                        if (object.userData.opened !== false) {
                            object.userData.opened = false
                        }
                    }

                    if (object.userData.lastOpen !== object.userData.opened) {
                        if (object.userData.opened) {
                            gsap.to(object.rotation, {
                                y: object.userData.rotY + Math.PI * 0.5 * -Math.sign(object.userData.rotY),
                            })
                        } else {
                            gsap.to(object.rotation, {
                                y: object.userData.rotY,
                            })
                        }
                    }
                }
            })
        }, 100)

        return () => {
            clearInterval(tt)
        }
    }, [ecctrlRef])

    return (
        <>
            <group
                key={sceneAPI.o3d.uuid}
                // onClick={(ev) => {
                //     let object = ev.object
                //     toggleOpenDoor({ object })
                // }}
            >
                {sceneAPI.display}
            </group>
        </>
    )
}

export const useCollider = ({ sceneAPI }: { sceneAPI?: any }) => {
    let [collider, setCollider] = useState<any>(false)

    useEffect(() => {
        let cloned = clone(sceneAPI.glb.scene)

        let removeList: any[] = []

        cloned.traverse((it: any) => {
            //
            if (it?.geometry && it.name.includes('door')) {
                it.visible = false
                removeList.push(it)
            }
        })

        removeList.forEach((it) => {
            it.removeFromParent()
        })

        let api = {
            o3d: cloned,
            show: <primitive object={cloned}></primitive>,
        }

        setCollider(api)
        return () => {
            setCollider(false)
        }
    }, [sceneAPI.glb.scene])

    return collider
}
