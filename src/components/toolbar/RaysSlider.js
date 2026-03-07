import { useContext } from "react";
import Constants from "../../helpers/constants";
import MainContext from "../../contexts/MainContext";
import CustomSlider from "../inputs/CustomSlider";

export default function RaysSlider() {
    const { rays, setRays, inProgress } = useContext(MainContext);

    return (
        <CustomSlider
            displayName='시뮬레이션 광선 개수'
            className='rays-slider'
            value={rays}
            setValue={setRays}
            min={Constants.horizon.minRays}
            max={Constants.horizon.maxRays}
            step={Constants.horizon.raysStep}
            disabled={inProgress !== 0}
        />
    );
}
