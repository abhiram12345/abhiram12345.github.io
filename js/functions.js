import {routes} from './routes.js';
const onNavigate = (e) =>{
    let pathname = e.currentTarget.dataset.link;
    const newPath = pathname.split('?');
    history.pushState({}, ' ', pathname);
    routes[newPath[0]].render();
}
const navigate = (path, replaceState) =>{
    const pathname = path;
    const newPath = pathname.split('?');
    if (replaceState == true) {
        history.replaceState({}, ' ', pathname);
        routes[newPath[0]].render();
    }else {
        history.pushState({}, ' ', pathname);
        routes[newPath[0]].render();
    }
}
window.onpopstate = () =>{
    let pathname = window.location.pathname;
    const newPath = pathname.split('?');
    routes[newPath].render();
}
export {onNavigate, navigate};
