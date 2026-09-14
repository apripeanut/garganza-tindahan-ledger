import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable } from "react-native";
import { ThemedText } from "./themed-text";

type CustomerRowProps = { name: string; balance: number; lastPaid: string };

export function CustomerRow({ name, balance, lastPaid }: CustomerRowProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={{
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
      }}
    >
      <ThemedText style={{ fontSize: 18 }}>{name}</ThemedText>
      <ThemedText>₱{balance.toFixed(2)}</ThemedText>
      {expanded && <ThemedText>Last paid {lastPaid}</ThemedText>}
    </Pressable>
  );
}
