let containerSplash = document.getElementById('foodmap-splash');
setTimeout(()=>{
    // quiero que cuando la animación se acabe, se agregue una clase
    containerSplash.classList.add('close');
    // después de 2 segundos, se le agregue la clase cerrar
    location.href = 'views/view1.html';
 },2000); 
 
//  document.addEventListener('DOMcontentLoaded', containerSplash);