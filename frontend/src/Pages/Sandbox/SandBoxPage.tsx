// src/Pages/Sandbox/SandBoxPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioControls from '../../Components/AudioControls/AudioControls';
import './SandBoxPage.css';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import Player from '../../Components/Player/Player';
import Structure from '../../Components/Structures/Structure';
import StructureDialog from '../../Components/Structures/StructureDialog';
import PathRenderer from '../../Components/Path/PathRender';
import TerrainRenderer from '../../Components/Terrain/TerrainRenderer';
import { worldConfig, companies, technologies, mainPathConfig } from './config';
import { createPathGenerator } from '../../Components/Path/pathGeneration';
import { Position, StructureData, PathSegment } from './types';

const SandboxPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState<StructureData | null>(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Generate path segments based on structure positions
    const pathSegments: PathSegment[] = useMemo(() => {
        const pathGenerator = createPathGenerator({
            startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
            endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
            structures: [...companies, ...technologies],
            tileSize: worldConfig.tileSize,
            pathWidth: mainPathConfig.width
        });

        return pathGenerator.generatePath();
    }, []);

    // Player movement hook
    const { playerPosition, isMoving, direction } = usePlayerMovement({
        initialPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY + 50 },
        speed: 5,
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

    // Loading simulation
    useEffect(() => {
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

        return () => clearInterval(loadingInterval);
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

                            //magics
                            transform: `translate(${-playerPosition.x + window.innerWidth / 2}px, ${-playerPosition.y + window.innerHeight / 2}px)`
                        }}
                    >
                        {/* Terrain Background (Grass) */}
                        <TerrainRenderer worldConfig={worldConfig} />

                        {/* Dynamic Path System */}
                        <PathRenderer 
                            pathSegments={pathSegments} 
                            tileSize={worldConfig.tileSize}
                        />
                        
                        {/* Companies (Buildings) */}
                        <div className='company-buildings-container'>
                            {companies.map((company) => (
                            <Structure
                                key={company.id}
                                data={company}
                                type="building"
                                isNearby={nearbyStructure?.id === company.id}
                                playerPosition={playerPosition}
                                />
                            ))}
                        </div>
                        

                        {/* Technologies (Statues) */}
                        <div>
                            {technologies.map((tech) => (
                                <Structure
                                    key={tech.id}
                                    data={tech}
                                    type="statue"
                                    isNearby={nearbyStructure?.id === tech.id}
                                    playerPosition={playerPosition}
                                />
                            ))}
                        </div>

                        {/* Player Character */}
                        <Player
                            position={playerPosition}
                            isMoving={isMoving}
                            direction={direction}
                        />

                        {/* Debug grid in development 
                            {process.env.NODE_ENV === 'development' && (
                                <div className="debug-grid" />
                            )}
                        */}
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
                            <p className="revert-top">🏠 Home</p>
                        </button>
                    </div>

                    {/* Controls Info */}
                    <div className="controls-info">
                        <div className="rpgui-container framed-grey">
                            <p className="control-info-text">
                                <strong>WASD</strong> or <strong>ARROWS</strong> to move • <strong>Walk near</strong> structures to know me!
                            </p>
                        </div>
                    </div>

                    {/* Mini Map */}
                    <div className="minimap">
                        <div className="rpgui-container framed-grey">
                            <div className="minimap-content">
                                {/* Main path on minimap */}
                                <div className="minimap-main-path" />
                                
                                {/* Player position */}
                                <div
                                    className="minimap-player"
                                    style={{
                                        left: `${(playerPosition.x / worldConfig.width) * 100}%`,
                                        top: `${(playerPosition.y / worldConfig.height) * 100}%`
                                    }}
                                />
                                
                                {/* Structures on minimap */}
                                {[...companies, ...technologies].map((structure) => (
                                    <div
                                        key={structure.id}
                                        className={`minimap-structure ${structure.type} ${
                                            structure.name === '???' ? 'future' : ''
                                        }`}

                                        style={{
                                            left: `${(structure.position.x / worldConfig.width) * 100}%`,
                                            top: `${(structure.position.y / worldConfig.height) * 100}%`
                                        }}

                                        title={structure.name}
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