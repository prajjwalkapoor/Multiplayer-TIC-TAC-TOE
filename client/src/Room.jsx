import React, { useEffect, useState } from "react";

export default function Room({ roomid, socket, currentPlayer }) {
  const [playerChance, setPlayerChance] = useState(1);
  const [isBoardActive, setIsBoardActive] = useState();
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [winner, setWinner] = useState(null);
  const winnerHandler = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2] &&
        board[i][0] !== ""
      ) {
        if (board[i][0] === "X") {
          setWinner(1);
        } else {
          setWinner(2);
        }
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i] &&
        board[0][i] !== ""
      ) {
        if (board[0][i] === "X") {
          setWinner(1);
        } else {
          setWinner(2);
        }
      }
    }
    // check diagonals
    if (
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2] &&
      board[0][0] !== ""
    ) {
      if (board[0][0] === "X") {
        setWinner(1);
      } else {
        setWinner(2);
      }
    }

    // check draw
    let draw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          draw = false;
        }
      }
    }
    if (draw) {
      setWinner(0);
    }
  };

  useEffect(() => {
    socket.emit("sync-board", board, roomid, playerChance);
    winnerHandler();
    return () => {
      socket.off("sync-board");
    };
  }, [playerChance]);

  useEffect(() => {
    socket.on("get-board", (board, playerChance) => {
      setBoard(board);
      setPlayerChance(playerChance);
    });
    return () => {
      socket.off("get-board");
    };
  }, [socket]);

  useEffect(() => {}, [winner, playerChance]);

  console.log(currentPlayer, playerChance, "currentPlayer", "playerChance");

  return (
    <div className='room'>
      <div className='room-header'>
        <h1>Tic Tac Toe</h1>
        <h3>
          Room Id:
          <code
            className='roomid'
            onClick={() => {
              navigator.clipboard.writeText(roomid);
            }}
          >
            {roomid}
          </code>
        </h3>
      </div>
      <div className='room-body'>
        <p className='instructions'>Here We go lets start playing....</p>
        <p>{winner == 0 && "Match Draw"}</p>
        <div className='main'>
          <div className='player1'>
            <h4 className={playerChance == 1 ? "currentChance" : ""}>
              Player 1
            </h4>
          </div>
          <div className='sub'>
            <div className='board'>
              {board.map((row, i) => {
                return (
                  <div key={i} className='row'>
                    {row.map((col, j) => {
                      return (
                        <div
                          key={i + j}
                          className='cell'
                          onClick={() => {
                            if (
                              col === "" &&
                              winner === null &&
                              playerChance === currentPlayer
                            ) {
                              const newBoard = board;
                              newBoard[i][j] = playerChance === 1 ? "X" : "O";
                              setBoard(newBoard);
                              setPlayerChance(playerChance === 1 ? 2 : 1);
                            }
                          }}
                        >
                          {col}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className='player2'>
            <h4 className={playerChance == 2 ? "currentChance" : ""}>
              Player 2
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
