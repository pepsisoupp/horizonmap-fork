import { useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";
import CustomSlider from "../inputs/CustomSlider";

export default function RadiusSlider() {
    const { radius, setRadius, inProgress } = useContext(MainContext);

    return (
        <CustomSlider
            displayName='범위'
            className='radius-slider'
            suffix=' km'
            value={radius}
            setValue={setRadius}
            min={Constants.marker.minRadius}
            max={Constants.marker.maxRadius}
            step={Constants.marker.radiusStep}
            disabled={inProgress !== 0}
        />
    );
}
