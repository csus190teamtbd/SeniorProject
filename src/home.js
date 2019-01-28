
class homeModule{
  constructor(){
    this.mainContent = document.querySelector('#main-content');
    this.classList = ['one Proportion', 'two Proportion', 'One Mean', 'two Mean']
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  loadUI(){
    while (this.mainContent.firstChild)
      this.mainContent.firstChild.remove();
    
    let div = document.createElement('div');
    div.classList.add('bg-light', 'container');
    div.setAttribute('id', 'main-menu');

    let html = `<ul>`
    this.classList.forEach(x => {
      html += `<li><a href='#' class="btn" id="${x.replace(/\s/g, '')}">${this.capitalizeFirstLetter(x)}</a></li>`;
    })
    html += '</ul>'
    // let html = this.classList.reduce(
    //   (acc, x) => acc+`<button class="btn" type="button" id="${x.replace(/\s/g, '')}">${this.capitalizeFirstLetter(x)}</button>`, '');
    
    div.innerHTML = html;
    this.mainContent.append(div);
  }

  loadActionListioner(){
    document.querySelector('#main-menu').addEventListener('click', (e)=>{
      console.log(e.target.textContent);
      if (e.target.textContent === 'One Proportion'){
        
        import('./oneProportion/oneProportion')
          .then(x=>x.oneProportion.init());
      }
    });
  } 
}

export const home = new homeModule();