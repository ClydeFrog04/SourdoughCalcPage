import React, {useContext, useState} from "react";
import "./SourdoughCalcPage.scss";
import {StateContext} from "../../contexts/StateContext.tsx";

interface SourdoughCalcPageProps {

}

const initialMeasurementsState = {
    flour: 400,
    water: 240,
    starter: 80,
    salt: 8,
};

const initialPercentagesState = {
    flourPercent: 100,
    waterPercent: 60,
    starterPercent: 20,
    saltPercent: 2,
};

const SourdoughCalcPage = (props: SourdoughCalcPageProps) => {
    const TAG = "[SourdoughCalcPage.tsx]";
    const {name, setName} = useContext(StateContext);
    // const [flour, setFlour] = useState(400);
    const [measurements, setMeasurements] = useState(initialMeasurementsState);
    const [percentages, setPercentages] = useState(initialPercentagesState);



    const handleNumInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e.target.id);
        const {id, value} = e.target;
        console.log(`handleNumInputChange: name ${id} value ${value}`);

        const newMeasurements = {
            ...measurements,
            [id]: value.replace(/\D/g, "")
        };
        console.log("new measurements:", JSON.stringify(newMeasurements));
        setMeasurements(newMeasurements);
        calculateGramValues(percentages, newMeasurements, id);
    };

    const calculateGramValues =  (localPercentages: typeof percentages, localMeasurements: typeof measurements, targetChanged: string) => {
        console.log(TAG, " percentages passed in:", JSON.stringify(localPercentages));
        console.log(TAG, "measurements passed in:", JSON.stringify(localMeasurements));
        console.log(TAG, "Target changed:", targetChanged);
        // console.log(TAG, "measurements passed in:", loca);
        const newMeasurements = {...localMeasurements};

        let newFlour;
        if(targetChanged !== "flour"){
            switch (targetChanged){
                case "starter":
                    newFlour = (100 * localMeasurements.starter) / localPercentages.starterPercent;
                    console.log(TAG, "NEW FLOUR WAS:", newFlour);
                    localMeasurements.flour = newFlour;
                    break;
                default:
                    break;
            }
        }
        newMeasurements.flour = localMeasurements.flour * (localPercentages.flourPercent / 100);
        newMeasurements.water = localMeasurements.flour * (localPercentages.waterPercent / 100);
        newMeasurements.starter = localMeasurements.flour * (localPercentages.starterPercent / 100);
        newMeasurements.salt = localMeasurements.flour * (localPercentages.saltPercent / 100);

        console.log("new gram values:", JSON.stringify(newMeasurements));
        setMeasurements(() => newMeasurements);
    }

    const handlePercentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e.target.id);
        const {id, value} = e.target;
        console.log(`handlePercentInputChange: name ${id} value ${value}`);

        const newPercentages = {
            ...percentages,
            [id]: value.replace(/\D/g, "")
        };
        console.log("new measurements:", JSON.stringify(newPercentages));
        setPercentages(() => newPercentages);
        calculateGramValues(newPercentages, measurements, id);
    };


    return (
        <div className="sourdoughCalcPage" onClick={() => {
            // setName( (prevState) => {
            //     if(prevState === "Randi"){
            //         return "Eevee"
            //     } return "Randi"
            // });

        }}>
            <p className="info">
                This is a basic sourdough dough recipe calculator. It uses baker's percentages to calculator all the
                measurements for each ingredient
                based on the amount of flour you want to use. This calculator does NOT return volumetric measurements
                since they are not precise enough
                for sourdough.
                <br/>
                To use:<br/>
                -You can change any of the percentage values to calculate what you want your recipe to be(a basic sourdough recipe is prefilled)<br/>
                -Or if you prefer, you can also change the starting flour weight, e.g. you want 500g flour, the rest will adjust as needed.<br/>
                -Or if you
                want a recipe based on how much starter you have to start with, you can change the starter grams as well!
            </p>
            <div className="calculator">
                {/*<div className="infoRow">*/}

                {/*</div>*/}
                <div className="inputs">
                    <span>Ingredient</span>
                    <span id="percent">%</span>
                    <span id="grams">grams</span>

                    {/*<div className="flour">*/}
                        <label htmlFor="flour">Flour:</label>
                        <input type="text" id="flourPercent" value={percentages.flourPercent} onChange={handlePercentInputChange}/>
                        <input type="text" id="flour" value={measurements.flour} onChange={handleNumInputChange}/>
                    {/*</div>*/}
                    {/*<div className="water">*/}
                        <label htmlFor="water">Water:</label>
                        <input type="text" id="waterPercent" value={percentages.waterPercent} onChange={handlePercentInputChange}/>
                        <input type="text" id="water" value={measurements.water} onChange={handleNumInputChange}/>
                    {/*</div>*/}
                    {/*<div className="starter">*/}
                        <label htmlFor="starter">Starter:</label>
                        <input type="text" id="starterPercent" value={percentages.starterPercent} onChange={handlePercentInputChange}/>
                        <input type="text" id="starter" value={measurements.starter} onChange={handleNumInputChange}/>
                    {/*</div>*/}
                    {/*<div className="salt">*/}
                        <label htmlFor="salt">Salt:</label>
                        <input type="text" id="saltPercent" value={percentages.saltPercent} onChange={handlePercentInputChange}/>
                        <input type="text" id="salt" value={measurements.salt} onChange={handleNumInputChange}/>
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};

export default SourdoughCalcPage;
