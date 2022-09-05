import React from "react";
import "./styles.scss";

const Spinner = () => (
    // TODO: see if color is useful
    <div className="spinner-container">
        <div className="spinner-grow" role="status" />
    </div>
);

export default Spinner;