import { useState } from 'react';
import { SketchPicker, Color, RGBColor } from 'react-color';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
  const [color, setColor] = useState<Color>('#1fa9f4');

  return (
    <div>
      <p>Hello Tauri</p>
      <SketchPicker
        color={color}
        onChange={(color, event) => {
          setColor(color.hex);
          console.log(color.hex);
          invoke('generate_gradient', color.rgb);
        }}
      />
    </div>
  );
}

export default App;
