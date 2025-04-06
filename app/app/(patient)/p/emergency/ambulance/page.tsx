// --@ts-nocheck
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function ComingSoonPage() {
  const numbers = [
    { service: "Ambulance (AP, GJ, UK, GA, TN, RJ, KA, AS, ML, MP, UP)", number: "108" },
    { service: "Police", number: "100" },
    { service: "National Emergency", number: "112" },
    { service: "Fire", number: "101" },
    { service: "Women Helpline", number: "1091" },
    { service: "Air Ambulance", number: "97 0000 1298" },
    { service: "AIDS Helpline", number: "1097" },
    { service: "Railway Enquiry", number: "139" },
    { service: "Senior Citizen Helpline", number: "1091 / 1291" },
  ];

  return (
    <ContentLayout title="Emergency Alerts">
      <div className="p-2">
        <Card className="shadow-xl rounded-2xl border-2 p-8">
          <div className="flex items-center gap-3 mb-6">
            
            <h1 className="text-3xl font-bold text-center">Emergency Numbers - India</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {numbers.map((item, index) => (
              <Card key={index} className="shadow-xl rounded-2xl border-2 border-accent">
                <CardHeader>
                  <CardTitle className="text-lg ">{item.service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-green-600">{item.number}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </Card>
      </div>
    </ContentLayout>
  );
}
