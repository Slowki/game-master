const HeaderButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <button onClick={onClick} className="header-button">
    {children}
  </button>
);

export default HeaderButton;
