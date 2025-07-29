import { useEffect, useMemo, useState } from 'react'
import { suspend } from 'suspend-react'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import * as localforage from 'localforage'

export const glbCache = localforage.createInstance({
    name: 'glb-cache',
})

export const usePreloadGLB = ({ url }: { url: string }) => {
    let [status, setStatus] = useState('loading')
    useEffect(() => {
        let run = async () => {
            let buffer: any
            let cached = await glbCache.getItem(url)
            if (cached instanceof ArrayBuffer) {
                buffer = cached
                setStatus('ok')
            } else {
                const res = await fetch(url, {
                    mode: 'cors',
                })
                if (res.ok) {
                    buffer = await res.arrayBuffer()
                    await glbCache.setItem(url, buffer)
                    setStatus('ok')
                } else {
                    //
                    setStatus('failed')
                }
            }
        }
        run()
    }, [url])

    return { status }
}

export const useLoadGLB = ({
    enableCache = false,
    url = `/game-asset/scene/place1.glb`,
    clipNames = [],
}: {
    enableCache?: boolean
    url: string
    clipNames?: string[]
}) => {
    const stuff = suspend(async () => {
        let buffer: any

        if (enableCache) {
            let cached = await glbCache.getItem(url)
            if (cached instanceof ArrayBuffer) {
                buffer = cached

                setTimeout(async () => {
                    const res = await fetch(url, {
                        mode: 'cors',
                    })
                    buffer = await res.arrayBuffer()
                    await glbCache.setItem(url, buffer)
                })
            } else {
                const res = await fetch(url, {
                    mode: 'cors',
                })
                if (res.ok) {
                    buffer = await res.arrayBuffer()
                    await glbCache.setItem(url, buffer)
                } else {
                    //
                }
            }
        } else {
            const res = await fetch(url, {
                mode: 'cors',
            })

            if (res.ok) {
                buffer = await res.arrayBuffer()
            } else {
                //
            }
        }

        let draco = new DRACOLoader()
        draco.setDecoderPath(`/game-asset/draco/`)
        let gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(draco)
        let glb = await gltfLoader.parseAsync(buffer, '/')

        return {
            glb,
            o3d: glb.scene,
            firstClip: glb.animations[0],
            clips: glb.animations,
            display: <primitive object={glb.scene}></primitive>,
        }
    }, [url])

    let clipNamesMemo = useMemo(() => {
        return clipNames
    }, [])

    useEffect(() => {
        let glb = stuff?.glb
        if (!glb) {
            return
        }
        glb.animations = glb.animations.map((clip, idx) => {
            let newName = clipNamesMemo[idx]

            if (newName) {
                clip.name = newName
            }

            return clip
        })
    }, [stuff.glb, clipNamesMemo])

    return stuff
}
