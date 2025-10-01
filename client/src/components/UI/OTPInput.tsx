import React, { useRef, useState, useEffect } from "react";
import type { OTPInputProps } from "../../types/component";



const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value = "", onChange }) => {

    const [digits, setDigits] = useState<string[]>(() => new Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        const arr = new Array(length).fill("");
        value.split("").slice(0, length).forEach((ch, i) => (arr[i] = ch));
        setDigits(arr);
    }, [value, length]);

    const commit = (nextDigits: string[]) => {
        setDigits(nextDigits);
        onChange?.(nextDigits.join(""));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const raw = e.target.value;
        const char = raw.slice(-1); // only last typed char
        if (raw && !/^[0-9a-zA-Z]$/.test(char)) return;

        const next = [...digits];
        next[idx] = char;
        commit(next);

        if (char && idx < length - 1) {
            inputsRef.current[idx + 1]?.focus();
            inputsRef.current[idx + 1]?.select();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...digits];
            if (next[idx]) {
                next[idx] = "";
                commit(next);
            } else if (idx > 0) {
                inputsRef.current[idx - 1]?.focus();
                const prev = [...digits];
                prev[idx - 1] = "";
                commit(prev);
            }
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        if (!pasted) return;

        const chars = pasted.replace(/\s+/g, "").split("").slice(0, length);
        const next = new Array(length).fill("");
        for (let i = 0; i < chars.length; i++) {
            if (/^[0-9a-zA-Z]$/.test(chars[i])) next[i] = chars[i];
        }
        commit(next);

        const lastIndex = Math.min(chars.length, length) - 1;
        if (lastIndex >= 0) {
            inputsRef.current[lastIndex]?.focus();
            inputsRef.current[lastIndex]?.select();
        }
    };

    return (
        <div className="flex gap-2">
            {new Array(length).fill(0).map((_, i) => (
                <input
                    key={i}
                    ref={(el: any) => (inputsRef.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] ?? ""}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    className="w-12 h-12 bg-[#FCF5EB]
          border border-gray-300
          rounded-lg
          text-center
          mx-auto
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#29D369] 
          focus:border-[#29D369] 
          transition-all duration-200"
                />
            ))}
        </div>
    );
};

export default OTPInput;
