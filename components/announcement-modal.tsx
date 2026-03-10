'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export function AnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Show modal on mount
        setIsOpen(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        if (countdown <= 0) {
            // Auto-close when countdown reaches 0
            const closeTimer = setTimeout(() => setIsOpen(false), 400);
            return () => clearTimeout(closeTimer);
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, countdown]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    if (!isOpen) return null;

    return (
        <div
            className="announcement-overlay"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-title"
        >
            <div
                className="announcement-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="announcement-close-btn"
                    aria-label="Cerrar anuncio"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon/Badge */}
                <div className="announcement-icon">
                    <span className="announcement-icon-emoji">📢</span>
                </div>

                {/* Content */}
                <h2 id="announcement-title" className="announcement-title">
                    Atención Jubilados Pensionados y Sobrevivientes
                </h2>

                <div className="announcement-divider" />

                <p className="announcement-body">
                    Cantv informa que se da prórroga para la asistencia al proceso de actualización de data y fe de vida
                </p>

                <div className="announcement-date-badge">
                    <span className="announcement-date-icon">📅</span>
                    <span className="announcement-date-text">
                        Desde el 09 de marzo hasta el 20 de marzo de 2026
                    </span>
                </div>

                {/* Countdown */}
                <div className="announcement-countdown-container">
                    <div className="announcement-countdown-ring">
                        <svg className="announcement-countdown-svg" viewBox="0 0 48 48">
                            <circle
                                className="announcement-countdown-track"
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                strokeWidth="3"
                            />
                            <circle
                                className="announcement-countdown-progress"
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                strokeWidth="3"
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 * (1 - countdown / 10)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <span className="announcement-countdown-number">{countdown}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
