import './App.css';
import ProjectCard from './Card';
import inventoryImg from './card-images/inventory.png';
import todoImg from './card-images/to-do-list.png';
import quizImg from './card-images/quiz.jpg';
import portfolioImg from './card-images/portfolio.png';
import {useMediaQuery} from 'react-responsive';

function App() {
  const isDesktopScreen = useMediaQuery({
    query:'(min-width:1224px)'
  });
  return (
    <div className={`bg-dark container-fluid main-body ${isDesktopScreen? 'vh-100 p-5' : 'p-2'}`}style={{
      color:'#F8F8F8'
    }}>
      <div className={`rounded px-5 py-5 flex-fill overflow-y-auto ${isDesktopScreen? 'flex-fill me-5' : 'my-w-90 mb-3'}`} style={{
        backgroundColor:'#585858'
      }}>
        <p>Hi, I'm Abhiram R.</p>
        <p>A software developer passionate in building user-friendly web applications</p>
        <p className="mb-3"><strong>Skills</strong></p>
        <div className="rounded w-75 p-3 skill-card" animate={{x:'-100px'}}>HTML</div>
        <div className="rounded w-75 p-3 skill-card my-3" animate={{x:'-100px'}}>CSS</div>
          <div className="rounded w-75 p-3 skill-card my-3" animate={{x:'-100px'}}>JavaScript</div>
          <div className="rounded w-75 p-3 skill-card my-3" animate={{x:'-100px'}}>React</div>
          <div className="rounded w-75 p-3 skill-card my-3" animate={{x:'-100px'}}>Bootstrap</div>
          <div className="rounded w-75 p-3 skill-card my-3" animate={{x:'-100px'}}>SQL</div>
          <div className="rounded w-75 p-3 skill-card mt-3" animate={{x:'-100px'}}>Firebase</div>
      </div>
      <div className={`rounded p-5 ${isDesktopScreen ? 'flex-fill' : 'my-w-90'}`} style={{
        backgroundColor:'#585858'
      }}>
        <h1 className="mb-5">My Projects</h1>
        <ProjectCard img={inventoryImg} projectName='Item inventory' link='https://github.com/abhiram12345/inventory'/>
        <ProjectCard img={todoImg} projectName='To-do list' link='https://github.com/abhiram12345/To-do-list'/>
        <ProjectCard img={quizImg} projectName='Quiz' link='https://github.com/abhiram12345/quiz'/>
        <ProjectCard img={portfolioImg} projectName='Portfolio' link='https://github.com/abhiram12345/abhiram12345.github.io'/>
      </div>
    </div>
  );
}

export default App;
