import React from 'react';
import { StructureData, Position, CompanyData, TechnologyData } from '../../types/sandbox';
import './StructureDialog.css';

interface StructureDialogProps {
  structure: StructureData;
  onClose: () => void;
  position: Position;
}

const StructureDialog: React.FC<StructureDialogProps> = ({ structure, onClose, position }) => {
  const isCompany = structure.type === 'building';
  const companyData = isCompany ? structure.data as CompanyData : null;
  const techData = !isCompany ? structure.data as TechnologyData : null;

  // Calculate dialog position relative to viewport
  const getDialogStyle = () => {
    return {
      position: 'fixed' as const,
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      maxWidth: '90vw',
      width: '400px',
      height: '100vh',
      boxSizing: 'border-box' as const,
      minWidth: '200px',
    };
  };

  

  return (
    <>
      {/* Dialog */}
      <div className="structure-dialog" style={getDialogStyle()}>
        <div className="rpgui-content">
          <div className={`rpgui-container ${isCompany ? 'framed-golden' : 'framed'}`}>
            
            <h3 className="structure-title dialog-title">
              {structure.name}
            </h3>

            <div className="dialog-separator">
              <hr className={isCompany ? 'golden' : ''} />
            </div>
            
            <div className="dialog-content-structure">
              {isCompany && companyData ? (
                <CompanyInfo company={companyData} />
              ) : (
                <TechnologyInfo technology={techData!} />
              )}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

// Company information component
const CompanyInfo: React.FC<{ company: CompanyData }> = ({ company }) => (
  <div className="company-info">
    <div className="info-section">
      <label>Role:</label>
      <p>{company.role}</p>
    </div>
    
    <div className="info-section">
      <label>Period:</label>
      <p>{company.period}</p>
    </div>
    
    <div className="info-section">
      <label>Description:</label>
      <p>{company.description}</p>
    </div>
    
    <div className="info-section">
      <label>Technologies Used:</label>
      <div className="tech-tags">
        {company.technologies.map((tech, index) => (
          <span key={index} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
    </div>
    
    {company.website && (
      <div className="info-section">
        <label>Website:</label>
        <a 
          href={company.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="company-link"
        >
          Visit Company
        </a>
      </div>
    )}
  </div>
);

// Technology information component
const TechnologyInfo: React.FC<{ technology: TechnologyData }> = ({ technology }) => (
  <div className="technology-info">
    <div className="info-section">
      <label>Category:</label>
      <p>{technology.category}</p>
    </div>
    
    <div className="info-section">
      <label>Experience Level:</label>
      <span className={`level-badge ${technology.level?.toLowerCase()}`}>
        {technology.level}
      </span>
    </div>
    
    <div className="info-section">
      <label>Years of Experience:</label>
      <p>{technology.yearsExperience} years</p>
    </div>
    
    <div className="info-section">
      <label>Description:</label>
      <p>{technology.description}</p>
    </div>
    
    {technology.extras && technology.extras.length > 0 && (
      <div className="info-section">
        <label>Correlated & Skills:</label>
        <div className="tech-tags">
          {technology.extras.map((extra, index) => (
            <span key={index} className="tech-tag">
              {extra}
            </span>
          ))}
        </div>
      </div>
    )}
    
    {technology.projects && technology.projects.length > 0 && (
      <div className="info-section">
        <label>Notable Projects:</label>
        <ul className="project-list">
          {technology.projects.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default StructureDialog;