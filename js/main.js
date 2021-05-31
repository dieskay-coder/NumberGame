'use strict';

{
  class Panel {
    constructor(game) {
      this.game = game;
      this.el = document.createElement('li');
      this.el.classList.add('pressed');
      this.el.addEventListener('click', () => {
        this.check();
      });
    }

    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove('pressed');
      this.el.textContent = num;
    }

    // currentNumと押し込んだ数値が合っているかをチェックする関数
    check() {
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        soundB.load();
        soundB.play();
        this.el.classList.add('pressed');
        this.game.addCurrentNum();

        // 全て押し込むと、時間を止める
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          window.setTimeout (() => {
            soundY.load();
            soundY.play();
          },1000);
          clearTimeout(this.game.getTimeoutId());
        }
      }else {
        soundNg.load();
        soundNg.play();
      }
    }
  }
  
  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }
  
    setup() {
      const board = document.getElementById('board');
      this.panels.forEach(panel => {
        board.appendChild(panel.getEl());
      });
    }

    activate() {
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }

      // numsからspliceした要素の0番目を順に抜き出している
      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.activate(num);
      });
    }
  }

  
  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);
      
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;
      
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        this.start();
        soundS.load();
        soundS.play();
      });
      this.setup();
    }

    // 動的にサイズを変えるためのメソッド
    setup() {
      const container =document.getElementById('container');
      const PANEL_WIDTH = 100;
      const BOARD_PADDING = 20;
      container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
    }

    // タイマーが2重に動かないようにするメソッド
    start() {
      if (typeof this.timeoutId !== 'undefined') {
        clearTimeout(this.timeoutId);
      }
        
      this.currentNum = 0;
      this.board.activate();
        
      this.startTime = Date.now();
      this.runTimer();
    }

    runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent =((Date.now() - this.startTime) / 1000).toFixed(2);
    
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    addCurrentNum() {
      this.currentNum++;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }
  }

  const soundS = new Audio("start.mp3");
  const soundB = new Audio("button.mp3");
  const soundY = new Audio("yay.mp3");
  const soundNg = new Audio("ng.mp3");

  // ここの数値で難易度設定
  new Game(4);
}