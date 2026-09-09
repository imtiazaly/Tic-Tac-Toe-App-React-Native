import {
  Animated,
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
import { useEffect, useRef, useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string | null>('');
  const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9));

  // Celebration animations
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const emojiTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameWinner) {
      celebrationScale.setValue(0);
      celebrationOpacity.setValue(0);
      emojiTranslate.setValue(0);

      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),

        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.loop(
          Animated.sequence([
            Animated.timing(emojiTranslate, {
              toValue: -15,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(emojiTranslate, {
              toValue: 15,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();
    }
  }, [gameWinner]);

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
      <StatusBar barStyle={'dark-content'} />

      <SafeAreaView style={styles.container}>
        {/* Player Turn */}
        {!gameWinner && (
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

        {/* Game Grid */}
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
          contentContainerStyle={{ gap: 4, marginTop: 30 }}
        />

        {/* Normal Restart Button */}
        {!gameWinner && (
          <Pressable style={styles.gameBtn} onPress={restartGame}>
            <Text style={styles.gameBtnText}>Restart Game</Text>
          </Pressable>
        )}

        {/* Full Screen Celebration */}
        {gameWinner && (
          <View style={styles.celebrationContainer}>
            {/* Top Floating Emojis */}
            <Animated.Text
              style={[
                styles.topEmoji,
                {
                  transform: [{ translateY: emojiTranslate }],
                },
              ]}
            >
              🎉 ⭐ 🎊 🙌
            </Animated.Text>

            {/* Main Celebration Content */}
            <Animated.View
              style={[
                styles.celebrationContent,
                {
                  opacity: celebrationOpacity,
                  transform: [{ scale: celebrationScale }],
                },
              ]}
            >
              {gameWinner === 'draw' ? (
                <>
                  <Text style={styles.trophy}>🤝</Text>

                  <Text style={styles.congratulations}>GAME DRAW!</Text>

                  <Text style={styles.winnerPlayer}>Great Game!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.trophy}>🏆</Text>

                  <Text style={styles.congratulations}>CONGRATULATIONS!</Text>

                  <Text style={styles.winnerPlayer}>
                    {gameWinner === 'cross' ? 'Player X' : 'Player O'}
                  </Text>

                  <Text style={styles.wonText}>WON THE GAME 🎉</Text>
                </>
              )}

              {/* Stars */}
              <View style={styles.stars}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.star}>✨</Text>
                <Text style={styles.star}>🌟</Text>
                <Text style={styles.star}>✨</Text>
                <Text style={styles.star}>⭐</Text>
              </View>

              {/* Play Again */}
              <Pressable style={styles.playAgainButton} onPress={restartGame}>
                <Text style={styles.playAgainText}>Play Again 🎮</Text>
              </Pressable>
            </Animated.View>

            {/* Bottom Floating Emojis */}
            <Animated.Text
              style={[
                styles.bottomEmoji,
                {
                  transform: [{ translateY: emojiTranslate }],
                },
              ]}
            >
              🎊 ✨ 🎉 ✨ 🎊
            </Animated.Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    marginTop: 50,

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
    width: '32%',

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#D9E1EC',
    borderRadius: 12,

    margin: 2,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowColor: '#1E293B',
    shadowOpacity: 0.12,
    shadowRadius: 4,

    elevation: 3,
  },

  gameBtn: {
    alignItems: 'center',

    padding: 10,
    borderRadius: 8,

    marginHorizontal: 36,
    marginBottom: 150,

    backgroundColor: '#8D3DAF',
  },

  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Celebration
  celebrationContainer: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 100,
    elevation: 100,

    backgroundColor: '#ac3ddb98',

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 20,
  },

  celebrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  trophy: {
    fontSize: 80,
    marginBottom: 10,
  },

  congratulations: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',

    textAlign: 'center',
    letterSpacing: 1,
  },

  winnerPlayer: {
    fontSize: 36,
    fontWeight: '800',

    color: '#FFD700',

    marginTop: 12,
  },

  wonText: {
    fontSize: 22,
    fontWeight: '700',

    color: '#FFFFFF',

    marginTop: 4,
  },

  stars: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 25,

    gap: 8,
  },

  star: {
    fontSize: 28,
  },

  playAgainButton: {
    backgroundColor: '#FFFFFF',

    paddingVertical: 14,
    paddingHorizontal: 35,

    borderRadius: 30,

    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  playAgainText: {
    fontSize: 18,
    fontWeight: '800',

    color: '#8D3DAF',
  },

  topEmoji: {
    position: 'absolute',

    top: 70,

    fontSize: 42,
  },

  bottomEmoji: {
    position: 'absolute',

    bottom: 80,

    fontSize: 30,
  },
});

export default App;