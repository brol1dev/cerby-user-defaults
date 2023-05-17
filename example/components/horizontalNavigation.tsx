import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

interface HorizontalNavigationProps {
  leftItems: {
    name: string;
    color?: string;
    onPress?: () => void;
  }[];
  rightItems: {
    name: string;
    color?: string;
    onPress?: () => void;
  }[];
}

const HorizontalNavigation = ({
  leftItems,
  rightItems,
}: HorizontalNavigationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemsGroup}>
        {leftItems.map((item, index) => (
          <View key={index}>
            <Icon.Button
              name={item.name}
              size={25}
              color={item.color ?? "#00f"}
              backgroundColor="#fff"
              iconStyle={{
                marginRight: 0, // default value is 10.
              }}
              onPress={item.onPress}
            />
          </View>
        ))}
      </View>
      <View style={[styles.itemsGroup, { justifyContent: "flex-end" }]}>
        {rightItems.map((item, index) => (
          <View key={index}>
            <Icon.Button
              name={item.name}
              size={25}
              color={item.color ?? "#00f"}
              backgroundColor="#fff"
              iconStyle={{
                marginRight: 0, // default value is 10.
              }}
              onPress={item.onPress}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemsGroup: {
    flex: 1,
    flexDirection: "row",
  },
});

export default HorizontalNavigation;
