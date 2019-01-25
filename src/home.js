class homeModule{
  constructor(){
    this.mainContent = document.querySelector('#main-content');
    this.classList = ['One Proportion', 'Two Proportion', 'One Mean', 'Two Mean']
  }
  loadMainMenu(){
    while (this.mainContent.firstChild)
      this.mainContent.firstChild.remove();
    
    let div = document.createElement('div');
    div.classList.add('bg-light', 'container', 'mt-10', 'col-8');
    
    let html = this.classList.reduce(
      (acc, x) => acc+`<button class="btn btn-primary mb-5 btn-lg btn-block" type="button">${x}</button>`, '');
    
    console.log(this.mainContent);
    div.innerHTML = html;
    this.mainContent.append(div);

  }
}

export const home = new homeModule();