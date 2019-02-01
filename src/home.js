
class homeModule{
  constructor(){
    this.mainContent = document.querySelector('#main-content');
    this.methods = ['One Proportion', 'Two Proportion', 'One Mean', 'Two Mean']
  }

  loadUI(){
    while (this.mainContent.firstChild)
      this.mainContent.firstChild.remove();
    
    let div = document.createElement('div');
    div.classList.add('bg-light', 'container');
    div.setAttribute('id', 'main-menu');

    let html = `<ul>`
    this.methods.forEach(x => {
      html += `<li><a href='#' class="btn">${x}</a></li>`;
    })
    html += '</ul>'
    
    div.innerHTML = html;
    this.mainContent.append(div);
  }

  loadActionListioner(){
    document.querySelector('#main-menu').addEventListener('click', (e)=>{
      if (e.target.textContent === 'One Proportion'){
        
        import('./oneProportion/oneProportion')
          .then(x=>x.oneProportion.init());
      }
    });
  } 
}

export const home = new homeModule();