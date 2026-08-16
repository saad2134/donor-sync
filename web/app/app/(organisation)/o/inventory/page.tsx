// --@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Droplet, Save, Edit, Plus, Minus, Warehouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BLOOD_GROUPS = [
  { short: "O+", key: "op", full: "O Positive" },
  { short: "O-", key: "on", full: "O Negative" },
  { short: "A+", key: "ap", full: "A Positive" },
  { short: "A-", key: "an", full: "A Negative" },
  { short: "B+", key: "bp", full: "B Positive" },
  { short: "B-", key: "bn", full: "B Negative" },
  { short: "AB+", key: "abp", full: "AB Positive" },
  { short: "AB-", key: "abn", full: "AB Negative" },
];

export default function NGOInventoryPage() {
  const { toast } = useToast();
  const { userId } = useUser();
  const [inventory, setInventory] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) return;

    const fetchOrCreateInventory = async () => {
      setLoading(true);
      try {
        const inventoryRef = doc(db, "ngo-blood-inventory", userId);
        const inventorySnap = await getDoc(inventoryRef);

        if (!inventorySnap.exists()) {
          const initialData = BLOOD_GROUPS.reduce((acc: any, group) => {
            acc[`${group.key}_count`] = 0;
            return acc;
          }, {});
          await setDoc(inventoryRef, initialData);
          setInventory(initialData);
        } else {
          setInventory(inventorySnap.data());
        }
      } catch (err) {
        console.error("Failed to load central inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateInventory();
  }, [userId]);

  const handleAdjust = (groupKey: string, delta: number) => {
    setInventory((prev: any) => ({
      ...prev,
      [`${groupKey}_count`]: Math.max(0, (prev[`${groupKey}_count`] || 0) + delta),
    }));
  };

  const handleInputChange = (groupKey: string, val: string) => {
    const num = parseInt(val, 10) || 0;
    setInventory((prev: any) => ({
      ...prev,
      [`${groupKey}_count`]: Math.max(0, num),
    }));
  };

  const handleSave = async () => {
    if (!db) return;
    try {
      setLoading(true);
      const inventoryRef = doc(db, "ngo-blood-inventory", userId);
      await updateDoc(inventoryRef, inventory);
      setIsEditing(false);
      toast({
        title: "💾 Inventory Saved",
        description: "Central warehouse stock levels successfully updated.",
      });
    } catch (err) {
      console.error("Failed to save central inventory:", err);
      toast({
        title: "❌ Save Failed",
        description: "Could not update stock levels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalUnits = BLOOD_GROUPS.reduce((acc, bg) => acc + (inventory[`${bg.key}_count`] || 0), 0);

  return (
    <ContentLayout title="Central Inventory">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-red-500 shrink-0" />
            <h2 className="text-2xl font-semibold">Central NGO Inventory</h2>
          </div>
          <p className="text-foreground text-md mt-2">
            Monitor and coordinate central repository reserves and supply units.
          </p>
        </div>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700 text-white gap-1.5" : "bg-accent text-white gap-1.5"}
          disabled={loading}
        >
          {isEditing ? (
            <><Save className="h-4 w-4" /> Save Levels</>
          ) : (
            <><Edit className="h-4 w-4" /> Edit Levels</>
          )}
        </Button>
      </div>

      <div className="space-y-6 px-2">
        {/* Total Stock Banner */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Warehouse Reserves</p>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">{totalUnits} units</h3>
            </div>
            <Droplet className="h-10 w-10 text-red-500 fill-red-500 shrink-0" />
          </CardContent>
        </Card>

        {loading && Object.keys(inventory).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading stock levels...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {BLOOD_GROUPS.map((bg) => {
              const count = inventory[`${bg.key}_count`] || 0;

              return (
                <Card key={bg.key} className="shadow-md border border-border/40 hover:shadow-lg transition rounded-2xl relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-red-600 dark:text-red-500">{bg.full}</CardTitle>
                    <CardDescription>Group: {bg.short}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Current Stock:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          className="w-20 text-center font-bold text-sm h-8"
                          value={count}
                          onChange={(e) => handleInputChange(bg.key, e.target.value)}
                        />
                      ) : (
                        <span className="font-extrabold text-lg text-foreground">{count} units</span>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/20">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleAdjust(bg.key, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleAdjust(bg.key, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
