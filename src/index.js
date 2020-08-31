import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props){
    const imageURI = process.env.PUBLIC_URL + props.imageSrc;
    const cardText = "Card " + (props.index + 1);
    let cardClassNames = "card ";
    let innerCardClassNames = "card-inner ";

    cardClassNames += props.locked ? "locked " : "";

    if(props.clicked && !props.locked){
        innerCardClassNames += "flipped ";
    }

    if(props.locked){
        innerCardClassNames += "flipped ";
    }

    return(
        <div
            className={cardClassNames}
            key={props.imageSrc + "_" + props.index}
            onClick={props.onClick}>
                <div className={innerCardClassNames}>
                    <div className="card-front">
                        <p>{props.index + 1}</p>
                    </div>
                    <div className="card-back">
                        <img src={imageURI} alt={cardText} title={cardText} />
                    </div>
                </div>
        </div>
    );
}

class Board extends React.Component{
    renderCard(imageSrc, index){
        return(
            <Card
                clicked={this.props.clicked.includes(index)}
                imageSrc={imageSrc}
                index={index}
                key={"key_" + index}
                locked={this.props.locked.includes(index)}
                onClick={() => this.props.onClick(imageSrc, index)}
            />
        );
    }

    render(){
        return(            
            [0, 1, 2].map((row) => {
                return(
                    <div
                        className="board-row"
                        key={row}
                    >
                        {
                            [0, 1, 2, 3]
                            .map(
                                (col) => {
                                    const index = row * 4 + col;
                                    const imageSrc = this.props.images[index];                                    
                                    return this.renderCard(imageSrc, index);
                            })
                        }
                    </div>
                );
            })
        );
    };
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.initGame = this.initGame.bind(this);
        this.newGame = this.newGame.bind(this);
        this.shuffleCards = shuffleCards.bind(this);
        this.initGame();
    }

    handleClick(cardImage, index){ 
        if(this.state.lockedForClicks || this.state.lockedCards.includes(index)){
            return;
        }
        const indeces = this.state.clickedCardsIndeces;
        // check for clicking same card over and over
        if(indeces.includes(index) || indeces.length > 1){
            return;
        }else{
            this.setState({
                clickedCardsIndeces: [...indeces, index],
                clickedCardsImages: [...this.state.clickedCardsImages, cardImage]
            });
        }
        
        if(indeces.length === 1){
            if(this.state.clickedCardsImages[0] === cardImage){
                console.log("match");

                this.setState({
                    lockedCards: [
                        ...this.state.lockedCards,
                        this.state.lockedCards.indexOf(this.state.clickedCardsIndeces[0]) === -1 ? this.state.clickedCardsIndeces[0] : null,
                        this.state.lockedCards.indexOf(index) === -1 ? index : null],
                    lockedForClicks: true,
                    status: "You found a matching pair of cards!",
                });

                setTimeout(() => {
                        this.setState({
                            clickedCardsIndeces: [],
                            clickedCardsImages: [],
                            lockedForClicks: false,
                            status: this.state.lockedCards.length === this.state.cardImages.length ? "You found them all" : ""
                        });
                    }, 700
                );
                
            }else{
                this.setState({
                    status: "Those cards are not a match"
                });          
                setTimeout(() => {
                        this.setState({
                            clickedCardsIndeces: [],
                            clickedCardsImages: [],
                            status: ""
                        });
                    }, 700
                );
            }
        }
    }

    initGame(){
        const cardImagePaths = [
            '/assets/kitty01.png',
            '/assets/kitty02.png',
            '/assets/kitty03.png',
            '/assets/kitty04.png',
            '/assets/kitty05.png',
            '/assets/kitty06.png',
        ];
        const doubleCardSet = cardImagePaths.concat(cardImagePaths);

        this.state = {
            cardImages: shuffleCards(doubleCardSet),
            clickedCardsIndeces: [],
            clickedCardsImages: [],
            lockedCards: [],
            lockedForClicks: false,
            running: false,
            status: "",
            time: 0
        };
    }

    render(){
        console.log("render");        
        return(
            <div className="game">
                <div className="game-info">
                    <span className="found-pairs">You have found {(this.state.lockedCards.length / 2) > 0 ? (this.state.lockedCards.length / 2) : 0} {(this.state.lockedCards.length / 2) === 1 ? "pair" : "pairs"}.</span>
                    <br />
                    <span className="status-message">{this.state.status}</span>
                    <br />
                    <br />
                    {this.state.lockedCards.length > 10 &&
                        <div>
                            <button
                                onClick={() => this.newGame()}>
                                Start new game
                            </button>
                        </div>
                    }
                </div>
                <div className="game-board">
                    <Board
                        clicked={this.state.clickedCardsIndeces}
                        images={this.state.cardImages}
                        locked={this.state.lockedCards}
                        onClick={(cardImage, index) => this.handleClick(cardImage, index)}
                    />
                </div>
            </div>
        );
    }

    newGame(){
        console.log("new game");
        const shuffledCards = this.shuffleCards(this.state.cardImages);
        
        this.setState({
            cardImages: shuffledCards,
            lockedCards: []
        });
    }
}

/*
    helper methods
*/
// SOURCE: https://javascript.info/task/shuffle
function shuffleCards(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
}

// ----------

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);