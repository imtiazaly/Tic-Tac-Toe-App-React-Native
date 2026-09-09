import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-snackbar';
import Icon from './components/Icons';
import { useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string | null>('');
  const [gameState, setGameState] = useState(new Array(9).fill('💖', 0, 9));

  const restartGame = () => {
    setGameState(new Array(9).fill('💖', 0, 9));
    setIsCross(false);
    setGameWinner('');
  };

  const checkIsWinner = () => {
    if (
      (gameState[0] === gameState[1] &&
        gameState[0] === gameState[2] &&
        gameState[0] !== '💖') ||
      (gameState[3] === gameState[4] &&
        gameState[3] === gameState[5] &&
        gameState[3] !== '💖') ||
      (gameState[6] === gameState[7] &&
        gameState[6] === gameState[8] &&
        gameState[6] !== '💖') ||
      (gameState[0] === gameState[3] &&
        gameState[0] === gameState[6] &&
        gameState[0] !== '💖') ||
      (gameState[1] === gameState[4] &&
        gameState[1] === gameState[7] &&
        gameState[1] !== '💖') ||
      (gameState[2] === gameState[5] &&
        gameState[2] === gameState[8] &&
        gameState[2] !== '💖') ||
      (gameState[0] === gameState[4] &&
        gameState[0] === gameState[8] &&
        gameState[0] !== '💖') ||
      (gameState[2] === gameState[4] &&
        gameState[2] === gameState[6] &&
        gameState[2] !== '💖')
    ) {
      setGameWinner(isCross ? 'cross' : 'circle');
    }
  };

  const onChangeItem = (itemNumber: number) => {
    if (gameWinner) {
      Snackbar.show({
        text: `Game is already over. ${gameWinner} won the game`,
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    if (gameState[itemNumber] !== '💖') {
      Snackbar.show({
        text: 'This box is already filled',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    const newGameState = [...gameState];
    newGameState[itemNumber] = isCross ? 'cross' : 'circle';
    setGameState(newGameState);
    setIsCross(!isCross);
    checkIsWinner();
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <Text>Tic Tac Toe Game for Mobile</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
