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
  const [lockButtonColor, setLockButtonColor] = useState("#808080");
  const debouncedData = useDebounce(data, 2000);

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
      console.log(error);
      if (secureMode) {
        // This case includes when FaceID fails.
        setLockName("lock");
        return;
      }
      // The normal scenario here is that nothing was previously saved.
      setData("");
    }
  };

  // Get data on first load.
  useEffect(() => {
    getData();
  }, []);

  // Autosave logic.
  useEffect(() => {
    const sendData = async () => {
      await CerbyUserDefaults.saveData(debouncedData, secureMode);
    };
    sendData();
  }, [debouncedData]);

  useEffect(() => {
    if (secureMode) {
      setSecureButtonColor("#00f");
      setLockButtonColor("#00f");
    } else {
      setSecureButtonColor("#808080");
      setLockButtonColor("#808080");
    }
    getData();
  }, [secureMode]);

  const lockButtonPressed = () => {
    // Lock button should only work when secure mode is enabled.
    if (!secureMode) {
      return;
    }
    getData();
    setLockName("lock");
  };

  const modeButtonPressed = () => {
    setSecureMode(!secureMode);
  };

  const trashButtonPressed = () => {
    clear();
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
      color: lockButtonColor,
      onPress: lockButtonPressed,
    },
  ];

  if (lockName === "lock" && secureMode) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Save Note 👀 📝</Text>
        <HorizontalNavigation leftItems={leftItems} rightItems={rightItems} />
        <View style={styles.textInputContainer}>
          <View style={styles.secureView} />
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
  secureView: {
    flex: 1,
    width: "90%",
    height: "100%",
    backgroundColor: "#000",
  },
});
