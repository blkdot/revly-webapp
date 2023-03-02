import './Title.scss';

const MainTitle: React.FC<{ children: string }> = ({ children }) => (
  <div className='main-title-kit'>{children}</div>
);

export default MainTitle;
