
import React, { ReactNode, useEffect, useRef } from 'react';

interface TooltipProps {
    text: string;
    children: ReactNode;
}

/**
 * A wrapper component that adds a Bootstrap tooltip to its children.
 * It initializes the tooltip instance via Bootstrap's JavaScript API.
 *
 * @param {TooltipProps} props - The component props.
 * @returns {React.JSX.Element} The rendered component with a tooltip.
 */
export default function Tooltip({ text, children }: TooltipProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipInstance = useRef<any>(null); // To hold the Bootstrap Tooltip instance

    useEffect(() => {
        // Ensure Bootstrap's JS is loaded before trying to initialize
        if (wrapperRef.current && typeof (window as any).bootstrap !== 'undefined') {
            const childElement = wrapperRef.current.firstElementChild;
            if (childElement) {
                tooltipInstance.current = new (window as any).bootstrap.Tooltip(childElement, {
                    title: text,
                    placement: 'top',
                    trigger: 'hover',
                });
            }
        }

        // Cleanup function to destroy the tooltip when the component unmounts
        return () => {
            if (tooltipInstance.current) {
                tooltipInstance.current.dispose();
            }
        };
    }, [text]); // Re-initialize if the text changes

    return (
        <div ref={wrapperRef} className="d-inline-block">
            {children}
        </div>
    );
};