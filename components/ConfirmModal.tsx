import React, { useEffect, useRef } from 'react';

interface ConfirmModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    body: React.ReactNode;
    confirmText?: string;
    confirmVariant?: string;
    isConfirming?: boolean;
}

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title,
    body,
    confirmText = 'Confirm',
    confirmVariant = 'danger',
    isConfirming = false,
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerElementRef = useRef<Element | null>(null);

    // Focus trapping and management
    useEffect(() => {
        if (show) {
            triggerElementRef.current = document.activeElement;
            const modalElement = modalRef.current;
            if (!modalElement) return;

            const focusableElements = modalElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            firstElement?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) { // Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            };

            modalElement.addEventListener('keydown', handleKeyDown);

            return () => {
                modalElement.removeEventListener('keydown', handleKeyDown);
                if (triggerElementRef.current instanceof HTMLElement) {
                    triggerElementRef.current.focus();
                }
            };
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1060 }}></div>
            <div
                ref={modalRef}
                className="modal fade show"
                tabIndex={-1}
                style={{ display: 'block', zIndex: 1061 }}
                aria-modal="true"
                role="dialog"
                aria-labelledby="confirmModalTitle"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-body-secondary border-secondary shadow-lg">
                        <div className="modal-header border-bottom-secondary">
                            <h5 className="modal-title h5 fw-bold" id="confirmModalTitle">{title}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isConfirming}></button>
                        </div>
                        <div className="modal-body">
                            {body}
                        </div>
                        <div className="modal-footer border-top-secondary">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isConfirming}>Cancel</button>
                            <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm} disabled={isConfirming}>
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}