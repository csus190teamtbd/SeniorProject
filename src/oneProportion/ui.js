class UI{

  constructor(){
    this.generateControlMenu = function(){
      const div = document.createElement('div');
      div.setAttribute('id', 'control');
      div.classList.add('container');
      div.innerHTML = 
      `<form>
        <div class='form-group'>
          <label for='probability'>Head Probability: <span id='probDisplay'>0.5</span></label>
          <input type='range' min=0 max=1 step=0.01 value='0.5' id='probability'>
          <p id='selectedProb'></p>
        </div>
        <div class='form-group'>
          <label for='coins'>Number of Coins</label>
          <input type='number' min=1 id='coins' value='5'>
        </div>
        <div class='form-group'>
          <label for='draws'>Add Samples</label>
          <input type='number' min=1 id='draws' value='1'>
        </div>
        <div class='form-group'>
          <label>Total Samples: <span id='totalFlips'>0</span></label>
        </div>
        <button type="submit" value="sample" class='btn' id ='sampleBtn'>Draw Samples</button>
        <button type="reset" value="reset" class='btn' id='resetBtn'>Reset</button>
      </div>
      </form>`
      return div;
    }

    this.generateView = () => {
      const div = document.createElement('div');
      div.setAttribute('id', 'view');
      div.appendChild(this.generateAnimation());
      div.appendChild(this.generateChart());
      return div;
    }

    this.generateAnimation = () =>{
      const div = document.createElement('div');
      div.setAttribute('id', 'animation');
      div.classList.add('container');
      div.textContent = "ANIMATION , COMING SOON";
      return div;
    }
  
    this.generateChart = () => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'chart');
      canvas.classList.add('container');
  
      return canvas;
    }
  }


  loadUI(){
    const mainContent = document.getElementById('main-content');
    while (mainContent.firstChild)
      mainContent.firstChild.remove();
    
    const div = document.createElement('div');
    div.setAttribute('id', 'mainpanel');
    div.appendChild(this.generateControlMenu());
    div.appendChild(this.generateView());
    mainContent.appendChild(div);
  }

  getUISelectors(){
    return {
      probabilityInput : document.getElementById('probability'),
      coinsInput : document.getElementById('coins'),
      probDisplay : document.getElementById('probDisplay'),
      drawInput : document.getElementById('draws'),
      chart: document.getElementById("chart"),
      totalFlips: document.getElementById("totalFlips"),
    }
  }


}

export const ui = new UI();