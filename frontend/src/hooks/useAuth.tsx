import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  return { user };
}
