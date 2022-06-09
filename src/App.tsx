import { useState } from 'react';
import { SketchPicker, Color } from 'react-color';
import { invoke } from '@tauri-apps/api/tauri';

type GradientType = number[][];

function App() {
  const [color, setColor] = useState<Color>('#1fa9f4');
  const [gradient, setGradient] = useState<GradientType>();

  return (
    <div>
      <SketchPicker
        color={color}
        onChange={(color, event) => {
          setColor(color.hex);
          console.log(color.hex);
          invoke<GradientType>('generate_gradient', {
            r: color.rgb.r,
            g: color.rgb.g,
            b: color.rgb.b,
          }).then((grad) => {
            console.log(grad);
            setGradient(grad);
          });
        }}
      />
      {gradient ? (
        gradient.map((color) => (
          <div
            style={{
              padding: '11px',
              background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            }}
          >
            rgb({color[0]}, {color[1]}, {color[2]})
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
