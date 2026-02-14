"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TypewriterEffectProps {
    text: string;
    className?: string;
    delay?: number;
    margin?: string;
    cursorColor?: string;
}

export const TypewriterEffect = ({
    text,
    className,
    delay = 0,
    cursorColor = "#ff1493",
    margin = "0px",
}: TypewriterEffectProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: margin as any });

    useEffect(() => {
        if (isInView) {
            let i = 0;
            const startTyping = setTimeout(() => {
                const intervalId = setInterval(() => {
                    setDisplayedText(text.substring(0, i + 1));
                    i++;
                    if (i > text.length) {
                        clearInterval(intervalId);
                    }
                }, 50); // Typing speed
                return () => clearInterval(intervalId);
            }, delay * 1000);

            return () => clearTimeout(startTyping);
        }
    }, [isInView, text, delay]);

    return (
        <span ref={ref} className={className}>
            {displayedText}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                style={{ color: cursorColor, marginLeft: "2px" }}
            >
                |
            </motion.span>
        </span>
    );
};
