import React from "react";
import { BounceLoader } from "react-spinners";;

const FTSpinner = (): JSX.Element => {
  return (
    <div id="FT-SPINNER">
      <BounceLoader
      className="primary"
        // color="#dd9732"
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default FTSpinner;