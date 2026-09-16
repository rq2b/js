EMPTY: str = " "
board: list[str] = [EMPTY] * 9

AI: str = input("Choose AI side (X/O): ").upper()
OPP: str = "O" if AI == "X" else "X"

ai_starts: bool = input("Does AI start? (y/n): ").lower() == "y"

def print_board():
    for i in range(0, 9, 3):
        print(" | ".join(board[i:i+3]))
        if i < 6:
            print("--+---+--")
    print()

def winner(b, player):
    wins: list[tuple[int]] = [
        (0,1,2), (3,4,5), (6,7,8),
        (0,3,6), (1,4,7), (2,5,8),
        (0,4,8), (2,4,6)
    ]
    return any(b[a] == b[b_] == b[c] == player for a, b_, c in wins)

def game_over(b):
    return winner(b, AI) or winner(b, OPP) or EMPTY not in b

def minimax(b, maximizing):
    if winner(b, AI):
        return 1
    if winner(b, OPP):
        return -1
    if EMPTY not in b:
        return 0

    if maximizing:
        best: int = -999
        for i in range(9):
            if b[i] == EMPTY:
                b[i] = AI
                score = minimax(b, False)
                b[i] = EMPTY
                best = max(best, score)
        return best
    else:
        best: int = 999
        for i in range(9):
            if b[i] == EMPTY:
                b[i] = OPP
                score = minimax(b, True)
                b[i] = EMPTY
                best = min(best, score)
        return best

def best_move():
    best_score: int = -999
    move: None = None

    for i in range(9):
        if board[i] == EMPTY:
            board[i] = AI
            score = minimax(board, False)
            board[i] = EMPTY

            if score > best_score:
                best_score = score
                move = i

    return move

print("\nBoard positions:")
print("0 | 1 | 2\n3 | 4 | 5\n6 | 7 | 8\n")

ai_turn = ai_starts

while True:
    print_board()

    if game_over(board):
        if winner(board, AI):
            print("AI (your side) wins.")
        elif winner(board, OPP):
            print("Opponent wins.")
        else:
            print("Draw.")
        break

    if ai_turn:
        move = best_move()
        board[move] = AI
        print(f"AI plays {AI} at {move}")

    else:
        move = int(input(f"Enter opponent move ({OPP}) [0-8]: "))
        if board[move] != EMPTY:
            print("Invalid move.")
            continue
        board[move] = OPP

    ai_turn = not ai_turn
