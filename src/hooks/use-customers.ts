import { useEffect, useState } from "react";

import { Customer, fetchCustomers } from "@/data/customers";
import { problemFor, Status } from "@/data/problem";

export function useCustomers() {
  const [status, setStatus] = useState<Status>("loading");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus("loading");

    fetchCustomers()
      .then((rows) => {
        setCustomers(rows);
        setStatus(rows.length === 0 ? "empty" : "content");
      })
      .catch((e) => {
        setProblem(problemFor(e));
        setStatus("error");
      });
  }, [attempt]);

  return {
    status,
    customers,
    problem,
    retry: () => setAttempt(attempt + 1),
  };
}
