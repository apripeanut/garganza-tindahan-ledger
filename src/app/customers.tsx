import { useState } from "react";
import { Button, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomerRow } from "@/components/customer-row";
import { ThemedText } from "@/components/themed-text";
import { SEED } from "@/data/customers";
import { useTheme } from "@/hooks/use-theme";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState(SEED);
  const [query, setQuery] = useState("");

  function addWalkIn() {
    const id = String(Date.now());
    const walkIn = { id, name: "Walk-in", balance: 0, lastPaid: "Never" };
    setCustomers([...customers, walkIn]);
  }

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const total = shown.reduce((sum, c) => sum + c.balance, 0);
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, padding: 24, gap: 12 }}>
      <ThemedText style={{ fontSize: 28, fontWeight: "600" }}>
        Customers
      </ThemedText>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search Customers"
        placeholderTextColor={theme.textSecondary}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          color: theme.text,
          borderColor: theme.borderColor,
        }}
      />
      <ThemedText style={{ fontSize: 18 }}>
        Total owned: ₱ {total.toFixed(2)}{" "}
      </ThemedText>
      <Button title="Add walk-in" onPress={addWalkIn} />
      <FlatList
        data={shown}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CustomerRow {...item} />}
        ListEmptyComponent={
          <ThemedText>No customers match "{query}".</ThemedText>
        }
      />
    </SafeAreaView>
  );
}
