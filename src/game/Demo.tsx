"use client";
import { Game } from "@/game/Game";
import { Canvas } from "@react-three/fiber";

export function Demo() {
    return (
        <>
            <Canvas>
                <Game avatarURL="/game-asset/rpm/fixed/lady2.glb"></Game>
            </Canvas>
        </>
    );
}
