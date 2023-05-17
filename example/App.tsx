import * as CerbyUserDefaults from "cerby-user-defaults";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

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

  useEffect(() => {
  }, [lockName]);

  const lockButtonPressed = () => {
    setLockName(lockName === "lock-open" ? "lock" : "lock-open");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textInputContainer}>
        <Icon.Button
          name={lockName}
          size={25}
          color="#a02"
          backgroundColor="#fff"
          iconStyle={{
            marginRight: 0, // default value is 10.
          }}
          onPress={lockButtonPressed}
        />
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
