"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface Suggestion {
    id: string;
    display: string;
}

interface MentionTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    fetchUsers?: (query: string) => Promise<Suggestion[]>;
    minHeight?: number;
    className?: string;
}

export function MentionTextarea({
    value,
    onChange,
    placeholder = "Write a caption…",
    fetchUsers,
    minHeight = 120,
    className = "",
}: MentionTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [triggerType, setTriggerType] = useState<"@" | "#" | null>(null);
    const [queryStart, setQueryStart] = useState(0);
    const [focusedIdx, setFocusedIdx] = useState(0);

    const autoResize = useCallback(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = `${Math.max(ta.scrollHeight, minHeight)}px`;
    }, [minHeight]);

    useEffect(() => {
        autoResize();
    }, [value, autoResize]);

    const getTriggerContext = useCallback(
        (text: string, cursorPos: number) => {
            const before = text.slice(0, cursorPos);
            // Look for @ or # trigger
            const atMatch = before.match(/(^|[\s\n])@(\w*)$/);
            const hashMatch = before.match(/(^|[\s\n])#(\w*)$/);

            if (atMatch) {
                const start = before.lastIndexOf("@");
                return { trigger: "@" as const, query: atMatch[2], start };
            }
            if (hashMatch) {
                const start = before.lastIndexOf("#");
                return { trigger: "#" as const, query: hashMatch[2], start };
            }
            return null;
        },
        []
    );

    const handleChange = useCallback(
        async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            onChange(newValue);

            const cursorPos = e.target.selectionStart;
            const ctx = getTriggerContext(newValue, cursorPos);

            if (ctx && ctx.trigger === "@" && ctx.query && fetchUsers) {
                setTriggerType("@");
                setQueryStart(ctx.start);
                try {
                    const results = await fetchUsers(ctx.query);
                    setSuggestions(results);
                    setShowSuggestions(results.length > 0);
                    setFocusedIdx(0);
                } catch {
                    setShowSuggestions(false);
                }
            } else if (ctx && ctx.trigger === "#" && ctx.query) {
                // Hashtags: no suggestions, just style them
                setShowSuggestions(false);
            } else {
                setShowSuggestions(false);
                setTriggerType(null);
            }
        },
        [onChange, fetchUsers, getTriggerContext]
    );

    const insertMention = useCallback(
        (suggestion: Suggestion) => {
            const before = value.slice(0, queryStart);
            const after = value.slice(
                textareaRef.current?.selectionStart ?? queryStart
            );
            // Insert @display followed by a space
            const mention = `@${suggestion.display} `;
            const newValue = before + mention + after;
            onChange(newValue);
            setShowSuggestions(false);
            setSuggestions([]);
            setTriggerType(null);

            // Restore focus and cursor position
            requestAnimationFrame(() => {
                const ta = textareaRef.current;
                if (ta) {
                    ta.focus();
                    const pos = before.length + mention.length;
                    ta.setSelectionRange(pos, pos);
                }
            });
        },
        [value, queryStart, onChange]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (!showSuggestions || suggestions.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIdx((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIdx((i) =>
                    i <= 0 ? suggestions.length - 1 : i - 1
                );
            } else if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                insertMention(suggestions[focusedIdx]);
            } else if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        },
        [showSuggestions, suggestions, focusedIdx, insertMention]
    );

    // Render highlighted text
    const renderHighlight = () => {
        if (!value) return null;
        // Split by @mentions and #hashtags
        const parts = value.split(/([@#]\w+)/g);
        return parts.map((part, i) => {
            if (part.startsWith("@")) {
                return (
                    <span key={i} className="text-[#FF2D55] font-medium">
                        {part}
                    </span>
                );
            }
            if (part.startsWith("#")) {
                return (
                    <span key={i} className="text-[#a855f7] font-medium">
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Highlighter overlay */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl border border-transparent"
                style={{ padding: 12 }}
            >
                <div
                    className="text-[15px] whitespace-pre-wrap break-words leading-[1.5]"
                    style={{ wordBreak: "break-word" }}
                >
                    {renderHighlight()}
                    {/* Extra space so the overlay matches the textarea height */}
                    <span>&nbsp;</span>
                </div>
            </div>

            {/* Actual textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    // Delay to allow click on suggestion
                    setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={placeholder}
                className="w-full bg-[#151515] border border-white/[0.07] rounded-xl text-[15px] text-transparent caret-white outline-none resize-none transition-colors focus:border-white/15 placeholder:text-white/20"
                style={{
                    padding: 12,
                    minHeight,
                    lineHeight: 1.5,
                    caretColor: "white",
                }}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-[1000] mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                    {suggestions.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault(); // prevent blur
                                insertMention(s);
                            }}
                            className={`w-full text-left px-3 py-2 text-[13px] transition-colors border-b border-white/[0.05] last:border-0 ${i === focusedIdx
                                    ? "bg-white/[0.05] text-white"
                                    : "text-white/60 hover:bg-white/[0.03]"
                                }`}
                        >
                            @{s.display}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
