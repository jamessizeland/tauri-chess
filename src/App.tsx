import { useState } from 'react';
import { SketchPicker, Color, RGBColor } from 'react-color';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
  const [color, setColor] = useState<Color>('#1fa9f4');
  const [gradient, setGradient] = useState([]);

  return (
    <div>
      <p>Hello Tauri</p>
      <SketchPicker
        color={color}
        onChange={(color, event) => {
          setColor(color.hex);
          console.log(color.hex);
          invoke('generate_gradient', {
            r: color.rgb.r,
            g: color.rgb.g,
            b: color.rgb.b,
          }).then((grad) => {
            console.log(grad);
            setGradient(grad);
          });
        }}
      />
      {gradient.map((color) => (
        <div>
          rgb({color[0]}, {color[1]}, {color[2]})
        </div>
      ))}
    </div>
  );
}

export default App;
