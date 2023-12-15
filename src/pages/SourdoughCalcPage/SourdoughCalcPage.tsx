import React, {useContext} from "react";
import "./SourdoughCalcPage.scss";
import {StateContext} from "../../contexts/StateContext.tsx";

interface SourdoughCalcPageProps {

}

const SourdoughCalcPage = (props: SourdoughCalcPageProps) =>{
    const TAG = "[SourdoughCalcPage.tsx]";
    const {name, setName} = useContext(StateContext);



    return (
        <div className="sourdoughCalcPage" onClick={ () => {
            setName( (prevState) => {
                if(prevState === "Randi"){
                    return "Eevee"
                } return "Randi"
            })
        }}>
            name from context: {name}
        </div>
    );
}

export default SourdoughCalcPage;
