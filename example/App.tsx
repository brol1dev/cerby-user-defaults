import * as CerbyUserDefaults from "cerby-user-defaults";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import HorizontalNavigation from "./components/horizontalNavigation";
import useDebounce from "./hooks/debounce";

export default function App() {
  const [data, setData] = useState("");
  const [lockName, setLockName] = useState("lock-open");
  const [secureMode, setSecureMode] = useState(false);
  const [secureButtonColor, setSecureButtonColor] = useState("#808080");
  const debouncedData = useDebounce(data, 1000);

  const getData = async () => {
    try {
      const dataResult = (await CerbyUserDefaults.getData(
        secureMode
      )) as string;
      console.log(`read in secure mode: ${secureMode}, value: ${dataResult}`);
      setData(dataResult);
      if (lockName === "lock") {
        setLockName("lock-open");
      }
    } catch (error) {
      // The normal scenario here is that nothing was previously saved.
      console.log(error);
      setData("");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("debounced");
    const sendData = async () => {
      await CerbyUserDefaults.saveData(debouncedData, secureMode);
    };
    sendData();
  }, [debouncedData]);

  useEffect(() => {}, [lockName]);

  useEffect(() => {
    if (secureMode) {
      setSecureButtonColor("#00f");
    } else {
      setSecureButtonColor("#808080");
    }
    getData();
  }, [secureMode]);

  // useEffect(() => {
  //   if (lockName === lock)
  // }, [lockName]);

  const lockButtonPressed = () => {
    console.log("lockButtonPressed");
    if (!secureMode) {
      return;
    } else {
      getData();
    }
    setLockName("lock");
  };

  const modeButtonPressed = () => {
    setSecureMode(!secureMode);
    console.log("modeButtonPressed");
  };

  const trashButtonPressed = () => {
    clear();
    console.log("trashButtonPressed");
    getData();
  };

  const clear = async () => {
    await CerbyUserDefaults.clear(secureMode);
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
      color: secureButtonColor,
      onPress: modeButtonPressed,
    },
    {
      name: lockName,
      onPress: lockButtonPressed,
    },
  ];

  if (lockName === "lock" && secureMode) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Save Note 👀 📝</Text>
        <HorizontalNavigation leftItems={leftItems} rightItems={rightItems} />
        <View style={styles.textInputContainer}>
          <View style={styles.overview} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Save Note 👀 📝</Text>
      <HorizontalNavigation leftItems={leftItems} rightItems={rightItems} />
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          editable
          multiline
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
  overview: {
    flex: 1,
    width: "90%",
    height: "100%",
    backgroundColor: "#000",
  },
});
