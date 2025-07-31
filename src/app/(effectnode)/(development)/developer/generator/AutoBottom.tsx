import { useEffect, useRef } from "react";

export function AutoBottom({ text }: { text: string }) {
    let element = useRef<HTMLPreElement | null>(null);
    useEffect(() => {
        if (element.current) {
            (element.current as HTMLPreElement).innerText = text;
            (element.current as HTMLPreElement).scrollTop = 999999999;
        }
    }, [text]);
    return (
        <pre
            ref={element}
            className="p-3 bg-white w-full whitespace-pre-wrap h-64 rounded-xl overflow-y-auto border text-xs"
        ></pre>
    );
}
