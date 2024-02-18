import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { config } from "@/config/config";
import React from "react";
const inter = Inter({ subsets: ["latin"] });
export default function FrameMint() {
  return (
    <main
      className={`${styles.main} ${inter.className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <h1>{`Follow ${config.warpcast.userHandles
        .map((handle) => handle)
        .join(", ")} on Warpcast to claim`}</h1>
    </main>
  );
}
