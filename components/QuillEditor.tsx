import React, { useEffect, useRef } from 'react';

// Makes Quill available from the global scope (loaded via CDN in layout.tsx)
declare const Quill: any;

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    ariaLabelledBy?: string;
}

/**
 * A wrapper component for the Quill.js rich text editor.
 * It initializes the editor and handles syncing its content with React state.
 *
 * @param {QuillEditorProps} props - The component props.
 * @returns {React.JSX.Element} The rendered Quill editor container.
 */
export default function QuillEditor({ value, onChange, ariaLabelledBy }: QuillEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);

    useEffect(() => {
        // Initialize Quill only once when the component mounts
        if (editorRef.current && !quillInstance.current && typeof Quill !== 'undefined') {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean']
                    ]
                },
                placeholder: 'Detail your proposed policies here...'
            });

            // Add accessibility attributes to the editor
            const editorEl = editorRef.current.querySelector('.ql-editor');
            if (editorEl && ariaLabelledBy) {
                editorEl.setAttribute('aria-labelledby', ariaLabelledBy);
            }

            // Add descriptive tooltips to the toolbar icons
            const tooltips: { [key: string]: string } = {
                '.ql-bold': 'Make text bold',
                '.ql-italic': 'Make text italic',
                '.ql-underline': 'Underline text',
                '.ql-strike': 'Strikethrough text',
                '.ql-list[value="ordered"]': 'Create a numbered list',
                '.ql-list[value="bullet"]': 'Create a bulleted list',
                '.ql-link': 'Insert a hyperlink',
                '.ql-clean': 'Remove all formatting',
                '.ql-header': 'Change heading level',
                '.ql-color': 'Change text color',
                '.ql-background': 'Change text background color'
            };

            const toolbarEl = quillInstance.current.getModule('toolbar').container;
            Object.entries(tooltips).forEach(([selector, title]) => {
                const el = toolbarEl.querySelector(selector);
                if (el) {
                    el.setAttribute('title', title);
                }
            });
            
            // Set up an event listener to propagate changes up to the parent form
            quillInstance.current.on('text-change', () => {
                onChange(quillInstance.current.root.innerHTML);
            });
        }

        // Sync the editor's content if the initial `value` prop changes
        if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            // Use pasteHTML to avoid losing the cursor position, though for initial data it's fine
            quillInstance.current.root.innerHTML = value;
        }
    }, [value, onChange, ariaLabelledBy]);

    return <div ref={editorRef} className="quill-light-theme rounded-2"></div>;
};