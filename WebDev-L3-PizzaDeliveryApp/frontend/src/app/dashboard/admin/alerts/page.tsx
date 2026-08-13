import { constructMetadata } from '@/lib/metadata';
import React from 'react';
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | Admin | Alerts | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


const page = () => {
    return (
        <div className="mx-auto max-w-5xl px-6 py-10 min-h-screen">
            <p  className="text-4xl font-bold text-primary"> This feature will be available soon</p>
        </div>
    );
};

export default page;