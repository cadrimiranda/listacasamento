"use client";
import { LogDataDashboard } from "@/src/logger";
import queries from "@/src/query";
import { useState } from "react";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const [data, setData] = useState<LogDataDashboard[] | null>(null);

  if (!data) {
    queries
      .getDashboard()
      .then((res) => res.json())
      .then((res: LogDataDashboard[]) =>
        setData(res.sort((x, y) => y.count - x.count))
      );
    return <p>Loading doidao (como chegasse aqui?????????)</p>;
  }

  return (
    <div>
      <p>{`Total: ${data.reduce((prev, next) => prev + next.count, 0)}`}</p>
      <br />
      <table className={styles.table}>
        <tr>
          <th>Document</th>
          <th>Log Type</th>
          <th>Count</th>
        </tr>
        {data.map((x) => (
          <tr>
            <td>{x.document}</td>
            <td>{x.logType}</td>
            <td>{x.count}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Dashboard;
