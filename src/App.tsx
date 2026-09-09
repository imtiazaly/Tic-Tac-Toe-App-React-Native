import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-snackbar';
import Icon from './components/Icons';
import { useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string | null>('');
  const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9));

  const restartGame = () => {
    setGameState(new Array(9).fill('empty', 0, 9));
    setIsCross(false);
    setGameWinner('');
  };

  const checkIsWinner = (currentGameState: string[]) => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const condition of winningConditions) {
      const [a, b, c] = condition;

      if (
        currentGameState[a] === currentGameState[b] &&
        currentGameState[a] === currentGameState[c] &&
        currentGameState[a] !== 'empty'
      ) {
        return currentGameState[a];
      }
    }

    return null;
  };

  const onChangeItem = (itemNumber: number) => {
    if (gameWinner) {
      Snackbar.show({
        text:
          gameWinner === 'draw'
            ? 'Game is already a draw'
            : `Game is already over. ${gameWinner} won the game`,
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    if (gameState[itemNumber] !== 'empty') {
      Snackbar.show({
        text: 'This box is already filled',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    const newGameState = [...gameState];

    const currentPlayer = isCross ? 'cross' : 'circle';

    newGameState[itemNumber] = currentPlayer;

    const winner = checkIsWinner(newGameState);

    setGameState(newGameState);

    if (winner) {
      setGameWinner(winner);
      return;
    }

    const isDraw = newGameState.every(item => item !== 'empty');

    if (isDraw) {
      setGameWinner('draw');
      return;
    }

    setIsCross(!isCross);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView>
        {gameWinner ? (
          <View style={[styles.playerInfo, styles.winnerInfo]}>
            <Text style={[styles.winnerTxt, {}]}>
              {gameWinner === 'draw'
                ? 'Game Draw!'
                : `${
                    gameWinner === 'cross' ? 'Player X' : 'Player O'
                  } won the game 🏆`}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.playerInfo,
              isCross ? styles.playerX : styles.playerO,
            ]}
          >
            <Text style={styles.gameTurnTxt}>
              Player {isCross ? 'X' : 'O'}'s turn
            </Text>
          </View>
        )}

        <FlatList
          numColumns={3}
          data={gameState}
          style={styles.grid}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              style={styles.card}
              onPress={() => onChangeItem(index)}
            >
              <Icon name={item} />
            </Pressable>
          )}
        />
        <Pressable style={styles.gameBtn}>
          <Text style={styles.gameBtnText} onPress={restartGame}>
            {gameWinner ? 'Play Again' : 'Restart Game'}
          </Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  gameTurnTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playerX: {
    backgroundColor: '#38CC77',
  },
  playerO: {
    backgroundColor: '#F7CD2E',
  },

  grid: {
    margin: 12,
  },
  card: {
    height: 100,
    width: '33.33%',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#333',
  },
  winnerInfo: {
    borderRadius: 8,
    backgroundColor: '#ffa600',

    shadowOpacity: 0.1,
  },
  winnerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gameBtn: {
    alignItems: 'center',

    padding: 10,
    borderRadius: 8,
    marginHorizontal: 36,
    backgroundColor: '#8D3DAF',
  },
  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default App;
