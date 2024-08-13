import React, { useState } from 'react';

const SwitchToggle = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="switch-toggle" onClick={toggleSwitch}>
      <div className={`switch-toggle-slider ${isToggled ? 'toggled' : ''}`}>
        <span className="toggle-text">{isToggled ? 'GOOD' : 'BAD'}</span>
      </div>
    </div>
  );
};

export default SwitchToggle;
