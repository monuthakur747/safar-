import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Calendar } from "lucide-react";

const PackageCard = ({ pkg }) => {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin size={18} /> {pkg.place}
        </h2>
        <p className="text-gray-600 flex items-center gap-2 mt-2">
          <Calendar size={16} /> {pkg.days}
        </p>
        <p className="text-lg font-bold mt-3">{pkg.price}</p>
        <Button className="w-full mt-4 flex items-center gap-2">
          <Plane size={16} /> Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;