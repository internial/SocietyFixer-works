import React from 'react';

/**
 * Renders the SVG logo for the application, an inverted triangle with a cyan neon glow,
 * based on the user's provided design.
 * @returns {React.JSX.Element} The rendered SVG logo.
 */
export default function Logo() {
    return (
        <svg
            className="me-2"
            width="32"
            height="32"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }} // Prevent the glow effect from being clipped
            role="img"
            aria-labelledby="logoTitle"
        >
            <title id="logoTitle">SocietyFixer Logo</title>
            {/* 1. The glowing outline. This is the bottom layer. */}
            <polygon
                points="50,85 15,15 85,15"
                fill="none"
                stroke="#00ffff" // A vibrant cyan color for the glow
                strokeWidth="10"
                strokeLinejoin="round"
                style={{ 
                    // CSS filter creates a performant and beautiful neon glow effect
                    filter: 'drop-shadow(0 0 8px #00ffff)' 
                }}
            />
            {/* 2. The solid, dark fill. This sits on top of the glowing shape. */}
             <polygon
                points="50,85 15,15 85,15"
                fill="#212529" // A dark color matching the theme for the triangle's body
                stroke="none"
            />
        </svg>
    );
}