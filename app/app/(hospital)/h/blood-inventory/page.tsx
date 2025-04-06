// --@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const BLOOD_GROUPS = [
  { short: "O+", full: "O Positive" },
  { short: "O-", full: "O Negative" },
  { short: "A+", full: "A Positive" },
  { short: "A-", full: "A Negative" },
  { short: "B+", full: "B Positive" },
  { short: "B-", full: "B Negative" },
  { short: "AB+", full: "AB Positive" },
  { short: "AB-", full: "AB Negative" },
];

export default function BloodInventoryPage() {
  const { userId } = useUser();
  const [inventory, setInventory] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchOrCreateInventory = async () => {
      const inventoryRef = doc(db, "hospital-blood-inventory", userId);
      const inventorySnap = await getDoc(inventoryRef);

      if (!inventorySnap.exists()) {
        // Create document with all blood groups initialized to 0 and needed = "no"
        const initialData = BLOOD_GROUPS.reduce((acc, group) => {
          const key = group.short.replace("+", "p").replace("-", "n");
          acc[`${key}_count`] = 0;
          acc[`${key}_needed`] = "no";
          return acc;
        }, {});
        await setDoc(inventoryRef, initialData);
        setInventory(initialData);
      } else {
        setInventory(inventorySnap.data());
      }
    };

    fetchOrCreateInventory();
  }, [userId]);

  const handleAdjust = (groupKey, delta) => {
    setInventory((prev) => ({
      ...prev,
      [groupKey]: Math.max(0, (prev[groupKey] || 0) + delta),
    }));
  };

  const handleToggleNeeded = (groupKey) => {
    setInventory((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey] === "yes" ? "no" : "yes",
    }));
  };

  const handleSave = async () => {
    const inventoryRef = doc(db, "hospital-blood-inventory", userId);
    await updateDoc(inventoryRef, inventory);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <ContentLayout title="Blood Inventory">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

        <div className="px-2">
          <h2 className="text-2xl font-semibold">Manage Blood Inventory</h2>
          <p className="text-foreground text-md mt-3">
            View and update your hospital's <span className=" text-accent">current blood stock</span> and <span className="text-accent">requirements</span> for your reference.
          </p>
          Monitor blood type availability and ensure timely fulfillment of patient needs.
          <p className="text-foreground text-md mt-3">
            Create requests & see appointments for blood that is needed in{' '}
            <Link href="/app/h/donor-management" className="text-accent underline hover:text-primary/80">
              Donor Management
            </Link>.
          </p>
        </div>
        <div className="flex justify-end w-full md:w-auto px-2">
          <Button className="bg-accent" onClick={handleEdit}>
            {isEditing ? "Save Changes" : "Upload Blood Inventory"}
          </Button>
        </div>
      </div>



      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          {/* Column Titles */}
          <div className="grid grid-cols-3 font-semibold border-b-2 border-foreground/70 pb-3">
            <div>Blood Group</div>
            <div className="text-center">Available</div>
            <div className="text-center">Needed</div>
          </div>

          {BLOOD_GROUPS.map((group) => {
            const key = group.short.replace("+", "p").replace("-", "n");
            const countKey = `${key}_count`;
            const neededKey = `${key}_needed`;
            return (
              <div
                key={group.short}
                className="grid grid-cols-1 sm:grid-cols-3 items-center border-b-2 border-gray-200 dark:border-gray-900 py-4 gap-4"
              >
                {/* Blood Group Name */}
                <div className="text-lg text-center sm:text-left">
                  {group.short} <span className="text-gray-500 text-sm">({group.full})</span>
                </div>

                {/* Available Quantity */}
                <div className="flex items-center justify-center space-x-2">
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10"
                      onClick={() => handleAdjust(countKey, -1)}
                    >
                      -
                    </Button>
                  )}
                  <Input
                    className="w-20 text-center"
                    value={inventory[countKey] ?? 0}
                    readOnly
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10"
                      onClick={() => handleAdjust(countKey, 1)}
                    >
                      +
                    </Button>
                  )}
                </div>

                {/* Needed Toggle */}
                <div className="flex justify-center sm:justify-center">
                  {isEditing ? (
                    <Switch
                      checked={inventory[neededKey] === "yes"}
                      onCheckedChange={() => handleToggleNeeded(neededKey)}
                    />
                  ) : (
                    <span className="text-sm">
                      {inventory[neededKey] === "yes" ? "Yes" : "No"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        </CardContent>
      </Card>
    </ContentLayout>
  );
}
