import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/ruby/ruby";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../api/actions";
import styles from "../styles/components/Editor.module.css";

const Editor = ({
    socketRef,
    roomId,
    onCodeChange,
    codeTemplate,
    language,
    setLanguage,
    questionChanged,
    setQuestionChanged
}) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            const template = codeTemplate === null ? "" : codeTemplate;
            editorRef.current.setValue(template);

            if (!questionChanged) {
                setTimeout(() => {
                    socketRef.current.emit(ACTIONS.CHECK_SYNC, {
                        roomId,
                        template
                    });
                }, 500)
            } else {
                setQuestionChanged(false);
            }
        }
    }, [editorRef.current, codeTemplate]);

    useEffect(() => {
        if (questionChanged) {
            const template = codeTemplate === null ? "" : codeTemplate;
            editorRef.current.setValue(template);
        }

        setQuestionChanged(false);
    }, [questionChanged]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setOption("mode", {
                name: language,
                json: true,
            });
        }
    }, [language]);

    useEffect(() => {
        async function init() {
            if (!document.getElementById("realtimeEditor")) {
                return;
            }

            editorRef.current = Codemirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: "python", json: true },
                    theme: "dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    indentUnit: 4
                }
            );

            editorRef.current.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);

                if (origin !== "setValue") {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }

        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });

            socketRef.current.on(ACTIONS.CHANGE_LANGUAGE, ({ language }) => {
                if (language !== null) {
                    editorRef.current.setOption("mode", {
                        name: language,
                        json: true,
                    });
                    setLanguage(language);
                }
            });

            socketRef.current.on(ACTIONS.CHECK_SYNC, ({ template, socketId }) => {
                if (editorRef.current.getValue() !== template) {
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: editorRef.current.getValue(),
                        socketId,
                    });
                }
            })
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
            socketRef.current.off(ACTIONS.CHANGE_LANGUAGE);
        };
    }, [socketRef.current]);

    return (
        <div className={styles["container"]}>
            <textarea id="realtimeEditor" />
        </div>
    );
};

export default Editor;
