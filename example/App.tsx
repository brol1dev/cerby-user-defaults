import * as CerbyUserDefaults from "cerby-user-defaults";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";

import useDebounce from "./hooks/debounce";

export default function App() {
  const [data, setData] = useState("");
  const debouncedData = useDebounce(data);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataResult = (await CerbyUserDefaults.getData()) as string;
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
      await CerbyUserDefaults.saveData(debouncedData);
      console.log("saving: ", debouncedData);
    };
    sendData();
  }, [debouncedData]);

  return (
    <SafeAreaView style={styles.container}>
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
    alignItems: "center",
  },
  textInput: {
    width: "90%",
    height: 200,
    borderColor: "#000",
    borderWidth: 1,
  },
});
