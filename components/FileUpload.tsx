import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
    onUpload: (url: string) => void;
    fileType: 'image' | 'pdf';
    storagePath: string;
    isRequired?: boolean;
    ariaLabelledBy?: string;
}

/**
 * A file upload component that supports drag-and-drop and click-to-select.
 * It handles file validation (type, size), uploads to Supabase Storage,
 * and provides feedback on the upload status.
 *
 * @param {FileUploadProps} props - The component props.
 * @returns {React.JSX.Element} The rendered file upload component.
 */
export default function FileUpload({ onUpload, fileType, storagePath, isRequired = false, ariaLabelledBy }: FileUploadProps) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Validates the file based on its type and size.
     * @param {File} file - The file to validate.
     * @returns {boolean} - True if the file is valid, false otherwise.
     */
    const validateFile = (file: File): boolean => {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
        const isPdf = file.type === 'application/pdf';
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (fileType === 'image' && !isImage) {
            setError('Invalid file type. Please upload a JPEG or PNG image.');
            return false;
        }
        if (fileType === 'pdf' && !isPdf) {
            setError('Invalid file type. Please upload a PDF.');
            return false;
        }
        if (file.size > maxSize) {
            setError('File is too large. Maximum size is 2MB.');
            return false;
        }
        setError(null);
        return true;
    };

    /**
     * Handles the file upload process after validation.
     * @param {File} file - The file to upload.
     */
    const handleFile = async (file: File) => {
        if (!validateFile(file)) return;

        setUploading(true);
        setFileName(file.name);
        
        const fileExt = file.name.split('.').pop();
        const filePath = `${storagePath}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from(storagePath).upload(filePath, file);

        if (uploadError) {
            setError(`Upload failed: ${uploadError.message}`);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from(storagePath).getPublicUrl(filePath);
        onUpload(data.publicUrl);
        setUploading(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragging(true);
        else if (e.type === 'dragleave') setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    
    const description = fileType === 'pdf' 
        ? "Your professional resume/CV. Max 2MB."
        : "Max 2MB.";

    return (
        <div className="mt-1">
            <div 
                onDragEnter={handleDrag} 
                onDragOver={handleDrag} 
                onDragLeave={handleDrag} 
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`d-flex justify-content-center px-4 py-5 border-2 rounded-3 ${dragging ? 'border-primary bg-secondary' : 'border-secondary'}`}
                style={{borderStyle: 'dashed', cursor: 'pointer', transition: 'all 0.2s ease-in-out'}}
                role="button"
                aria-labelledby={ariaLabelledBy}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            >
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-secondary" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="48" width="48" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <div className="text-sm text-secondary" aria-live="polite">
                        <p className="ps-1">
                            {uploading ? `Uploading ${fileName}...` : (fileName ? `File: ${fileName}` : `Drag & drop a file, or click to select`)}
                        </p>
                    </div>
                    <p className="text-xs text-secondary">{description}</p>
                </div>
            </div>
            <input ref={fileInputRef} type="file" className="d-none" onChange={handleChange} accept={fileType === 'image' ? 'image/png, image/jpeg' : 'application/pdf'} required={isRequired} />
            {error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}
        </div>
    );
};