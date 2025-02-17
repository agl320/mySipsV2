import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { IStore } from "../../interfaces/IStore";

import StoreDisplay from "./StoreDisplay";
import AdminDrinkDeleteForm from "./Admin/AdminDrinkDeleteForm";
import AdminDrinkAddForm from "./Admin/AdminDrinkAddForm";
import AdminStoreAddForm from "./Admin/AdminStoreAddForm";
import StoreDropdown from "./StoresDropdown";
import AdminStoreDeleteForm from "./Admin/AdminStoreDeleteForm";

import { v4 as uidv4 } from "uuid";
import { Separator } from "../ui/separator";

function PublicStores({ firebaseDB }: { firebaseDB: Firestore }) {
    const [storesState, setStoresState] = useState<Record<string, IStore>>({});

    const [selectedStoreUUID, setSelectedStoreUUID] = useState<string>("");

    // Listener for Firestore database
    const unsubscribeAll = onSnapshot(
        collection(firebaseDB, "stores"),
        (querySnapshot) => {
            if (querySnapshot) {
                const newStoreDrinks = {};
                querySnapshot.forEach((doc) => {
                    newStoreDrinks[doc.id] = doc.data();
                });

                if (!isEqual(newStoreDrinks, storesState)) {
                    setStoresState(newStoreDrinks);
                }
            }
        }
    );

    // Init dropdown
    useEffect(() => {
        if (Object.keys(storesState).length !== 0 && selectedStoreUUID === "") {
            setSelectedStoreUUID(Object.keys(storesState)[0]);
        }
    }, [selectedStoreUUID, storesState]);

    const saveStoresState = async () => {
        if (!Object.hasOwn(storesState, selectedStoreUUID)) return;
        try {
            setDoc(
                doc(collection(firebaseDB, "stores"), selectedStoreUUID),
                storesState[selectedStoreUUID]
            );
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    /** Delete storesState with specific store uid from server */
    const deleteStoreFromState = async () => {
        await deleteDoc(doc(firebaseDB, "stores", selectedStoreUUID));
        setSelectedStoreUUID("");
    };

    /** Create new storesState with generated uid */
    const addStoreToState = (storeState: IStore) => {
        const uid = uidv4();
        try {
            setDoc(doc(collection(firebaseDB, "stores"), uid), {
                uid: uid,
                storeName: storeState.storeName.trim() ?? "",
                storeMenu: {},
            });
            // setSelectedStoreUUID(uid);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // useEffect to update server storesState upon local storesState change
    useEffect(() => {
        console.log({ storesState });
        saveStoresState();
    }, [storesState]);

    return (
        <>
            <div>
                {Object.keys(storesState).length > 0 ? (
                    <div style={{ border: "1px solid black", padding: "5px" }}>
                        <StoreDropdown
                            storesState={storesState}
                            selectedStoreUUID={selectedStoreUUID}
                            setSelectedStoreUUID={setSelectedStoreUUID}
                        />

                        <AdminDrinkAddForm
                            storesState={storesState}
                            setStoresState={setStoresState}
                            selectedStoreUUID={selectedStoreUUID}
                        />

                        {Object.hasOwn(storesState, selectedStoreUUID) &&
                        Object.keys(storesState[selectedStoreUUID].storeMenu)
                            .length > 0 ? (
                            <AdminDrinkDeleteForm
                                storesState={storesState}
                                setStoresState={setStoresState}
                                selectedStoreUUID={selectedStoreUUID}
                            />
                        ) : (
                            <p>No drinks in store</p>
                        )}
                        <Separator className="my-4" />
                        <div className="flex text-right">
                            <AdminStoreAddForm
                                storesState={storesState}
                                setStoresState={setStoresState}
                                addNewStore={addStoreToState}
                            />
                            <AdminStoreDeleteForm
                                storesState={storesState}
                                setStoresState={setStoresState}
                                selectedStoreUUID={selectedStoreUUID}
                                deleteStore={deleteStoreFromState}
                            />
                        </div>
                    </div>
                ) : (
                    <p>No stores in database</p>
                )}
            </div>

            <div>
                <p>Admin View Stores</p>
                <StoreDisplay storesState={storesState} />
            </div>
        </>
    );
}

export default PublicStores;
