import { PropsWithChildren } from "react";
import "./table.css";

export const Table = ({ children }: PropsWithChildren) => {
  return (
    <div className="table-container">
      <table className="responsive-table">{children}</table>
    </div>
  );
};
