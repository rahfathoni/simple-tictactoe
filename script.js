// logic
var Play = {
    newBoard: function(size, winCount) {
        this.board = this.board || [];
        for (var i = 0; i < size; i++) {
            this.board[i] = Array(size).fill('.');
        }
        this.countWin = winCount;
        this.finish = false;
        this.lastPlayer = '';
        console.log(`[newBoard] board ${size}x${size}, win ${winCount} in row`);
        console.table(this.board)
    },
    addMark: function(player, row, col) {
        if (this.board[row][col] === '.') {
            this.board[row][col] = player;
            this.lastPlayer = player;
            return true;
        }
        if (['player1', 'player2'].includes(this.board[row][col])) {
            return 1;
        }
        return false;
    },
    checkRows: function(player) {
        for (let row = 0; row < this.board.length; row++) {
            let count = 0;
            this.winArray = [];
            for (let col = 0; col < this.board.length; col++) {
                
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
    },
    checkCols: function(player) {
        for (let col = 0; col < this.board.length; col++) {
            let count = 0;
            this.winArray = [];
            for (let row = 0; row < this.board.length; row++) {
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
    },
    // top left to bottom right
    checkDiagonalLR: function(player) {
        let count = 0;
        let length = this.board.length;
        this.winArray = [];
        let maxLength = length - this.countWin + 1;
        // bottom half diagonal (with middle)
        for (let rowStart = 0; rowStart < maxLength; rowStart++) {
            for (let row = rowStart, col = 0; row < length && col < length; row++, col++) {
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
        // top half diagonal (without middle)
        for (let colStart = 1; colStart < maxLength; colStart++) {
            for (let col = colStart, row = 0; col < length && row < length; col++, row++) {
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
    },
    // top right to bottom left
    checkDiagonalRL: function(player) {
        let count = 0;
        let length = this.board.length;
        let maxLength = length - this.countWin + 1;
        this.winArray = [];
        // bottom half diagonal (with middle)
        for (let rowStart = 0; rowStart < maxLength; rowStart++) {
            for (let row = rowStart, col = (length - 1); row < length && col >= 0; row++, col--) {
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
        // top half diagonal (without middle)
        for (let colStart = (length - 2); colStart > (this.countWin - 2); colStart--) {
            for (let col = colStart, row = 0; col >= 0 && row <= (length - 2);
              (col-- && row++)) {
                if (this.board[row][col] === player) {
                    count++;
                    this.winArray.push(Array(row, col));
                } else {
                    count = 0;
                    this.winArray = [];
                }
                if (count === this.countWin) {
                    this.finish = true;
                    return true;
                }
            }
        }
    },
    isEmpty: function() {
        let check = true;
        for (let i = 0; i < this.board.length; i++) {
          if (this.board[i].includes('.')) {
            return false;
          }
        }
        return check;
    },
    checkAll: function(player) {
        if(this.checkRows(player)) {
            return true;
        }
        if(this.checkCols(player)) {
            return true;
        }
        if(this.checkDiagonalLR(player)){
            return true;
        }
        if(this.checkDiagonalRL(player)) {
            return true;
        }
        if (!this.finish && this.isEmpty()) {
            return true;
        }
    }
}

$(document).ready(function() {
    // state
    var $document = $(document);
    let $body = $('body');
    let $players = $('.players');
    let $select = $('select');
    let $info = $('#containerInformation');
    let $cell;
    let $buildButton = $('#buttonBoardSizeSubmit'); 
    let size;
    let winCount = 3;
    let player;
    let player1Score = 0;
    let player2Score = 0;

    // Board configuration
    let configValues = function() {
        size = parseInt($("#selectBoardSizeConfig option:selected").val());
        console.log('[configValues] size', size)
    };
    $select.change(configValues)
    configValues();
    let generateBoard = function() {
        Play.newBoard(size, winCount);
        let dimension = `${Math.floor(100 / size)-1}%`;
        let count = 0;
        let list = '';
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                count++;
                list += "<div class='cell' row=" + "'" + row + "' col='" + col + "'>" + count + "</div>";
            }
        }
        $('.container').html(list);
        $cell = $('.cell');
        $cell.css({
            "width": dimension,
            "height": dimension
        });
        $cell.removeClass('player1');
        $cell.removeClass('player2');
        $cell.on('click', takeMove);
        $('#containerReset').removeClass().addClass('button-display-none');
        player = '';
        $players.on('click', 'button', buttonPlayer);
        $body.addClass('reset');
        $info.html("Let's Play").removeClass();
        return true;
    }
    $buildButton.on('click', generateBoard);

    // Player
    let pickPlayer = function(name) {
        player = name;
        console.log(`${player} turn`);
        $info.html(`${player} turn`).removeClass().addClass(player);
    }
    $document.on('keypress', function(event) {
    if (event.keyCode === 32) {
        if (player === 'player1') {
          pickPlayer('player2')
        }
        if (player === 'player2') {
          pickPlayer('player1')
        }
      }
    })
    let buttonPlayer = function() {
        let el = $(this).attr('class');
        pickPlayer(el)
    }
    $players.on('click', 'button', buttonPlayer)

    // Board
    let takeMove = function() {
        let el = $(this);
        let row = el.attr('row');
        let col = el.attr('col');
        if (!player) {
            $info.html("Please choose the player");
            return true;
        }
        if (player === Play.lastPlayer && player) {
            $info.html("Please Switch Player. Press player button or Spacebar")
            return true;
        }
        let add = Play.addMark(player, row, col);
        if (add === 1) {
            $info.html("Box already filled. Choose other box.")
            return true;
        }
        if (add) {
            Play.checkAll(player);
            el.addClass(player);
            checkRound();
        }
        return true;
    }
    let checkRound = function() {
        if (Play.finish && Play.lastPlayer === 'player1') {
            player1Score++;
            $info.html('PLAYER 1 IS THE WINNER!! Reset Board to Continue').removeClass().addClass(Play.lastPlayer);
            $body.removeClass().addClass('player1');
            $cell.off('click');
            $players.off('click');
        }
        if (Play.finish && Play.lastPlayer === 'player2') {
            player2Score++;
            $info.html('PLAYER 2 IS THE WINNER!! Reset Board to Continue').removeClass().addClass(Play.lastPlayer);
            $body.removeClass().addClass('player2');
            $cell.off('click');
            $players.off('click');
        }
        if (Play.isEmpty() && !Play.finish) {
            $info.html('DRAW!! No point added. Reset Board to Continue').removeClass();
            $body.removeClass();
            $cell.off('click');
            $players.off('click');
        }
        $('button.player1 span').html(`Score: ${player1Score}`);
        $('button.player2 span').html(`Score: ${player2Score}`);
        $('#containerReset').removeClass().addClass('button-display-block');
    }

    // Reset Button
    let resetBoard = function() {
        Play.newBoard(size, winCount);
        $cell.removeClass('player1');
        $cell.removeClass('player2');
        $cell.on('click', takeMove);
        $('#containerReset').removeClass().addClass('button-display-none');
        player = '';
        $body.addClass('reset');
        $info.html("Let's Play again").removeClass();
    }
    $('#buttonReset').on('click', resetBoard);
});