import { useFirestore } from "reactfire";
import { User } from "firebase/auth";
import DrinkCard from "./DrinkCard";
import AddDrinkDialog from "../DrinkForms/AddDrinkDialog";
import { createDrink, createEmptyDrink } from "@/firebase/DrinkHelpers";
import { useUserDrinkData } from "../Hooks/useUserDrinkData";

interface IDrinkDisplayProps {
    user: User;
    userId: string;
    isAdmin?: boolean;
    isEditable?: boolean;
    className?: string;
    filterByGroupUid?: string;
}

function DrinkDisplay({
    user,
    userId,
    isEditable = false,
    className,
    filterByGroupUid,
}: IDrinkDisplayProps) {
    const firestore = useFirestore();

    // Fetch user's drink data
    const userDrinkData = useUserDrinkData(firestore, user?.uid);

    return (
        <div className={className}>
            <div className="flex flex-wrap gap-4">
                {Object.values(userDrinkData).map((drinkData) => (
                    <DrinkCard
                        key={drinkData.id} // Assuming drinkData has a unique id
                        userUid={user?.uid}
                        drinkData={drinkData}
                        isEditable={isEditable}
                    />
                ))}

                {isEditable && (
                    <AddDrinkDialog
                        user={user}
                        baseDrinkData={createEmptyDrink()}
                        addDrinkCallback={createDrink}
                    />
                )}
            </div>
        </div>
    );
}

export default DrinkDisplay;
