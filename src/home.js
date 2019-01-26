
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
    div.classList.add('bg-light', 'container', 'mt-10', 'col-8');
    
    let html = this.classList.reduce(
      (acc, x) => acc+`<button class="btn btn-primary mb-5 btn-lg btn-block" type="button" id="${x.replace(/\s/g, '')}">${this.capitalizeFirstLetter(x)}</button>`, '');
    
    div.innerHTML = html;
    this.mainContent.append(div);
  }

  loadActionListioner(){
    this.mainContent.addEventListener('click', (e)=>{
      if (e.target.textContent === 'One Proportion'){
        import('./oneProportion/oneProportion')
          .then(x=>x.oneProportion.loadUI());
      }
    });
  } 
}

export const home = new homeModule();