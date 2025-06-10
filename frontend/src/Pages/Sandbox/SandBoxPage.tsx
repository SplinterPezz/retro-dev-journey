import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResourceLoader } from '../../Utils/useResourceLoader';
import AudioControls from '../../Components/AudioControls/AudioControls';
import './SandBoxPage.css';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import Player from '../../Components/Player/Player';
import Structure from '../../Components/Structures/Structure';
import StructureDialog from '../../Components/Structures/StructureDialog';
import PathRenderer from '../../Components/Path/PathRender';
import TerrainRenderer from '../../Components/Terrain/TerrainRenderer';
import { worldConfig, companies, technologies, mainPathConfig, playerHitbox, treesEnvironments, detailsEnvironments, downloadButton, downloadButtonId } from './config';
import { createPathGenerator } from '../../Components/Path/pathGeneration';
import { StructureData, PathSegment } from '../../types/sandbox';
import Environment from '../../Components/Structures/Environment';
import DownloadCV from '../../Components/Structures/DownloadCV';
import PixelProgressBar from '../../Components/Common/PixelProgressBar';
import { Joystick } from 'react-joystick-component';

const SandboxPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState<StructureData | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
            const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 768;
            
            setIsMobile(isMobileUA || (isTouchDevice && isSmallScreen));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Preload images and audio resources
    const requiredResources = useMemo(() => {
        const images: string[] = [];
        const audio: string[] = ['/audio/sandbox_compressed.mp3'];

        // Terrain and path images
        images.push(
            '/sprites/terrain/main.png',
            '/sprites/terrain/path_core.png',
            '/sprites/terrain/path_start.png',
            '/sprites/terrain/path_cross.png',
            '/sprites/terrain/path_t_cross.png',
            '/sprites/terrain/path_end.png'
        );

        // Player sprites
        images.push(
            '/sprites/player/dude_idle.gif',
            '/sprites/player/dude_walk_S.gif',
            '/sprites/player/dude_walk_N.gif',
            '/sprites/player/dude_walk_NE.gif',
            '/sprites/player/dude_walk_SE.gif'
        );

        // Background image
        images.push('/backgrounds/sky_sandbox.png');

        // Company building images
        companies.forEach(company => {
            if (company.data.image) images.push(company.data.image);
            if (company.data.signpost) images.push(company.data.signpost);
        });

        // Technology images
        technologies.forEach(tech => {
            if (tech.data.image) images.push(tech.data.image);
        });

        // Environment images
        [...treesEnvironments, ...detailsEnvironments].forEach(env => {
            if (env.image) images.push(env.image);
        });

        // Download button
        if (downloadButton.data.image) images.push(downloadButton.data.image);

        return { images, audio };
    }, []);

    // Use the resource loader with animated progress
    const { isLoading, progress, error } = useResourceLoader({
        images: requiredResources.images,
        audio: requiredResources.audio,
        onProgress: (loaded, total) => {
            if (process.env.REACT_APP_ENV === 'development') {
                console.log(`Loading resources: ${loaded}/${total}`);
            }
        },
        minDuration: 1000,
    });

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

    // Player movement hook with structure collision support
    const { 
        playerPosition, 
        isMoving, 
        direction, 
        handleJoystickMove,
        handleJoystickStop 
    } = usePlayerMovement({
        initialPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY + 50 },
        speed: 2,
        worldBounds: {
            minX: 50,
            minY: 50,
            maxX: worldConfig.width - 50,
            maxY: worldConfig.height - 50
        },
        structures: [...companies, ...technologies, downloadButton],
        playerHitbox: playerHitbox
    });

    // Collision detection hook
    const { nearbyStructure } = useCollisionDetection({
        playerPosition,
        structures: [...companies, ...technologies, downloadButton],
        interactionRadius: 70
    });

    // Handle structure interaction
    useEffect(() => {
        if (nearbyStructure && !showDialog && nearbyStructure.id !== downloadButton.id) {
            setSelectedStructure(nearbyStructure);
            setShowDialog(true);
        } else if (!nearbyStructure && showDialog) {
            const timer = setTimeout(() => {
                setShowDialog(false);
                setSelectedStructure(null);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [nearbyStructure, showDialog]);

    // Handle back to home
    const handleBackToHome = () => {
        navigate('/');
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        setSelectedStructure(null);
    };

    // Show loading screen while resources are loading
    if (isLoading) {
        return (
            <div className="sandbox-loading">
                <div className="sandbox-load rpgui-content">
                    <div className="rpgui-container framed">
                        <h2>Loading Sandbox</h2>
                        <p>Preparing your journey through my career path...</p>

                        {(error && process.env.REACT_APP_ENV === 'development') && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                                {error} (continuing anyway...)
                            </p>
                        )}

                        {/* Custom Pixel Art Progress Bar */}
                        <div className="loading-bar-container mb-3">
                            <PixelProgressBar
                                progress={progress}
                                width={85}
                                minWidth={280}
                                height={24}
                                variant="golden"
                                animated={true}
                                showPercentage={false}
                            />
                        </div>

                        <p className="loading-percentage">{progress}%</p>
                        <p className="loading-details">
                            Loading {requiredResources.images.length + requiredResources.audio.length} resources...
                        </p>
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
                        {/* Terrain Background (Grass) */}
                        <TerrainRenderer worldConfig={worldConfig} />

                        {/* Dynamic Path System */}
                        <PathRenderer
                            pathSegments={pathSegments}
                            tileSize={worldConfig.tileSize}
                        />

                        {/* Technologies (Statues) */}
                        <div className='structure-container'>
                            {technologies.map((tech) => (
                                <Structure
                                    key={tech.id}
                                    data={tech}
                                    type="technology"
                                    isNearby={nearbyStructure?.id === tech.id}
                                    playerPosition={playerPosition}
                                />
                            ))}
                        </div>

                        {/* Companies (Buildings) */}
                        <div className='structure-container'>
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

                        {/* Environment Elements */}
                        <div className='structure-container'>
                            {treesEnvironments.map((environment, index) => (
                                <Environment
                                    key={index}
                                    environment={environment}
                                    size={256}
                                />
                            ))}
                        </div>

                        <div className='structure-container'>
                            {detailsEnvironments.map((environment, index) => (
                                <Environment
                                    key={index}
                                    environment={environment}
                                    size={128}
                                />
                            ))}
                        </div>

                        {/* Download CV Button */}
                        <div className='structure-container'>
                            <DownloadCV
                                structure={downloadButton}
                                isNearby={nearbyStructure?.id === downloadButtonId}
                                playerPosition={playerPosition}
                            />
                        </div>

                        {/* Player Character */}
                        <Player
                            position={playerPosition}
                            isMoving={isMoving}
                            direction={direction}
                        />

                        {/* Debug hitboxes in development */}
                        {process.env.REACT_APP_ENV === 'development' && (
                            <>
                                {/* Player hitbox */}
                                <div
                                    className="debug-hitbox player-hitbox"
                                    style={{
                                        position: 'absolute',
                                        left: playerPosition.x + playerHitbox.x,
                                        top: playerPosition.y + playerHitbox.y,
                                        width: playerHitbox.width,
                                        height: playerHitbox.height,
                                        border: '2px solid lime',
                                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                                        pointerEvents: 'none',
                                        zIndex: 9999
                                    }}
                                />

                                {/* Structure hitboxes */}
                                {[...companies, ...technologies].map((structure) =>
                                    structure.data.collisionHitbox && (
                                        <div
                                            key={`hitbox-${structure.id}`}
                                            className="debug-hitbox structure-hitbox"
                                            style={{
                                                position: 'absolute',
                                                left: structure.position.x + structure.data.collisionHitbox.x,
                                                top: structure.position.y + structure.data.collisionHitbox.y,
                                                width: structure.data.collisionHitbox.width,
                                                height: structure.data.collisionHitbox.height,
                                                border: '2px solid red',
                                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                pointerEvents: 'none',
                                                zIndex: 9998
                                            }}
                                        />
                                    )
                                )}
                            </>
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
                            <p className="revert-top">🏠 Home</p>
                        </button>
                    </div>
                    
                    {/* Controls Info */}
                    <div className="controls-info">
                        
                        
                        {/* Mobile controls info */}
                        {isMobile ? (
                            <div className="rpgui-container framed-grey">
                                <p className="control-info-text mb-0">
                                    <strong>Use joystick</strong> to move around
                                    <br /> <strong>Walk near</strong> structures to know me!
                                </p>
                            </div>
                        ) : 
                        <div className="rpgui-container framed-grey">
                            <p className="control-info-text mb-0">
                                <strong>WASD</strong> or <strong>ARROWS</strong> to move • <strong>SHIFT</strong> or <strong>SPACE</strong> to run
                                <br /> <strong>Walk near</strong> structures to know me!
                            </p>
                        </div>
                        }
                    </div>

                    {/* Mini Map */}
                    <div className="minimap">
                        {/* Mobile Joystick */}
                        {isMobile && (
                            <div className="mobile-joystick">
                                <Joystick
                                    size={100}
                                    sticky={false}
                                    baseColor="#4950579e"
                                    stickColor="rgb(210 125 44)"
                                    move={handleJoystickMove}
                                    stop={handleJoystickStop}
                                    throttle={16}
                                    minDistance={15}
                                />
                            </div>
                        )}

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
                                        className={`minimap-structure ${structure.type} ${structure.name === '???' ? 'future' : ''
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