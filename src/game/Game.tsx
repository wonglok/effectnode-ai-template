"use client";

import {
    Bvh,
    CameraControls,
    KeyboardControls,
    Stats,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import BVHEcctrl, {
    StaticCollider,
    useEcctrlStore,
    type BVHEcctrlApi,
    type StoreState,
} from "bvhecctrl";
import { useControls, button } from "leva";
import { useEffect, useRef } from "react";
import BGLight from "./BGLight";
import { useLoadGLB } from "./useLoadGLB";
import { useLoadFBXActions } from "./useLoadFBXActions";
import { useGame } from "./useGame";
import { Spherical, Vector3 } from "three";
import { Interactives, useCollider } from "./Interactives";

// import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
// import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

export interface GameInterface {
    avatarURL?: string;
    placeURL?: string;
}

export function Game({
    avatarURL = `/game-asset/rpm/fixed/679c45da957a862494f59eb6.glb`,
    placeURL = `/game-asset/scene/church_5.glb`,
    ...props
}: GameInterface) {
    return (
        <>
            <Bvh enabled={true} firstHitOnly>
                <GameCore
                    avatarURL={avatarURL}
                    placeURL={placeURL}
                    {...props}
                ></GameCore>
            </Bvh>
        </>
    );
}
export function GameCore({
    avatarURL = `/game-asset/rpm/fixed/679c45da957a862494f59eb6.glb`,
    placeURL = `/game-asset/scene/church_5.glb`,
}: GameInterface) {
    //

    const characterAPI = useLoadGLB({
        enableCache: false,
        url: avatarURL,
    });

    const sceneAPI = useLoadGLB({
        enableCache: !(process.env.NODE_ENV === "development"),
        //
        // url: `/scene/church_5.glb`,
        // url: `/scene/compress/s1.glb`,
        //

        url: placeURL,
    });

    const actions = useLoadFBXActions({
        o3d: characterAPI.o3d,
        run: `/game-asset/motion-files/rpm-avatar-motion/masculine/fbx/locomotion/M_Jog_001.fbx`,
        jump: `/game-asset/motion-files/rpm-avatar-motion/masculine/fbx/locomotion/M_Jog_Jump_002.fbx`,
        walk: `/game-asset/motion-files/rpm-avatar-motion/masculine/fbx/locomotion/M_Walk_001.fbx`,
        idle: `/game-asset/motion-files/rpm-avatar-motion/masculine/fbx/idle/M_Standing_Idle_001.fbx`,
    });

    const collider = useCollider({ sceneAPI: sceneAPI });

    const ecctrlRef = useRef<BVHEcctrlApi | null>(null);
    const camControlRef = useRef<CameraControls | null>(null);
    const colliderMeshesArray = useEcctrlStore(
        (state: StoreState) => state.colliderMeshesArray
    );

    const gl = useThree((r) => r.gl);

    useEffect(() => {
        let clean = () => {};

        import("nipplejs").then((nip) => {
            // type options = {
            //     zone?: Element // active zone
            //     color?: String
            //     size?: Number
            //     threshold?: Number // before triggering a directional event
            //     fadeTime?: Number // transition time
            //     multitouch?: Boolean
            //     maxNumberOfNipples?: Number // when multitouch, what is too many?
            //     dataOnly?: Boolean // no dom element whatsoever
            //     position?: Object // preset position for 'static' mode
            //     mode?: String // 'dynamic', 'static' or 'semi'
            //     restJoystick?: Boolean | Object // Re-center joystick on rest state
            //     restOpacity?: Number // opacity when not 'dynamic' and rested
            //     lockX?: Boolean // only move on the X axis
            //     lockY?: Boolean // only move on the Y axis
            //     catchDistance?: Number // distance to recycle previous joystick in
            //     // 'semi' mode
            //     shape?: String // 'circle' or 'square'
            //     dynamicPage?: Boolean // Enable if the page has dynamically visible elements
            //     follow?: Boolean // Makes the joystick follow the thumbstick
            // }

            let parent = document.body;
            let zone = document.createElement("div");

            parent?.appendChild(zone);

            let apply = (zone: HTMLDivElement) => {
                zone.style.position = "absolute";
                zone.style.zIndex = "1000";
                zone.style.bottom = "20px";
                zone.style.left = `${window.innerWidth / 2 - 150 / 2}px`;
                zone.style.backgroundColor = "transparent";
                zone.style.width = "150px";
                zone.style.height = "150px";

                if (window.innerWidth <= 500) {
                    zone.style.width = "100px";
                    zone.style.height = "100px";
                    zone.style.left = `${window.innerWidth / 2 - 100 / 2}px`;
                }

                zone.style.backgroundSize = "cover";
                zone.style.backgroundImage = `url(/game-asset/joystick/joystick.svg)`;

                zone.style.touchAction = "manipulation";
            };

            apply(zone);

            let hh = () => {
                apply(zone);
            };
            window.addEventListener("resize", hh);

            let inst = nip.create({
                zone: zone,
                dynamicPage: true,
                mode: "dynamic",
                multitouch: true,
            });

            let sph = new Spherical();
            inst.on("move", (ev, data) => {
                //
                // console.log(ev, data.vector)
                //

                if (ecctrlRef?.current) {
                    camControlRef?.current?.getSpherical(sph, true);

                    // v3.set(data.vector.x, 0, -data.vector.y)
                    // v3.applyAxisAngle(yAxis, sph.theta)
                    // v3.multiplyScalar(0.25)

                    ecctrlRef.current.setMovement({
                        joystick: {
                            x: data.vector.x,
                            y: data.vector.y,
                        },
                    });

                    //
                }
            });

            //

            inst.on("added", (ev, data) => {
                //
                if (ecctrlRef?.current) {
                    ecctrlRef.current.setMovement({
                        forward: true,
                        run: true,
                    });

                    actions.idle.reset().stop();
                    actions.idle.canRun = false;
                    actions.walk.reset().stop();
                    actions.walk.canRun = false;
                    actions.run.reset().play();
                    actions.run.canRun = true;
                }
                //
            });

            inst.on("end", () => {
                if (ecctrlRef?.current) {
                    ecctrlRef.current.setMovement({
                        forward: false,
                        run: false,
                        joystick: {
                            x: 0,
                            y: 0,
                        },
                    });

                    actions.idle.reset().play();
                    actions.idle.canRun = true;
                    actions.run.reset().stop();
                    actions.run.canRun = false;
                    actions.walk.reset().stop();
                    actions.walk.canRun = false;
                }
            });

            clean = () => {
                window.removeEventListener("resize", hh);
                inst.destroy();
                zone.remove();
            };
        });

        return () => {
            clean();
        };
    }, [gl]);

    useControls("Character Control", {
        ResetPlayer: button(() => {
            ecctrlRef.current?.group?.position.set(0, 2, 0);
            ecctrlRef.current?.resetLinVel();
        }),
    });

    /**
     * Keyboard control preset
     */
    const keyboardMap = [
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
    ];

    useFrame((st) => {
        st.camera.near = 1;
        st.camera.far = 500;
        st.camera.updateProjectionMatrix();

        //
        if (
            ecctrlRef.current &&
            ecctrlRef.current.group &&
            camControlRef.current
        ) {
            camControlRef.current.moveTo(
                ecctrlRef.current.group.position.x,
                ecctrlRef.current.group.position.y + 0.3,
                ecctrlRef.current.group.position.z,
                true
            );
        }
    });

    useEffect(() => {
        if (
            ecctrlRef.current &&
            ecctrlRef.current.group &&
            camControlRef.current
        ) {
            ecctrlRef?.current?.group?.position.set(0, 2.5, 0);
            ecctrlRef?.current?.resetLinVel();
            ecctrlRef?.current?.setLinVel(new Vector3(0, 2.5, 0));
            //

            camControlRef.current.setPosition(0, 5, 5);
            camControlRef.current.moveTo(
                ecctrlRef.current.group.position.x,
                ecctrlRef.current.group.position.y + 0.3,
                ecctrlRef.current.group.position.z,
                true
            );
        }
    }, [sceneAPI, actions, placeURL, avatarURL]);

    useEffect(() => {
        actions.idle.reset().play();
        actions.idle.canRun = true;
        setTimeout(() => {
            useGame.setState({
                keyboard: {
                    forward: false,
                    backward: false,
                    leftward: false,
                    rightward: false,
                    jump: false,
                    run: false,
                },
            });
        });

        let walkRun = (now: any) => {
            actions.idle.reset().stop();
            actions.idle.canRun = false;
            actions.jump.reset().stop();
            actions.jump.canRun = false;

            if (now?.keyboard?.run) {
                actions.run.reset().play();
                actions.run.canRun = true;
                actions.walk.reset().stop();
                actions.walk.canRun = false;
            } else {
                actions.walk.reset().play();
                actions.walk.canRun = true;
                actions.run.reset().stop();
                actions.run.canRun = false;
            }
        };

        return useGame.subscribe((now, before) => {
            //

            if (now?.keyboard || before?.keyboard) {
                if (
                    now?.keyboard?.forward !== before?.keyboard?.forward ||
                    now?.keyboard?.run !== before?.keyboard?.run
                ) {
                    if (now?.keyboard?.forward) {
                        walkRun(now);
                    }
                }

                if (
                    now?.keyboard?.backward !== before?.keyboard?.backward ||
                    now?.keyboard?.run !== before?.keyboard?.run
                ) {
                    if (now?.keyboard?.backward) {
                        walkRun(now);
                    }
                }

                if (
                    now?.keyboard?.leftward !== before?.keyboard?.leftward ||
                    now?.keyboard?.run !== before?.keyboard?.run
                ) {
                    if (now?.keyboard?.leftward) {
                        walkRun(now);
                    }
                }

                if (
                    now?.keyboard?.rightward !== before?.keyboard?.rightward ||
                    now?.keyboard?.run !== before?.keyboard?.run
                ) {
                    if (now?.keyboard?.rightward) {
                        walkRun(now);
                    }
                }

                if (now?.keyboard?.jump) {
                    actions.jump.canRun = false;
                    actions.walk.canRun = false;
                    actions.run.canRun = false;

                    actions.walk.reset().stop();
                    actions.run.reset().stop();
                    actions.jump.reset().stop();

                    actions.idle.canRun = false;
                    actions.idle.stop();

                    actions.jump.reset().play();
                    actions.jump.canRun = true;
                }

                if (
                    !now?.keyboard?.forward &&
                    !now?.keyboard?.backward &&
                    !now?.keyboard?.leftward &&
                    !now?.keyboard?.rightward &&
                    !now?.keyboard?.shift &&
                    !now?.keyboard?.jump
                ) {
                    actions.jump.canRun = false;
                    actions.walk.canRun = false;
                    actions.run.canRun = false;

                    actions.walk.reset().stop();
                    actions.run.reset().stop();
                    actions.jump.reset().stop();

                    actions.idle.canRun = true;
                    actions.idle.play();
                }

                if (!now?.keyboard?.jump && before?.keyboard?.jump) {
                    actions.jump.reset().stop();
                    actions.jump.canRun = false;
                }

                if (!now?.keyboard?.jump) {
                    actions.jump.reset().stop();
                    actions.jump.canRun = false;

                    if (
                        now?.keyboard?.forward ||
                        now?.keyboard?.backward ||
                        now?.keyboard?.leftward ||
                        now?.keyboard?.rightward
                    ) {
                        walkRun(now);
                    }
                }
            }
        });
    }, []);

    let camera = useThree((r) => r.camera);
    useEffect(() => {
        if (camera) {
            (camera as any).fov = 76;
            camera.updateProjectionMatrix();
        }
    }, [camera]);
    return (
        <>
            <Stats />

            <BGLight />

            <CameraControls
                key={sceneAPI.o3d.uuid + "camera"}
                ref={camControlRef}
                colliderMeshes={colliderMeshesArray}
                maxDistance={50}
                smoothTime={0.1}
                minDistance={2}
                makeDefault
            />

            {actions.all.map((r: any) => r.display)}

            {sceneAPI && collider && (
                <>
                    <Interactives
                        key={sceneAPI.o3d.uuid}
                        ecctrlRef={ecctrlRef}
                        sceneAPI={sceneAPI}
                    ></Interactives>

                    <StaticCollider key={collider.o3d.uuid}>
                        <group visible={false}>
                            <>{collider.show}</>
                        </group>
                    </StaticCollider>
                </>
            )}

            {characterAPI && sceneAPI && (
                <>
                    <KeyboardControls
                        onChange={(name, activated, state) => {
                            useGame.setState({
                                keyboard: state,
                            });
                        }}
                        map={keyboardMap}
                    >
                        <BVHEcctrl
                            ref={ecctrlRef}
                            delay={0}
                            position={[0, 0.3, 0]}
                        >
                            <group position={[0, -1.0 + 0.2, 0]}>
                                {characterAPI.display}
                            </group>
                        </BVHEcctrl>
                    </KeyboardControls>
                </>
            )}

            {/* Map */}
        </>
    );
}
