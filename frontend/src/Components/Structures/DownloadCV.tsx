import React, { useState, useEffect, useRef } from 'react';
import { Position, StructureData } from '../../types/sandbox';
import { downloadCV } from '../../Services/fileService';
import { downloadCVCooldown } from '../../Pages/Sandbox/config';

interface DownloadCVProps {
    isNearby: boolean;
    structure: StructureData;
    playerPosition: Position;
}

const DownloadCV: React.FC<DownloadCVProps> = ({ isNearby, structure }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [cooldownActive, setCooldownActive] = useState(false);
    const [cooldownTimer, setCooldownTimer] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
    const downloadTriggeredRef = useRef(false);
    const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isNearby) {
            downloadTriggeredRef.current = false;
        }
    }, [isNearby]);

    useEffect(() => {
        if (isNearby && !cooldownActive && !downloadTriggeredRef.current && !isDownloading) {
            handleDownload();
            downloadTriggeredRef.current = true;
        }
    }, [isNearby, cooldownActive, isDownloading]);

    useEffect(() => {
        if (cooldownActive && cooldownTimer > 0) {
            cooldownIntervalRef.current = setTimeout(() => {
                setCooldownTimer(prev => {
                    if (prev <= 1) {
                        setCooldownActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (cooldownIntervalRef.current) {
                clearTimeout(cooldownIntervalRef.current);
            }
        };
    }, [cooldownActive, cooldownTimer]);

    const handleDownload = async () => {
        if (cooldownActive || isDownloading) return;

        setIsDownloading(true);
        setDownloadStatus('downloading');

        try {
            await downloadCV();
            setDownloadStatus('success');
            
            // Start cooldown
            setCooldownActive(true);
            setCooldownTimer(downloadCVCooldown);
            
            // Reset status after showing success briefly
            setTimeout(() => {
                setDownloadStatus('idle');
            }, 2000);
            
        } catch (error) {
            console.error('Download failed:', error);
            setDownloadStatus('error');
            
            // Reset status after showing error briefly
            setTimeout(() => {
                setDownloadStatus('idle');
            }, 3000);
        } finally {
            setIsDownloading(false);
        }
    };

    // Get the appropriate image based on state
    const getDisplayImage = () => {
        if (isNearby && !cooldownActive) {
            return structure.data.animatedImage || structure.data.image;
        }
        if (cooldownActive) {
            return structure.data.cooldownImage || structure.data.image;
        }
        return structure.data.image;
    };

    // Get status message
    const getStatusMessage = () => {
        if (isDownloading) return 'Downloading CV...';
        if (downloadStatus === 'success') return 'CV Downloaded!';
        if (downloadStatus === 'error') return 'Download Failed!';
        if (cooldownActive) return `Wait ${cooldownTimer}s`;
        if (isNearby) return 'Downloading CV...';
        return '';
    };

    // Get status color
    const getStatusColor = () => {
        switch (downloadStatus) {
            case 'downloading': return '#ffd700';
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            default: return cooldownActive ? '#ffa500' : '#ffd700';
        }
    };

    return (
        <>  
            <div
                className={`structure-container download-cv ${isNearby ? 'nearby' : ''} ${cooldownActive ? 'cooldown' : ''} ${isDownloading ? 'downloading' : ''}`}
                style={{
                    left: structure.position.x,
                    top: structure.position.y,
                }}
            >
                <div className="structure-sprite">
                    <img
                        style={{
                            marginLeft: structure.data.centering !== undefined ? structure.data.centering.x : 0,
                            marginTop: structure.data.centering !== undefined ? structure.data.centering.y : 0,
                            filter: cooldownActive ? 'grayscale(50%)' : 'none',
                            opacity: cooldownActive ? 0.7 : 1,
                            transition: 'filter 0.3s ease, opacity 0.3s ease'
                        }}
                        src={getDisplayImage()}
                        className="structure-technology-image"
                        alt="Download CV"
                    />
                    
                    {/* Download indicator */}
                    {(isDownloading || downloadStatus !== 'idle' || cooldownActive) && (
                        <div
                            className="download-status-indicator"
                            style={{
                                position: 'absolute',
                                top: '-80px',
                                left: '0px',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.9)',
                                color: getStatusColor(),
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                border: `1px solid ${getStatusColor()}`,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                                zIndex: 100,
                                animation: isDownloading ? 'pulse 1s infinite' : 'none'
                            }}
                        >
                            {getStatusMessage()}
                        </div>
                    )}
                </div>

                {/* Development debug info */}
                {process.env.REACT_APP_ENV === 'development' && (
                    <>
                        <div 
                            className="interaction-radius"
                            style={{
                                width: structure.interactionRadius * 2,
                                height: structure.interactionRadius * 2,
                                left: -(structure.interactionRadius),
                                top: -(structure.interactionRadius),
                                border: `2px dashed ${cooldownActive ? '#ffa500' : '#ffd700'}`,
                                borderRadius: '50%',
                                position: 'absolute',
                                pointerEvents: 'none',
                                opacity: 0.5
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '50px',
                                left: '0%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '2px',
                                fontSize: '10px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Near: {isNearby ? 'Y' : 'N'} | Cool: {cooldownActive ? 'Y' : 'N'} | DL: {isDownloading ? 'Y' : 'N'}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default DownloadCV;