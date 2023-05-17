import { StyleSheet, Text, View } from 'react-native';

import * as CerbyUserDefaults from 'cerby-user-defaults';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{CerbyUserDefaults.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
