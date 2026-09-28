import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";

type CustomerRowProps = {
  name: string;
  balance: number;
  onPress: () => void;
};

export function CustomerRow({ name, balance, onPress }: CustomerRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <ThemedText>{name}</ThemedText>
      <ThemedText themeColor="textSecondary">₱ {balance.toFixed(2)}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});
