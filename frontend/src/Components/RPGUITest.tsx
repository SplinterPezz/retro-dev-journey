// src/Components/RPGUITest.tsx
import React, { useEffect, useRef } from 'react';

const RPGUITest: React.FC = () => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    // Aspetta che RPGUI sia caricato
    const initRPGUI = () => {
      if (window.RPGUI) {
        // Inizializza elementi dinamici se necessario
        if (sliderRef.current) {
          window.RPGUI.create(sliderRef.current, "slider");
        }
        if (progressRef.current) {
          window.RPGUI.set_value(progressRef.current, 0.7); // 70%
        }
        if (dropdownRef.current) {
          window.RPGUI.create(dropdownRef.current, "dropdown");
        }
      } else {
        // Riprova dopo un po' se RPGUI non è ancora caricato
        setTimeout(initRPGUI, 100);
      }
    };

    initRPGUI();
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Slider value:', e.target.value);
  };

  const handleButtonClick = () => {
    alert('RPG Button clicked!');
  };

  return (
    <div className="rpgui-content">
      <div className="rpgui-container framed-golden" style={{ padding: '20px', margin: '20px' }}>
        <h2>RPGUI Test Components</h2>
        
        {/* Button */}
        <div style={{ marginBottom: '20px' }}>
          <label>RPG Button:</label>
          <br />
          <button className="rpgui-button" type="button" onClick={handleButtonClick}>
            <p>Click me!</p>
          </button>
        </div>

        {/* Golden Button */}
        <div style={{ marginBottom: '20px' }}>
          <label>Golden Button:</label>
          <br />
          <button className="rpgui-button golden" type="button" onClick={handleButtonClick}>
            <p>Golden Click!</p>
          </button>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label>RPG Slider:</label>
          <br />
          <input 
            ref={sliderRef}
            className="rpgui-slider" 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="50"
            onChange={handleSliderChange}
          />
        </div>

        {/* Golden Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label>Golden Slider:</label>
          <br />
          <input 
            className="rpgui-slider golden" 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="30"
          />
        </div>

        {/* Progress Bars */}
        <div style={{ marginBottom: '20px' }}>
          <label>Health Bar (Red):</label>
          <div className="rpgui-progress red" style={{ marginBottom: '10px' }}></div>
          
          <label>Mana Bar (Blue):</label>
          <div ref={progressRef} className="rpgui-progress blue" style={{ marginBottom: '10px' }}></div>
          
          <label>Energy Bar (Green):</label>
          <div className="rpgui-progress green"></div>
        </div>

        {/* Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label>RPG Dropdown:</label>
          <br />
          <select ref={dropdownRef} className="rpgui-dropdown">
            <option value="warrior">Warrior</option>
            <option value="mage">Mage</option>
            <option value="archer">Archer</option>
            <option value="thief">Thief</option>
          </select>
        </div>

        {/* List */}
        <div style={{ marginBottom: '20px' }}>
          <label>RPG List:</label>
          <br />
          <select className="rpgui-list">
            <option value="sword">Iron Sword</option>
            <option value="shield">Steel Shield</option>
            <option value="potion">Health Potion</option>
            <option value="armor">Leather Armor</option>
          </select>
        </div>

        {/* Icons */}
        <div style={{ marginBottom: '20px' }}>
          <label>RPG Icons:</label>
          <br />
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className="rpgui-icon sword"></div>
            <div className="rpgui-icon shield"></div>
            <div className="rpgui-icon potion-red"></div>
            <div className="rpgui-icon potion-green"></div>
            <div className="rpgui-icon potion-blue"></div>
            <div className="rpgui-icon exclamation"></div>
          </div>
        </div>

        {/* Checkboxes */}
        <div style={{ marginBottom: '20px' }}>
          <label>Checkboxes:</label>
          <br />
          <div>
            <input className="rpgui-checkbox" type="checkbox" id="cb1" />
            <label htmlFor="cb1">Normal Checkbox</label>
          </div>
          <div>
            <input className="rpgui-checkbox golden" type="checkbox" id="cb2" />
            <label htmlFor="cb2">Golden Checkbox</label>
          </div>
        </div>

        {/* Radio Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <label>Radio Buttons:</label>
          <br />
          <div>
            <input className="rpgui-radio" type="radio" name="difficulty" value="easy" id="rd1" />
            <label htmlFor="rd1">Easy</label>
          </div>
          <div>
            <input className="rpgui-radio" type="radio" name="difficulty" value="normal" id="rd2" />
            <label htmlFor="rd2">Normal</label>
          </div>
          <div>
            <input className="rpgui-radio golden" type="radio" name="difficulty" value="hard" id="rd3" />
            <label htmlFor="rd3">Hard (Golden)</label>
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ marginBottom: '20px' }}>
          <label>Text Input:</label>
          <br />
          <input type="text" placeholder="Enter your character name..." />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Textarea:</label>
          <br />
          <textarea placeholder="Write your adventure story..." rows={4}></textarea>
        </div>

        {/* Separator */}
        <hr />
        
        <div style={{ marginBottom: '20px' }}>
          <label>Golden Separator:</label>
          <hr className="golden" />
        </div>

        <p>This is a paragraph with RPGUI styling. All text elements get automatic styling!</p>
      </div>
    </div>
  );
};

export default RPGUITest;