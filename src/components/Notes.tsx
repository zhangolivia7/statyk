"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Handjet } from "next/font/google";

const handjet = Handjet({ weight: "variable", subsets: ["latin"] });

interface NotesProps {
    open: boolean;
    onClose: () => void;
    theme?: "dark" | "light";
}

interface ToolbarState {
    visible: boolean;
    top: number;
    left: number;
}

export default function Notes({ open, onClose, theme = "dark" }: NotesProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [toolbar, setToolbar] = useState<ToolbarState>({ visible: false, top: 0, left: 0 });
    const [listMenuOpen, setListMenuOpen] = useState(false);

    const bg = theme === "dark" ? "#0C0C0C" : "#F3EDE5";
    const fg = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    const hideToolbar = useCallback(() => {
        setToolbar((t) => (t.visible ? { ...t, visible: false } : t));
        setListMenuOpen(false);
    }, []);

    const updateToolbarPosition = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
            hideToolbar();
            return;
        }
        const range = selection.getRangeAt(0);
        if (
            !editorRef.current ||
            !wrapperRef.current ||
            !editorRef.current.contains(range.commonAncestorContainer)
        ) {
            hideToolbar();
            return;
        }
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
            hideToolbar();
            return;
        }
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        let top = rect.top - wrapperRect.top - 44;
        if (top < 4) {
            top = rect.bottom - wrapperRect.top + 8;
        }
        setToolbar({
            visible: true,
            top,
            left: rect.left - wrapperRect.left + rect.width / 2,
        });
    }, [hideToolbar]);

    useEffect(() => {
        document.addEventListener("selectionchange", updateToolbarPosition);
        return () => document.removeEventListener("selectionchange", updateToolbarPosition);
    }, [updateToolbarPosition]);

    const applyInline = (command: string) => {
        document.execCommand(command);
        updateToolbarPosition();
    };

    const applyList = (type: "bullet" | "numbered" | "checklist") => {
        if (type === "numbered") {
            document.execCommand("insertOrderedList");
        } else {
            document.execCommand("insertUnorderedList");
        }

        if (type === "checklist") {
            const selection = window.getSelection();
            let node: Node | null = selection?.anchorNode ?? null;
            while (node && node.nodeName !== "UL") node = node.parentNode;
            if (node instanceof HTMLUListElement) {
                node.classList.add("checklist");
                node.querySelectorAll("li").forEach((li) => {
                    if (li.querySelector('input[type="checkbox"]')) return;
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.contentEditable = "false";
                    checkbox.addEventListener("change", () => {
                        li.classList.toggle("checked", checkbox.checked);
                    });
                    li.insertBefore(checkbox, li.firstChild);
                });
            }
        }

        setListMenuOpen(false);
        updateToolbarPosition();
    };

    const closestBlock = (node: Node): HTMLElement => {
        const root = editorRef.current;
        let el: Node | null = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        while (el && el !== root) {
            if (el instanceof HTMLElement && ["DIV", "P", "LI"].includes(el.tagName)) return el;
            el = el.parentElement;
        }
        return root ?? (node as HTMLElement);
    };

    const isCaretAtLineStart = (li: HTMLLIElement, container: Node, offset: number) => {
        const skipNode = li.querySelector('input[type="checkbox"]');
        const testRange = document.createRange();
        testRange.selectNodeContents(li);
        if (skipNode) testRange.setStartAfter(skipNode);
        try {
            testRange.setEnd(container, offset);
        } catch {
            return false;
        }
        return testRange.toString().length === 0;
    };

    const handleListBackspace = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const startEl =
            range.startContainer.nodeType === Node.TEXT_NODE
                ? range.startContainer.parentElement
                : (range.startContainer as HTMLElement);
        const li = startEl?.closest("li");
        if (!li || !isCaretAtLineStart(li, range.startContainer, range.startOffset)) return;

        e.preventDefault();
        const list = li.closest("ul, ol");
        li.querySelector('input[type="checkbox"]')?.remove();
        document.execCommand(list?.tagName === "OL" ? "insertOrderedList" : "insertUnorderedList");
    };

    const handleMarkdownShortcut = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const block = closestBlock(range.startContainer);
        if (block.closest("ul, ol")) return;

        const testRange = document.createRange();
        testRange.selectNodeContents(block);
        testRange.setEnd(range.startContainer, range.startOffset);
        const textBefore = testRange.toString();

        const isBullet = textBefore === "-";
        const isNumbered = /^\d+\.$/.test(textBefore);
        if (!isBullet && !isNumbered) return;

        e.preventDefault();
        selection.removeAllRanges();
        selection.addRange(testRange);
        document.execCommand("delete");
        document.execCommand(isBullet ? "insertUnorderedList" : "insertOrderedList");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const mod = e.metaKey || e.ctrlKey;
        if (mod) {
            if (e.code === "KeyB") {
                e.preventDefault();
                applyInline("bold");
                return;
            }
            if (e.code === "KeyU") {
                e.preventDefault();
                applyInline("underline");
                return;
            }
            if (e.shiftKey && e.code === "KeyX") {
                e.preventDefault();
                applyInline("strikeThrough");
                return;
            }
        }

        if (e.key === "Backspace") {
            handleListBackspace(e);
            return;
        }

        if (e.key === " ") {
            handleMarkdownShortcut(e);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                height: "100%",
                width: "500px",
                backgroundColor: bg,
                borderRight: "2px solid #747474",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transform: open ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
                zIndex: 40,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ fontSize: "20px", color: fg, margin: 0 }}>NOTES</h1>
                <button onClick={onClose} style={{ color: fg }}>
                    X
                </button>
            </div>

            <div ref={wrapperRef} style={{ position: "relative", flex: 1 }}>
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={handleKeyDown}
                    data-placeholder="jot something down..."
                    className={`notes-editor ${handjet.className}`}
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflowY: "auto",
                        backgroundColor: "transparent",
                        border: "1px solid #747474",
                        borderRadius: "8px",
                        padding: "16px",
                        color: fg,
                        fontSize: "24px",
                        fontWeight: 300,
                        lineHeight: 1.4,
                        outline: "none",
                    }}
                />

                {toolbar.visible && (
                    <div
                        className={handjet.className}
                        style={{
                            position: "absolute",
                            top: toolbar.top,
                            left: toolbar.left,
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            backgroundColor: "#1c1c1c",
                            border: "1px solid #3a3a3a",
                            borderRadius: "8px",
                            padding: "4px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                            zIndex: 50,
                        }}
                    >
                        <ToolbarButton label="B" bold onMouseDown={() => applyInline("bold")} />
                        <ToolbarButton label="U" underline onMouseDown={() => applyInline("underline")} />
                        <ToolbarButton label="S" strike onMouseDown={() => applyInline("strikeThrough")} />

                        <div style={{ position: "relative" }}>
                            <ToolbarButton
                                label="List ⌄"
                                onMouseDown={() => setListMenuOpen((v) => !v)}
                            />
                            {listMenuOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 4px)",
                                        left: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        backgroundColor: "#1c1c1c",
                                        border: "1px solid #3a3a3a",
                                        borderRadius: "8px",
                                        padding: "4px",
                                        minWidth: "140px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                                        zIndex: 51,
                                    }}
                                >
                                    <DropdownItem label="Bullet" onMouseDown={() => applyList("bullet")} />
                                    <DropdownItem label="Numbered" onMouseDown={() => applyList("numbered")} />
                                    <DropdownItem label="Checklist" onMouseDown={() => applyList("checklist")} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({
    label,
    onMouseDown,
    bold,
    underline,
    strike,
}: {
    label: string;
    onMouseDown: () => void;
    bold?: boolean;
    underline?: boolean;
    strike?: boolean;
}) {
    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown();
            }}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "34px",
                height: "34px",
                padding: "0 10px",
                color: "#F3EDE5",
                fontSize: "20px",
                fontWeight: bold ? 700 : 400,
                textDecoration: underline ? "underline" : strike ? "line-through" : "none",
                borderRadius: "5px",
                whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
            {label}
        </button>
    );
}

function DropdownItem({ label, onMouseDown }: { label: string; onMouseDown: () => void }) {
    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown();
            }}
            style={{
                textAlign: "left",
                padding: "8px 12px",
                color: "#F3EDE5",
                fontSize: "16px",
                borderRadius: "5px",
                whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
            {label}
        </button>
    );
}
