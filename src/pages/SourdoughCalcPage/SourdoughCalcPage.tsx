import React, {useEffect, useMemo, useState} from "react";
import "./SourdoughCalcPage.scss";
import AddIcon from "./AddIcon.tsx";

interface SourdoughCalcPageProps {

}

type IngredientT = {
    name: string;
    percentage: number;
    id: string;
}

type RecipeIngredientsT = {
    baseIngredients: {
        breadFlour: IngredientT;
        water: IngredientT;
        starter: IngredientT;
        salt: IngredientT;
    };
    additionalFlours: IngredientT[];
};

const SourdoughCalcPage = (props: SourdoughCalcPageProps) => {
    const generateIngredientId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const TAG = "[SourdoughCalcPage.tsx]";
    const [totalFlourG, setTotalFlourG] = useState(400);
    const [ingredients, setIngredients] = useState<RecipeIngredientsT>({
        baseIngredients: {
            breadFlour: {
                name: "Bread Flour",
                percentage: 100,
                id: generateIngredientId()
            },
            water: {
                name: "water",
                percentage: 68,
                id: generateIngredientId()
            },
            starter: {
                name: "Starter",
                percentage: 17,
                id: generateIngredientId()
            }, salt: {
                name: "salt",
                percentage: 2,
                id: generateIngredientId()
            }
        },
        additionalFlours: []
    });


    const getMeasurement = (ingredient: IngredientT) => {
        return (ingredient.percentage / 100) * totalFlourG;
    };

    const getTotalFlourPercentage = useMemo(() => {
        return ingredients.baseIngredients.breadFlour.percentage + ingredients.additionalFlours.reduce((accumulator, flour) => {
            return accumulator + flour.percentage;
        }, 0);
    }, [ingredients]);


    const addFlourRow = (event: React.MouseEvent<HTMLDivElement>) => {
        const newFlour: IngredientT = {
            name: "Whole Wheat",
            percentage: 10,
            id: generateIngredientId(),
        };

        setIngredients(prevIngredients => ({
            ...prevIngredients,
            additionalFlours: [...prevIngredients.additionalFlours, newFlour],
        }));
    };

    const deleteFlourRow = (id: string) => (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        setIngredients((prevIngredients) => ({
            ...prevIngredients,
            additionalFlours: [...prevIngredients.additionalFlours.filter((flour) => {
                return flour.id !== id;
            })]
        }));
    };

    const updateIngredient = (id: string, newPercentage?: number, newName?: string) => {
        const baseIngredientKeys = Object.keys(ingredients.baseIngredients) as Array<keyof RecipeIngredientsT["baseIngredients"]>;

        for (const key of baseIngredientKeys) {
            if (ingredients.baseIngredients[key].id === id) {
                const updatedBaseIngredient = {
                    ...ingredients.baseIngredients[key],
                    percentage: newPercentage !== undefined ? newPercentage : ingredients.baseIngredients[key].percentage,
                    name: newName !== undefined ? newName : ingredients.baseIngredients[key].name,
                };

                setIngredients(prevIngredients => ({
                    ...prevIngredients,
                    baseIngredients: {
                        ...prevIngredients.baseIngredients,
                        [key]: updatedBaseIngredient,
                    },
                }));
                return;
            }
        }

        const additionalFlourIndex = ingredients.additionalFlours.findIndex(flour => flour.id === id);

        if (additionalFlourIndex !== -1) {
            const updatedFlour = {
                ...ingredients.additionalFlours[additionalFlourIndex],
                percentage: newPercentage !== undefined ? newPercentage : ingredients.additionalFlours[additionalFlourIndex].percentage,
                name: newName !== undefined ? newName : ingredients.additionalFlours[additionalFlourIndex].name,
            };

            // Update the state for additional flours
            setIngredients(prevIngredients => ({
                ...prevIngredients,
                additionalFlours: [
                    ...prevIngredients.additionalFlours.slice(0, additionalFlourIndex),
                    updatedFlour,
                    ...prevIngredients.additionalFlours.slice(additionalFlourIndex + 1),
                ],
            }));
        }
    };

    const handleInputChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = Number(event.target.value);
        if (!isNaN(newPercentage)) {
            updateIngredient(id, newPercentage);
        }
    };

    return (
        <div className="sourdoughCalcPage">
            <p className="info">
                This is a basic sourdough dough recipe calculator. It uses baker's percentages to calculator all the
                measurements for each ingredient
                based on the amount of flour you want to use. This calculator does NOT return volumetric
                measurements
                since they are not precise enough
                for sourdough.
                <br/>
                To use:<br/>
                -You can change any of the percentage values to calculate what you want your recipe to be(a basic
                sourdough recipe is prefilled)<br/>
                -Or if you prefer, you can also change the starting flour weight, e.g. you want 500g flour, the rest
                will adjust as needed.<br/>
                <a href={"https://www.kingarthurbaking.com/pro/reference/bakers-percentage"} target={"_blank"}>Want
                    to learn more about bakers percentages? Click Here!</a>
            </p>
            <div className="calculator">
                <div className="infoRow">
                    <span>ingredient</span>
                    <span>%</span>
                    <span>grams</span>
                </div>
                <div className="inputs">
                    <>
                        <section>
                            <label>Total Flour(g):</label>
                            {getTotalFlourPercentage === 100 ?
                                <br/>
                                :
                                <div style={{
                                    fontSize: "1rem",
                                    wordWrap: "break-word",
                                    border: "2px solid red"
                                }}>
                                    Flour percentages must<br/>up to 100%<br/>
                                    Current total is {getTotalFlourPercentage}
                                </div>

                            }
                            <input type="number" value={totalFlourG} onChange={(event) => {
                                setTotalFlourG(Number(event.target.value));
                            }}/>
                        </section>
                    </>
                    <section className="flour">
                        <label htmlFor="flour">Flour:</label>
                        <input type="number" id="flourPercent" value={ingredients.baseIngredients.breadFlour.percentage}
                               onChange={handleInputChange(ingredients.baseIngredients.breadFlour.id)}/>
                        <span id="flour">{getMeasurement(ingredients.baseIngredients.breadFlour)}g</span>
                        <div className="add RowBtn" onClick={addFlourRow}>
                            <AddIcon width={20} height={20}/>
                        </div>
                    </section>
                    {ingredients.additionalFlours.map((flour, index) => {
                        return <section id={flour.name} key={index}>
                            <input value={flour.name} onChange={(event) => {
                                updateIngredient(flour.id, undefined, event.target.value);
                            }}/>
                            <input type="number" id={`customFlour-${index}Percentage`}
                                   value={flour.percentage}
                                   onChange={handleInputChange(flour.id)}/>
                            <span id={`customFlour-${index}`}>{getMeasurement(flour)}g</span>
                            <div className="del RowBtn" onClick={deleteFlourRow(flour.id)}>
                                <AddIcon width={20} height={20}/>
                            </div>
                        </section>;
                    })}
                    <section className="water">
                        <label htmlFor="water">Water:</label>
                        <input type="number" id="waterPercent" value={ingredients.baseIngredients.water.percentage}
                               onChange={handleInputChange(ingredients.baseIngredients.water.id)}/>
                        <span id="water">{getMeasurement(ingredients.baseIngredients.water)}g</span>
                    </section>
                    <section className="starter">
                        <label htmlFor="starter">Starter:</label>
                        <input type="number" id="starterPercent" value={ingredients.baseIngredients.starter.percentage}
                               onChange={handleInputChange(ingredients.baseIngredients.starter.id)}/>
                        <span id="starter">{getMeasurement(ingredients.baseIngredients.starter)}g</span>
                    </section>
                    <section className="salt">
                        <label htmlFor="salt">Salt:</label>
                        <input type="number" id="saltPercent" value={ingredients.baseIngredients.salt.percentage}
                               onChange={handleInputChange(ingredients.baseIngredients.salt.id)}/>
                        <span id="salt">{getMeasurement(ingredients.baseIngredients.salt)}g</span>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SourdoughCalcPage;
