'use client'
import { Button } from "@material-tailwind/react";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import { userController } from '@/app/controllers';

import { Spinner } from "@material-tailwind/react";

export default function Page() {
    const { user } = useAuthContext()
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleMatch = async () => {
        setIsLoading(true);
        const response = await userController.getAll();
      
        const userClassIds = user.classes.map(userClass => userClass.id); 
        console.log('User Class IDs:', userClassIds);
      
        const matchedResults = response.results?.filter(otherUser => {

            if (otherUser.id === user.id) {
                return false;
                }
          const matches = otherUser.classes.filter(cls => 
            userClassIds.includes(cls.id)
          ) || []
      
          return matches.length > 0;
      
        });
      
        console.log('Matched Results:', matchedResults);
      
        setResults(matchedResults || []);
        setIsLoading(false);
      };

    return (
        <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto">   
        <div className="flex flex-wrap justify-center pb-3">
        {isLoading && <Spinner /> }
        {!isLoading && <Button onClick={handleMatch} color='blue' >Match</Button>}
        </div>
            <div class="grid grid-cols-4 gap-4">
                {results?.map((result) => (
                <a key={result.id} class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{result.name}</h5>
                {result.classes.map((cls) => (
                    <p key={cls.id} class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">{cls.department_code} {cls.class_code}</p>
                ))}
                </a> 
                ))}
            </div>
            </div>
        </section>
    )
    }