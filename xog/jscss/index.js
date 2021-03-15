

let tableCreate = (rowcol) => {
    let body = document.getElementsByTagName('body')[0];

    let oldtbl = document.getElementsByTagName('table')

    if (oldtbl.length !== 0) {

        body.removeChild(body.childNodes[body.childNodes.length - 1]);
    }
    let tbl = document.createElement('table');


    let numid = 1;
    for (let i = 0; i < rowcol; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < rowcol; j++) {

            let td = document.createElement('td');

            td.setAttribute("class", "cell");
            td.setAttribute("id", numid.toString());

            numid++;

            tr.appendChild(td)

        }
        tbl.appendChild(tr);

        tbl.style.marginLeft = rowcol * -55
    }

    body.appendChild(tbl)


}

let gentempArr = (rowcol) => {

    let ix = 0;
    var array = new Array(rowcol);
    for (var i = 0; i < rowcol; i++) {
        array[i] = new Array(rowcol);
        for (var j = 0; j < rowcol; j++) {
            array[i][j] = ix;
            ix++;
        }
    }

    return array;
}

let generateWins = (arr) => {
    let part1 = []
    let part2 = []
    let part3 = []
    let part4 = []
    let boolcheck = true;



    for (let i = 0; i < arr[0].length; i++) {
        let temp = []
        let temp2 = []
        for (let j = 0; j < arr[0].length; j++) {

            temp.push(arr[i][j])

            temp2.push(arr[j][i])


        }
        part1.push(temp)
        part2.push(temp2)
    }

    let tmprev = part2.reverse()
    let dis = arr.length;
    let realdis = 1;
    for (let i = 0; i < part1.length; i++) {
        for (let j = 0; j < part1.length; j++) {


            if (boolcheck && realdis === 1) {

                boolcheck = false
                realdis = -(dis - 1)


                part3.push(part1[i][j])
                part4.push(tmprev[i][j])

            } else {

                realdis++;
                if (realdis === 1) boolcheck = true

            }

        }
    }
    let all = [...part1, ...part2, part3, part4.reverse()]

    return all;

}

let genId = () => {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let uniqid = randLetter + Date.now();
    return uniqid
}

var history0fgame = {}

let addMacht = async (id, playerone, playertwo, sizeTable) => {
    let res = await axios.post('http://api.dev/api/match', {
        id: id,
        playerone: playerone,
        playertwo: playertwo,
        sizeTable: sizeTable
    })

}

let addSteps = async (id, cellid, player, macthid) => {
    let res = await axios.post('http://api.dev/api/steps', {
        id: id,
        cellid: cellid,
        player: player,
        macthid: macthid
    })

}


let loadstep = async (id, size, gameid) => {

    let res = await axios.post('http://api.dev/api/stepsabll', {
        id: id,

    })


    let tmp = []
    for (let i of res.data.result) {
        tmp.push([parseInt(i.cellid), i.player])
    }

    history0fgame[id] = {
        steps: [tmp],
        size: size,
        gameid: gameid


    }
    console.log(id);
    console.log(history0fgame[id]);
    console.log(res.data.result);
}




let game = async (sizeTable, history0fgameid = null) => {





    let gameid = genId()






    let table = Array.from(Array(sizeTable * sizeTable).keys());
    let player1 = "x";
    let player2 = "o";
    let checkTurn = true;
    const winPossiblePatterns = generateWins(gentempArr(sizeTable))

    const cells = document.querySelectorAll('.cell');

    let p1 = document.getElementById("player1name").value
    let p2 = document.getElementById("player2name").value

    history0fgame[gameid] = {
        steps: [],
        size: sizeTable,
        gameid: gameid,
        p1: p1,
        p2: p2

    }
    addMacht(gameid, p1, p2, sizeTable)


    let btn = document.getElementById("playbtn");





    btn.innerHTML = 'play';



    document.querySelector(".gameover").style.display = "none";



    let replay = (player, cellId, username) => {



        let turn = [player, cellId, username]

        history0fgame[gameid].steps.push(turn)



    }


    let OnClickPlayer = (cell) => {

        if (typeof table[cell.target.id - 1] !== "number") return
        if (checkTurn) {
            turn(cell.target.id, player1)
            checkTurn = false
        } else {
            turn(cell.target.id, player2)
            checkTurn = true
        }

    }

    let gameOver = (obj) => {

        for (let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', OnClickPlayer, false);
        }


        btn.innerHTML = 'play again';

        let sc = document.getElementById("hsofp")

        updateOp()


        if (obj.tie) {

            document.querySelector(".gameover").style.display = "block";
            document.querySelector(".gameover .text").innerText = "Tie Game";

            return
        }

        document.querySelector(".gameover").style.display = "block";
        document.querySelector(".gameover .text").innerText = obj.winner === 'x' ? p1 + " Winner" : p2 + " winner";
    }

    let turn = (cellId, player) => {

        table[cellId - 1] = player;
        console.log(cellId);
        console.log(player);
        document.getElementById(cellId).innerText = player;

        addSteps(genId(), cellId, player, gameid)
        username = player === 'x' ? p1 : p2;
        replay(player, cellId, username)
        let gameEnd = checkWin(table, player)
        if (gameEnd !== null) gameOver(gameEnd)
    }

    let checkWin = (table, player) => {
        let winpattern = []
        let gameEnd = null



        if (table.filter(s => typeof s == 'number').length === 0) {

            gameOver({ tie: "true" })
        }

        for (const [i, value] of table.entries()) {
            if (value === player) winpattern.push(i)
        }


        for (let [index, win] of winPossiblePatterns.entries()) {

            let result = win.every(val => winpattern.includes(val));

            if (result) return { winner: player }

        }

        return gameEnd;



    }

    for (var i = 0; i < cells.length; i++) {
        
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', OnClickPlayer, false);
    }


    let steps = () => {

    
       
        for (var i = 1; i <= history0fgame[history0fgameid].steps[0].length; i++) {
            (function (ind) {
                setTimeout(function () {
                    
                    
                    turn(history0fgame[history0fgameid].steps[0][ind - 1][0], history0fgame[history0fgameid].steps[0][ind - 1][1])
                }, 1000 + (1000 * ind));
            })(i);
        }

    }

    if (history0fgameid !== null) {



        p1 = document.getElementById("hsofp").value.split(",")[2];
        p2 = document.getElementById("hsofp").value.split(",")[3];

        // loadstep(history0fgameid,sizeTable,gameid)

        let res = await axios.post('http://api.dev/api/stepsabll', {
            id: history0fgameid,

        })


        let tmp = []
        for (let i of res.data.result) {
            tmp.push([parseInt(i.cellid), i.player])
        }

        history0fgame[history0fgameid] = {
            steps: [tmp],
            size: sizeTable,
            gameid: gameid


        }

        // return;

        steps()


    }


}


const play = () => {
    let sizeTable = document.getElementById("sizeTable").value;



    if (parseInt(sizeTable) < 3 || parseInt(sizeTable) % 2 === 0) {
        alert("minimum is 3 and must is a ood number [3,5,7]");
    }
    else {

        tableCreate(parseInt(sizeTable));
        game(sizeTable)
    }

}

let updateOp = async () => {
    let result = await axios.get('http://api.dev/api/getMatchs')


    if (result.data.result.length !== 0) {
        console.log();
        let sc = document.getElementById("hsofp")
        let history0fgame = result.data.result
        for (let h of history0fgame) {
            if (!document.getElementById(h.id)) {
                let op = document.createElement("OPTION");
                op.setAttribute("id", h.id);

                op.value = [h.id.toString(), h.sizeTable, h.playerone, h.playertwo];
                op.innerHTML = h.playerone+' vs '+h.playertwo

                sc.appendChild(op)
            }

        }

    } else {
        console.log('NO');
    }

}
updateOp()

const replayw = () => {
    let id = document.getElementById("hsofp").value.split(",")[0];
    let size = document.getElementById("hsofp").value.split(",")[1];
    // console.log();
    tableCreate(parseInt(size));

    game(sizeTable = parseInt(size), history0fgameid = id)

}




