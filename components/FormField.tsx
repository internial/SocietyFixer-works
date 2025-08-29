import React from 'react';

interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    // FIX: The FormField component only renders an <input>, so its onChange event handler
    // should specifically expect an HTMLInputElement. This resolves type conflicts
    // with handlers that also support other element types like <textarea>.
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    list?: string;
    required?: boolean;
    helpText?: string;
    children?: React.ReactNode; // For datalist options
}

/**
 * A reusable form field component to reduce boilerplate in forms.
 * It includes a label, input, and error message display.
 * @param {FormFieldProps} props - The component props.
 * @returns {React.JSX.Element} The rendered form field.
 */
export const FormField: React.FC<FormFieldProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    error,
    type = 'text',
    placeholder,
    list,
    required = false,
    helpText,
    children
}) => {
    const describedByIds = `${error ? `${id}-error` : ''} ${helpText ? `${id}-help` : ''}`.trim();

    return (
        <div className="col-md-6">
            <label htmlFor={id} className="form-label">{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                list={list}
                required={required}
                aria-invalid={!!error}
                aria-describedby={describedByIds || undefined}
            />
            {children}
            {helpText && <div id={`${id}-help`} className="form-text">{helpText}</div>}
            {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
        </div>
    );
};