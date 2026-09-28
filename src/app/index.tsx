import * as Device from "expo-device";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShareBar } from "@/components/share-bar";
import { Stat } from "@/components/stat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import { summarise } from "@/data/summary";
import { useCustomers } from "@/hooks/use-customers";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }

  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }

  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";

  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const { status, customers, problem, retry } = useCustomers();

  const toCustomers = () => {
    router.push("/customers");
  };

  if (status === "loading") {
    return (
      <ThemedView style={styles.middle}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (status === "error") {
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>{problem}</ThemedText>

        <Button title="Try again" onPress={retry} />
      </ThemedView>
    );
  }

  if (status === "empty") {
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>No customers yet.</ThemedText>
      </ThemedView>
    );
  }

  const summary = summarise(customers);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Home Screen
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          Customer service app
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <View style={styles.statRow}>
            <Stat label="Total owed" value={`₱ ${summary.total.toFixed(2)}`} />

            <Stat
              label="Average owed"
              value={`₱ ${summary.average.toFixed(2)}`}
            />
          </View>

          <View style={styles.statRow}>
            <Stat
              label="Still owing"
              value={`${summary.owing} of ${summary.count}`}
            />

            <Stat label="Settled" value={String(summary.settled)} />
          </View>
        </ThemedView>

        {summary.ranked.map((c) => (
          <ShareBar
            key={c.id}
            name={c.name}
            balance={c.balance}
            share={c.share}
          />
        ))}

        <Button title="View Customers" onPress={toCustomers} />

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    maxWidth: MaxContentWidth,
  },

  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },

  title: {
    textAlign: "center",
  },

  code: {
    textTransform: "uppercase",
  },

  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },

  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  statRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
});
