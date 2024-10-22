import { IMenu } from "@/interfaces/IMenu";
import { useFirestore } from "reactfire";

interface IDrinkDisplayProps {
    userDrinkData: IMenu;
    isAdmin?: boolean;
}
function DrinkDisplay(props: IDrinkDisplayProps) {
    const { userDrinkData, isAdmin } = props;
    console.log(userDrinkData);

    return (
        <div>
            <p>Drink Data</p>
            <div className="flex flex-wrap">
                {Object.values(userDrinkData).map((drinkData) => {
                    return (
                        <div
                            key={`drinkCard-${drinkData.uuid}`}
                            className="w-[200px] h-[300px] border border-black flex flex-col justify-between"
                        >
                            <div className="h-[20%]">
                                <p>{drinkData.name}</p>
                                <p>{drinkData.address}</p>
                            </div>
                            <div className="h-[60%]">body</div>

                            <div className="h-[20%]">
                                <p>{drinkData.uuid}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DrinkDisplay;
