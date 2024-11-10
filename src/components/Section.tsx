/** A section card.*/
const Section: React.FC<{
  name: string;
  headerElements?: React.ReactNode;
  children: React.ReactNode;
}> = ({ name, headerElements, children }) => (
  <div className="section">
    <div className="section-header">
      <h2>{name}</h2>
      {headerElements}
    </div>
    {children}
  </div>
);

export default Section;
