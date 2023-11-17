import { Spinner } from "@material-tailwind/react";
 
export default function Loading() {
  return (
    <section className="pt-16 bg-blueGray-50">
        <div className="w-md px-4 mx-auto">
        <div className="flex flex-wrap justify-center">

            <div className="flex items-end gap-8">
                <Spinner color="green" className="h-12 w-12" />
            </div>
        </div>
        </div>
    </section>
  );
}