import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useLoadingSplash } from '../../hooks/useLoadingSplash';
import { useTracking } from '../../hooks/useTracking';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { createPathGenerator } from '../../game/path/pathGeneration';
import GameScene from '../../game/GameScene';
import DebugOverlay from '../../game/DebugOverlay';
import Player from '../../components/Player/Player';
import Structure from '../../components/Structures/Structure';
import StructureDialog from '../../components/Structures/StructureDialog';
import PathRenderer from '../../components/Path/PathRenderer';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import Environment from '../../components/Structures/Environment';
import DownloadCV from '../../components/Structures/DownloadCV';
import LoadingSplash from '../../components/Common/LoadingSplash';
import MenuButton from '../../components/GameMenu/MenuButton';
import FirstVisitSetup from '../../components/FirstVisit/FirstVisitSetup';
import { useGameMenu } from '../../components/GameMenu/GameMenuContext';
import DailyQuest from '../../components/DailyQuest/DailyQuest';
import WelcomeDialog from '../../components/WelcomeDialog/WelcomeDialog';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  worldConfig,
  mainPathConfig,
  playerHitbox,
  playerSpawnPosition,
  terrainAutoRotate,
  pathGenerationEnabled,
  mainTerrainImage,
} from '../../config/world';
import { companies, technologies } from '../../config/career';
import { treesEnvironments, detailsEnvironments } from '../../config/environments';
import {
  downloadButton,
  hideDownloadButtonInSandbox,
  sandboxAudioTrack,
  sandboxBackgroundImage,
} from '../../config/sandbox';
import { questSuffix } from '../../config/tracking';
import { COMPANY_IDS } from '../../config/ids';
import { preloadPathSprites, preloadPlayerSprites } from '../../config/assets';
import { DownloadButtonStructure, StructureData } from '../../types/sandbox';
import './SandboxPage.css';

interface SandboxContainerCSSProperties extends React.CSSProperties {
  '--sandbox-background-image'?: string;
}

const sandboxContainerStyle: SandboxContainerCSSProperties = {
  '--sandbox-background-image': `url(${sandboxBackgroundImage})`,
};

const careerStructures: StructureData[] = [...companies, ...technologies];
const interactiveStructures: (StructureData | DownloadButtonStructure)[] = hideDownloadButtonInSandbox
  ? careerStructures
  : [...careerStructures, downloadButton];
const environments = [...treesEnvironments, ...detailsEnvironments];

const isDownloadButton = (s: StructureData | DownloadButtonStructure): s is DownloadButtonStructure =>
  s.id === downloadButton.id;

const worldBounds = {
  minX: 50,
  minY: 50,
  maxX: worldConfig.width - 50,
  maxY: worldConfig.height - 50,
};

const requiredImages: string[] = [
  mainTerrainImage,
  ...preloadPathSprites,
  ...preloadPlayerSprites,
  sandboxBackgroundImage,
  ...companies.flatMap((c) => [c.data.image, c.data.signpost]),
  ...technologies.map((t) => t.data.image),
  ...environments.map((e) => e.image),
  ...(hideDownloadButtonInSandbox ? [] : [downloadButton.data.image]),
].filter((src): src is string => !!src);

const debugHitboxes = [
  ...careerStructures.flatMap((s) =>
    s.data.collisionHitbox ? [{ id: s.id, position: s.position, hitbox: s.data.collisionHitbox }] : []
  ),
  ...environments.flatMap((e, i) =>
    e.collisionHitbox ? [{ id: `env-${i}`, position: e.position, hitbox: e.collisionHitbox }] : []
  ),
];

interface StaticWorldProps {
  nearbyId: string | null;
}

// re-renders only when the nearby structure changes, never on a player step
const StaticWorld: React.FC<StaticWorldProps> = React.memo(({ nearbyId }) => {
  const pathSegments = useMemo(
    () =>
      pathGenerationEnabled
        ? createPathGenerator({
            startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
            endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
            structures: careerStructures,
            tileSize: worldConfig.tileSize,
          }).generatePath()
        : [],
    []
  );

  return (
    <>
      <TerrainRenderer worldConfig={worldConfig} autoRotate={terrainAutoRotate} />
      <PathRenderer pathSegments={pathSegments} tileSize={worldConfig.tileSize} />

      <div className="structure-container">
        {technologies.map((tech) => (
          <Structure key={tech.id} data={tech} type="technology" isNearby={nearbyId === tech.id} />
        ))}
      </div>

      <div className="structure-container">
        {companies.map((company) => (
          <Structure key={company.id} data={company} type="building" isNearby={nearbyId === company.id} />
        ))}
      </div>

      <div className="structure-container">
        {treesEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={256} />
        ))}
      </div>

      <div className="structure-container">
        {detailsEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={128} />
        ))}
      </div>

      {!hideDownloadButtonInSandbox && (
        <div className="structure-container">
          <DownloadCV structure={downloadButton} isNearby={nearbyId === downloadButton.id} />
        </div>
      )}
    </>
  );
});

const Minimap: React.FC = React.memo(() => (
  <>
    <div className="minimap-main-path" />
    {careerStructures.map((structure) => (
      <div
        key={structure.id}
        className={`minimap-structure ${structure.type} ${structure.id === COMPANY_IDS.futureOpportunity ? 'future' : ''}`}
        style={{
          left: `${(structure.position.x / worldConfig.width) * 100}%`,
          top: `${(structure.position.y / worldConfig.height) * 100}%`,
        }}
        title={structure.name}
      />
    ))}
  </>
));

const SandboxPage: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<StructureData | null>(null);
  const isMobile = useIsMobile();
  const { tipsAcceptedDesktop, tipsAcceptedMobile } = useSelector((state: RootState) => state.welcome);
  const { isOpen: menuOpen } = useGameMenu();

  const { trackInteraction } = useTracking({ page: 'sandbox' });

  const splash = useLoadingSplash(requiredImages);
  const splashCovering = splash.visible && !splash.leaving;
  const canPlayerMove = (tipsAcceptedDesktop || tipsAcceptedMobile) && !menuOpen && !splashCovering;

  const { playerPosition, isMoving, direction, handleJoystickMove, handleJoystickStop } = usePlayerMovement({
    initialPosition: playerSpawnPosition,
    speed: 270,
    worldBounds,
    structures: interactiveStructures,
    environments,
    playerHitbox,
    canMove: canPlayerMove,
  });

  const { nearbyStructure } = useCollisionDetection({
    playerPosition,
    structures: interactiveStructures,
    interactionRadius: 70,
  });

  // closing waits a beat so walking along a radius edge does not flicker it
  useEffect(() => {
    if (nearbyStructure && !isDownloadButton(nearbyStructure)) {
      setSelectedStructure(nearbyStructure);
      return;
    }
    const timer = setTimeout(() => setSelectedStructure(null), 50);
    return () => clearTimeout(timer);
  }, [nearbyStructure]);

  useEffect(() => {
    if (nearbyStructure) {
      trackInteraction(nearbyStructure.data.id + questSuffix);
    }
  }, [nearbyStructure, trackInteraction]);

  return (
    <div className="rpgui-content">
      {splash.visible && (
        <LoadingSplash title="A new journey begins!" leaving={splash.leaving} loaded={splash.loaded} total={splash.total} />
      )}
      <div className="sandbox-container" style={sandboxContainerStyle}>
        <GameScene
          name="sandbox"
          world={worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop }}
          music={sandboxAudioTrack}
          playerHitbox={playerHitbox}
          overlay={
            <div className="sandbox-ui">
              <WelcomeDialog isMobile={isMobile} />
              <div className="back-button ms-3">
                <MenuButton />
              </div>
              {!splash.visible && (
                <div className="minimap">
                  <div className="rpgui-container framed-grey">
                    <div className="minimap-content">
                      <Minimap />
                      <div
                        className="minimap-player"
                        style={{
                          left: `${(playerPosition.x / worldConfig.width) * 100}%`,
                          top: `${(playerPosition.y / worldConfig.height) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        >
          <StaticWorld nearbyId={nearbyStructure?.id ?? null} />
          <Player position={playerPosition} isMoving={isMoving} direction={direction} />
          <DebugOverlay hitboxes={debugHitboxes} />
        </GameScene>

        {selectedStructure && <StructureDialog structure={selectedStructure} />}
        <DailyQuest questSuffix={questSuffix} showProgress={true} />
      </div>
    </div>
  );
};

const SandboxRoute: React.FC = () => (
  <FirstVisitSetup>
    <SandboxPage />
  </FirstVisitSetup>
);

export default SandboxRoute;
