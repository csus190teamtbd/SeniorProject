

class OneProportionModule{
  constructor(){
    this.mainContent = document.querySelector('#main-content');
  }
  loadUI(){
    while (this.mainContent.firstChild)
      this.mainContent.firstChild.remove();
    
    // let controlPanel = document.createElement('div');
    // controlPanel.classList.add('bg-light', 'container', 'mt-10', 'col-8');
    

    
    // div.innerHTML = html;
    // this.mainContent.append(div);
  }
}

export const oneProportion = new OneProportionModule();