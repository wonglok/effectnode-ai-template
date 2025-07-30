import { ButtonActionsAI } from "@/ai/ButtonActionsAI";
import { ButtonCodeAI } from "@/ai/ButtonCodeAI";
import { ButtonDatabaseAI } from "@/ai/ButtonDatabaseAI";
import { GameCanvas } from "@/game/GameCanvas";
export default function Home() {
    return (
        <div className="w-full h-full relative">
            <GameCanvas></GameCanvas>

            {/* <div className=" absolute bottom-0 left-0">
                <div>
                    <ButtonDatabaseAI></ButtonDatabaseAI>
                    <ButtonActionsAI></ButtonActionsAI>
                    <ButtonCodeAI></ButtonCodeAI>
                </div>
                <div>
                    <pre
                        id="scrollToBottom"
                        className="text-xs p-3 max-w-4xl overflow-y-auto bg-white h-96 whitespace-pre-wrap"
                    ></pre>
                </div>
            </div> */}
        </div>
    );
}
