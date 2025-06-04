
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioControls from '../../Components/AudioControls';
import './SandBoxPage.css';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import Player from '../../Components/Player/Player';
import Structure from '../../Components/Structures/Structure';
import StructureDialog from '../../Components/Structures/StructureDialog';
import { worldConfig, companies, technologies } from './data';
import { Position, StructureData } from './types';

const SandboxPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState<StructureData | null>(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Player movement hook
    const { playerPosition, isMoving, direction } = usePlayerMovement({
        initialPosition: { x: worldConfig.width / 2, y: 100 },
        speed: 3,
        worldBounds: {
            minX: 50,
            minY: 50,
            maxX: worldConfig.width - 50,
            maxY: worldConfig.height - 50
        }
    });

    // Collision detection hook
    const { nearbyStructure } = useCollisionDetection({
        playerPosition,
        structures: [...companies, ...technologies],
        interactionRadius: 70
    });

    // Handle structure interaction
    useEffect(() => {
        if (nearbyStructure && !showDialog) {
            setSelectedStructure(nearbyStructure);
            setShowDialog(true);
        } else if (!nearbyStructure && showDialog) {
            const timer = setTimeout(() => {
                setShowDialog(false);
                setSelectedStructure(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [nearbyStructure, showDialog]);

    useEffect(() => {
        // Animate loading progress
        const loadingInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => setGameLoaded(true), 50);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
    }, []);


    // Handle back to home
    const handleBackToHome = () => {
        navigate('/');
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        setSelectedStructure(null);
    };

    if (!gameLoaded) {
        return (
            <div className="sandbox-loading">
                <div className="rpgui-content">
                    <div className="rpgui-container framed">
                        <h2>Loading Sandbox...</h2>
                        <p>Preparing your journey through my career path...</p>
                        <div className="loading-bar">
                            <div
                                className="rpgui-progress"
                                ref={(el) => {
                                    if (el && window.RPGUI) {
                                        window.RPGUI.set_value(el, loadingProgress / 100);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rpgui-content">
            <div className="sandbox-container">
                {/* Game Viewport */}
                <div className="sandbox-viewport">
                    <div
                        className="sandbox-world"
                        style={{
                            width: worldConfig.width,
                            height: worldConfig.height,
                            transform: `translate(${-playerPosition.x + window.innerWidth / 2}px, ${-playerPosition.y + window.innerHeight / 2}px)`
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="world-background" />

                        {/* Main Path */}
                        <div className="main-path" />

                        {/* Companies (Buildings) */}
                        {companies.map((company) => (
                            <Structure
                                key={company.id}
                                data={company}
                                type="building"
                                isNearby={nearbyStructure?.id === company.id}
                                playerPosition={playerPosition}
                            />
                        ))}

                        {/* Technologies (Statues) */}
                        {technologies.map((tech) => (
                            <Structure
                                key={tech.id}
                                data={tech}
                                type="statue"
                                isNearby={nearbyStructure?.id === tech.id}
                                playerPosition={playerPosition}
                            />
                        ))}

                        {/* Player Character */}
                        <Player
                            position={playerPosition}
                            isMoving={isMoving}
                            direction={direction}
                        />

                        {/* Debug grid in development */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="debug-grid" />
                        )}
                    </div>
                </div>

                {/* UI Overlay */}
                <div className="sandbox-ui">
                    {/* Back to Home Button */}
                    <div className="back-button ms-3">
                        <button
                            className="rpgui-button golden"
                            onClick={handleBackToHome}
                        >
                            <p style={{ marginTop: 'revert', fontSize: '0.9rem' }}>🏠 Home</p>
                        </button>
                    </div>

                    {/* Controls Info */}
                    <div className="controls-info">
                        <div className="rpgui-container framed-grey">
                            <p style={{ margin: 0, fontSize: '0.8rem' }}>
                                <strong>WASD</strong> to move • <strong>Walk near</strong> structures to learn more
                            </p>
                        </div>
                    </div>



                    {/* Mini Map */}
                    <div className="minimap">
                        <div className="rpgui-container framed-grey">
                            <div className="minimap-content">
                                <div
                                    className="minimap-player"
                                    style={{
                                        left: `${(playerPosition.x / worldConfig.width) * 100}%`,
                                        top: `${(playerPosition.y / worldConfig.height) * 100}%`
                                    }}
                                />
                                {[...companies, ...technologies].map((structure) => (
                                    <div
                                        key={structure.id}
                                        className={`minimap-structure ${structure.type}`}
                                        style={{
                                            left: `${(structure.position.x / worldConfig.width) * 100}%`,
                                            top: `${(structure.position.y / worldConfig.height) * 100}%`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Controls */}
                <AudioControls
                    audioSrc="/audio/sandbox_compressed.mp3"
                    defaultVolume={15}
                    defaultMuted={true}
                    position="top-right"
                    buttonStyle="normal"
                    containerStyle="framed-grey"
                    loop={true}
                    autoPlay={false}
                    showVolumePercentage={true}
                />

                {/* Structure Info Dialog */}
                {showDialog && selectedStructure && (
                    <StructureDialog
                        structure={selectedStructure}
                        onClose={handleDialogClose}
                        position={playerPosition}
                    />
                )}
            </div>
        </div>
    );
};

export default SandboxPage;