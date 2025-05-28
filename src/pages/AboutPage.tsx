const AboutPage: React.FC = () => (
  <div className="animate-backInRight animate-fast">
    <h1 className="text-3xl font-bold underline text-center">About Page</h1>
    <div className="text-center mt-5">
      <ul>
        <li>Written by: James Sizeland</li>
        <li>Uses fork of chessboardjsx React library</li>
        <li>Uses fork of Kimia-UI library</li>
        <li>Built using Tauri and Rust for the backend</li>
        <li>Built using Vitejs TypeScript React for the frontend</li>
      </ul>
    </div>
  </div>
);

export default AboutPage;
