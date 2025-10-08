import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none">
      <CardContent className="p-6 pt-20 pb-20">
        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative">
            <h1 className="flex justify-center items-center text-center p-8 text-[1.2rem] font-bold">
              Coming Soon! We're currently building this!
            </h1>
            <Image
              src="/placeholder.png"
              alt="Placeholder Image"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
