'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

let activeModalCount = 0;

export function AnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(20);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Si ya hay un modal activo o mostrándose, no abrir otro
        if (activeModalCount > 0 || document.querySelector('.ann-overlay')) {
            return;
        }
        activeModalCount++;

        // Abre casi de inmediato (50ms solo para evitar mismatch SSR/hidratación)
        const openTimer = setTimeout(() => {
            setIsOpen(true);
        }, 50);

        return () => {
            clearTimeout(openTimer);
            activeModalCount = Math.max(0, activeModalCount - 1);
        };
    }, []);

    useEffect(() => {
        if (!isOpen || isClosing) return;

        if (countdown <= 0) {
            handleClose();
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, countdown, isClosing]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            activeModalCount = 0;
        }, 400);
    }, []);

    if (!isOpen) return null;

    const TOTAL = 20;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (countdown / TOTAL);

    // Anillo siempre en verde
    const strokeColor = '#15803d';

    const secondsDisplay = String(countdown).padStart(2, '0');

    return (
        <div
            className={`ann-overlay ${isClosing ? 'ann-closing' : 'ann-entering'}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ann-title"
            aria-describedby="ann-body"
        >
            <div
                className={`ann-modal ${isClosing ? 'ann-modal-out' : 'ann-modal-in'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Banda superior de color */}
                <div className="ann-top-band">
                    <span className="ann-top-icon" aria-hidden="true">⚡</span>
                    <h2 id="ann-title" className="ann-title">LLAMADO A LA ACCIÓN</h2>
                    <p className="ann-subtitle">Asociados Jubilados CANTV</p>
                </div>

                {/* Botón X esquina */}
                <button
                    onClick={handleClose}
                    className="ann-close-x"
                    aria-label="Cerrar anuncio"
                    id="announcement-close-btn"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Cuerpo del mensaje */}
                <div className="ann-body-wrap">
                    <p id="ann-body" className="ann-body">
                        Invito a todos los asociados a exigir a sus{' '}
                        <strong className="ann-green">AJUPTELES LOCALES</strong>{' '}
                        a introducir demandas contra la Cantv por{' '}
                        <strong className="ann-green">
                            INCUMPLIMIENTO DE LA CONVENCIÓN COLECTIVA
                        </strong>
                        , ya basta de acciones infértiles, es tiempo de escalar la
                        lucha por nuestros derechos a otro nivel.
                    </p>
                </div>

                {/* Separador */}
                <div className="ann-separator" />

                {/* Pie: cronómetro + botón cerrar */}
                <div className="ann-footer">
                    {/* Reloj SVG grande */}
                    <div
                        className="ann-clock"
                        aria-label={`Cierre automático en ${countdown} segundos`}
                    >
                        <svg
                            width="90"
                            height="90"
                            viewBox="0 0 90 90"
                            aria-hidden="true"
                        >
                            {/* Sombra suave */}
                            <circle
                                cx="45" cy="45" r={radius}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="6"
                            />
                            {/* Arco de progreso */}
                            <circle
                                cx="45" cy="45" r={radius}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="6"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - progress}
                                strokeLinecap="round"
                                transform="rotate(-90 45 45)"
                                style={{
                                    transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                                    filter: `drop-shadow(0 0 4px ${strokeColor}66)`
                                }}
                            />
                            {/* Número */}
                            <text
                                x="45" y="44"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                    fontSize: '22px',
                                    fontWeight: '800',
                                    fill: strokeColor,
                                    fontFamily: 'monospace',
                                    transition: 'fill 0.5s ease',
                                }}
                            >
                                {secondsDisplay}
                            </text>
                            {/* Etiqueta SEG */}
                            <text
                                x="45" y="62"
                                textAnchor="middle"
                                style={{
                                    fontSize: '9px',
                                    fill: '#9ca3af',
                                    fontWeight: '600',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontFamily: 'sans-serif',
                                }}
                            >
                                SEG
                            </text>
                        </svg>
                    </div>

                    {/* Botón Cerrar */}
                    <button
                        onClick={handleClose}
                        className="ann-dismiss-btn"
                        id="announcement-dismiss-btn"
                    >
                        <X className="w-4 h-4" />
                        Cerrar
                    </button>
                </div>
            </div>

            <style>{`
                /* ── OVERLAY ── */
                .ann-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background: rgba(0, 0, 0, 0.60);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }
                .ann-entering { animation: annOverlayIn 0.3s ease forwards; }
                .ann-closing  { animation: annOverlayOut 0.4s ease forwards; }
                @keyframes annOverlayIn  { from { opacity:0 } to { opacity:1 } }
                @keyframes annOverlayOut { from { opacity:1 } to { opacity:0 } }

                /* ── MODAL BLANCO ── */
                .ann-modal {
                    position: relative;
                    max-width: 520px;
                    width: 100%;
                    border-radius: 18px;
                    background: #ffffff;
                    box-shadow: 0 24px 60px rgba(0,0,0,0.35);
                    overflow: hidden;
                    color: #111827;
                }
                .ann-modal-in  { animation: annModalIn  0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .ann-modal-out { animation: annModalOut 0.35s ease forwards; }
                @keyframes annModalIn  {
                    from { opacity:0; transform:scale(0.88) translateY(20px); }
                    to   { opacity:1; transform:scale(1)    translateY(0); }
                }
                @keyframes annModalOut {
                    from { opacity:1; transform:scale(1)    translateY(0); }
                    to   { opacity:0; transform:scale(0.92) translateY(12px); }
                }

                /* ── BANDA SUPERIOR ── */
                .ann-top-band {
                    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
                    padding: 1.5rem 2rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.35rem;
                    text-align: center;
                }
                .ann-top-icon {
                    font-size: 2rem;
                    line-height: 1;
                    filter: drop-shadow(0 0 8px rgba(250,204,21,0.8));
                    animation: annPulse 2s ease-in-out infinite;
                }
                @keyframes annPulse {
                    0%,100% { transform: scale(1); }
                    50%      { transform: scale(1.15); }
                }
                .ann-title {
                    margin: 0;
                    font-size: 1.15rem;
                    font-weight: 900;
                    letter-spacing: 0.07em;
                    color: #ffffff;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                }
                .ann-subtitle {
                    margin: 0;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #ffffff;
                }

                /* ── BOTÓN X ESQUINA ── */
                .ann-close-x {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.25);
                    color: #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    z-index: 10;
                }
                .ann-close-x:hover {
                    background: rgba(239,68,68,0.4);
                    color: #fff;
                    transform: scale(1.1);
                }

                /* ── CUERPO ── */
                .ann-body-wrap {
                    padding: 1.5rem 2rem 0.75rem;
                }
                .ann-body {
                    margin: 0;
                    font-size: 1rem;
                    line-height: 1.8;
                    color: #111827;
                    text-align: center;
                }
                .ann-green {
                    color: #15803d;
                    font-weight: 800;
                }

                /* ── SEPARADOR ── */
                .ann-separator {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 0.75rem 1.5rem;
                }

                /* ── PIE ── */
                .ann-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 0.5rem 1.5rem 1.25rem;
                }
                .ann-clock {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ── BOTÓN CERRAR ── */
                .ann-dismiss-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.7rem 1.25rem;
                    border-radius: 10px;
                    background: #15803d;
                    border: none;
                    color: #ffffff;
                    font-size: 0.9rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(21,128,61,0.35);
                }
                .ann-dismiss-btn:hover {
                    background: #166534;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 18px rgba(21,128,61,0.45);
                }
                .ann-dismiss-btn:active {
                    transform: translateY(0);
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 480px) {
                    .ann-body-wrap { padding: 1.25rem 1.25rem 0.5rem; }
                    .ann-body { font-size: 0.92rem; }
                    .ann-footer { padding: 0.5rem 1rem 1rem; }
                }
            `}</style>
        </div>
    );
}
