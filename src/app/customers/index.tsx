import { AddCustomerModal } from "@/components/add-customer-modal";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomerRow } from "@/components/customer-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCustomers } from "@/hooks/use-customers";
import { useTheme } from "@/hooks/use-theme";

export default function CustomersScreen() {
  const { status, customers, problem, retry } = useCustomers();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  if (status === "loading")
    return (
      <ThemedView style={styles.middle}>
        <ActivityIndicator />
      </ThemedView>
    );

  if (status === "error")
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>{problem}</ThemedText>
        <Button title="Try again" onPress={() => setAttempt(attempt + 1)} />
      </ThemedView>
    );

  if (status === "empty")
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>No customers yet.</ThemedText>
      </ThemedView>
    );

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const total = shown.reduce((sum, c) => sum + c.balance, 0);

  return (
    <SafeAreaView style={styles.screen}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search customers"
        style={[
          styles.search,
          {
            color: theme.text,
            borderColor: theme.textSecondary,
          },
        ]}
      />

      <ThemedText>Total owed: ₱ {total.toFixed(2)}</ThemedText>

      <Button title="Add customer" onPress={() => setAdding(true)} />

      <FlatList
        data={shown}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CustomerRow
            name={item.name}
            balance={item.balance}
            onPress={() => router.push(`/customers/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <ThemedText>No customers match "{query}".</ThemedText>
        }
      />

      <AddCustomerModal
        visible={adding}
        onClose={() => setAdding(false)}
        onAdded={retry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  screen: {
    flex: 1,
    padding: 24,
    gap: 12,
  },

  search: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
});
