import { useState } from "react";
import { Button, Modal, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { addCustomer } from "@/data/customers";
import { problemFor } from "@/data/problem";
import { useTheme } from "@/hooks/use-theme";

type AddCustomerModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export function AddCustomerModal({
  visible,
  onClose,
  onAdded,
}: AddCustomerModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState("");

  const theme = useTheme();

  const balance = Number(amount);

  const valid =
    name.trim() !== "" &&
    amount !== "" &&
    !Number.isNaN(balance) &&
    balance >= 0;

  function close() {
    if (saving) return;

    setName("");
    setAmount("");
    setProblem("");
    onClose();
  }

  function save() {
    setSaving(true);
    setProblem("");

    addCustomer(name.trim(), balance)
      .then(() => {
        close();
        onAdded();
      })
      .catch((e) => {
        setProblem(problemFor(e));
        setSaving(false);
      });
  }

  const input = {
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 12,
    color: theme.text,
    backgroundColor: theme.background,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={close}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: theme.backgroundElement,
            padding: 24,
            borderRadius: 16,
            gap: 12,
          }}
        >
          <ThemedText type="subtitle">Add customer</ThemedText>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={theme.textSecondary}
            editable={!saving}
            style={input}
          />

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount owed"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            editable={!saving}
            style={input}
          />

          {problem !== "" && <ThemedText>{problem}</ThemedText>}

          <Button
            title={saving ? "Saving" : "Add"}
            onPress={save}
            disabled={!valid || saving}
          />

          <Button title="Cancel" onPress={close} disabled={saving} />
        </View>
      </View>
    </Modal>
  );
}
