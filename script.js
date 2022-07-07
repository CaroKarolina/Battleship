const Model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    // ships: [
    //     {locations: ['00', '00', '00'], hits: ['', '', '']},
        // {locations: ['00', '00', '00'], hits: ['', '', '']},
        // {locations: ['00', '00', '00'], hits: ['', '', '']}
    // ],
    ships: [
        {locations: ['00', '00', '00'], hits: ['', '', '']},
        {locations: ['00', '00', '00'], hits: ['', '', '']},
        {locations: ['00', '00', '00'], hits: ['', '', '']}
    ],
    fire: function(guess) {
        console.log(guess)
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let locations = ship.locations;
            let index = ship.locations.indexOf(guess);
            if (ship.hits[index] === 'hit') {
                View.displayMsg('Okręt został wcześniej trafiony');
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                View.displayHit(guess);
                View.displayMsg('trafiony');
                if (this.isSunk(ship)) {
                    View.displayMsg('Zatopiony!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        View.displayMiss(guess);
        View.displayMsg('pudło :(')
        return false;
    },
    isSunk: function(ship) {
        console.log(ship)
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    generteShipLocation: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log('Nowa tablica okrętów: ', this.ships);
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            column = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            column = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (column + i))
            } else {
                newShipLocations.push((row + i) + '' + column)
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = Model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    console.log(locations.indexOf(locations[j]) >= 0);
                    return true;
                }
            }
        }
        return false;
    }
};

const View = {
    displayMsg: function(msg) {
        const message = document.getElementById('messageArea');
        message.innerHTML = msg;
    },
    displayHit:function(location) {
        const hitElement = document.getElementById(location);
        hitElement.setAttribute('class', 'hit');
    },
    displayMiss: function(location) {
        const missElement = document.getElementById(location);
        missElement.setAttribute('class', 'miss');
    }
};

const Controller = {
    guesses: 0,
    processGuesses: function(guess) {
        const location = parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = Model.fire(location);
            if (hit && Model.shipsSunk === (Model.ships.length)*(Model.numShips)) {
                View.displayMsg('wszystkie okręty zostały zatopione w: '+ this.guesses +'próbach.')
            }
        }
    },

};

function parseGuess(guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        View.displayMsg('podaj obydwie współrzędne')
    } else {
        firstGuess = guess.charAt(0);
        firstGuess = firstGuess.toUpperCase();
        const row = alphabet.indexOf(firstGuess);
        const column = guess.charAt(1)
        if (isNaN(row) || isNaN(column)) {
            View.displayMsg('podaj prawidłową wartość');
        } else if ( row < 0 || row >= Model.boardSize || column < 0 || column >= Model.boardSize) {
            View.displayMsg('podane przez Ciebie współrzędne nie mieszczą się w planszy')
        } else {
            return row + column
        }
    }
    return null;
};

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;
    Controller.processGuesses(guess);
    guessInput.value = '';
}

window.onload = init;

function init() {
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    Model.generteShipLocation();
}