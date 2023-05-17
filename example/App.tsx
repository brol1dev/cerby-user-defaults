import * as CerbyUserDefaults from "cerby-user-defaults";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import HorizontalNavigation from "./components/horizontalNavigation";
import useDebounce from "./hooks/debounce";

export default function App() {
  const [data, setData] = useState("");
  const [lockName, setLockName] = useState("lock-open");
  const debouncedData = useDebounce(data);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataResult = (await CerbyUserDefaults.getData(true)) as string;
        console.log("received data: ", dataResult);
        setData(dataResult);
      } catch (error) {
        // The normal scenario here is that nothing was previously saved.
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const sendData = async () => {
      await CerbyUserDefaults.saveData(debouncedData, true);
      console.log("saving: ", debouncedData);
    };
    sendData();
  }, [debouncedData]);

  useEffect(() => {}, [lockName]);

  const lockButtonPressed = () => {
    console.log("lockButtonPressed");
    setLockName(lockName === "lock-open" ? "lock" : "lock-open");
  };

  const modeButtonPressed = () => {
    console.log("modeButtonPressed");
  };

  const trashButtonPressed = () => {
    console.log("trashButtonPressed");
  };

  const leftItems = [
    {
      name: "trash",
      onPress: trashButtonPressed,
    },
  ];
  const rightItems = [
    {
      name: "exchange-alt",
      onPress: modeButtonPressed,
    },
    {
      name: "lock",
      onPress: lockButtonPressed,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Save Note 👀 📝</Text>
      <HorizontalNavigation leftItems={leftItems} rightItems={rightItems} />
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          editable
          multiline
          numberOfLines={8}
          value={data}
          onChangeText={(text) => setData(text)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textInputContainer: {
    flex: 1,
    width: "100%",
    marginTop: 16,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    width: "90%",
    borderColor: "#000",
    borderWidth: 1,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 16,
  },
});
