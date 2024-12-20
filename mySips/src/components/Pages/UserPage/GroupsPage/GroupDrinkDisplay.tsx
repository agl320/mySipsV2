import { useUserGroupDrinkData } from "@/components/Hooks/useUserGroupDrinkData";
import { User } from "firebase/auth";
import { useFirestore } from "reactfire";
import GroupItem from "./GroupItem";
import { useEffect, useState } from "react";
import { getAllGroupUids } from "@/firebase/DrinkHelpers";
import { useAllGroupDrinks } from "@/components/Hooks/useAllGroupDrinks";
import { useAllGroupEntries } from "@/components/Hooks/useAllGroupEntries";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle, LoaderIcon } from "lucide-react";
import CustomLoader from "@/components/CustomLoader/CustomLoader";

function GroupDrinkDisplay(props: {
    user: User;
    groupUid: string;
    userGroups: any;
}) {
    const { groupUid, userGroups } = props;
    const firestore = useFirestore();

    // Retrieves ALL
    // const groupDrinkData = useAllGroupDrinks(firestore, userGroups);

    // Retrieves only shell
    const groupEntries = useAllGroupEntries(firestore, userGroups);

    if (!Object.hasOwn(groupEntries, groupUid)) return <CustomLoader />;

    return (
        <div className="flex flex-wrap gap-4 mt-8">
            {Object.values(groupEntries[groupUid]).map(
                (groupDrink: any, index) => (
                    <GroupItem
                        userUid={groupDrink.userUid}
                        drinkUid={groupDrink.drinkUid}
                        groupUid={groupUid}
                        key={`gi-${index}`}
                    />
                )
            )}
        </div>
    );
}

export default GroupDrinkDisplay;