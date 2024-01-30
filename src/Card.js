import gitHubIcon from './card-images/github-mark.png';

export default function ProjectCard({img, projectName, link}){
    return(<div className="d-flex justify-content-between align-items-center bg-light rounded my-3" style={{
        width:'80%',
        height:'100px'
    }}>
    <img className="me-3" src={img} height='100%' width='100px'/>
    <div className="flex-grow-1">
        <div className="text-dark mb-3">{projectName}</div>
        <a href={link} target="_blank"><img src={gitHubIcon} width="25px" height="25px" alt="GitHub logo"/></a>
    </div>
    </div>);
}