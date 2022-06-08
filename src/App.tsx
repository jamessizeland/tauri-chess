import { useState } from 'react';
import { SketchPicker, Color } from 'react-color';

function App() {
  const [color, setColor] = useState<Color>('#1fa9f4');

  return (
    <div>
      <p>Hello Tauri</p>
      <SketchPicker
        color={color}
        onChange={(color, event) => {
          setColor(color.hex);
        }}
      />
    </div>
  );
}

export default App;
